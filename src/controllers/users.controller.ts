import { Request, Response } from 'express';
import { validate } from "class-validator";
import { Login } from "../models/login";
import prisma from "../db";
import {User} from "../models/user";
import bcrypt from "bcrypt";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        
        const validation = await validate(new Login(email, password));

        if (validation.length > 0){
            return res.status(400).send({
                errors: validation,
            });
        }
        
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        
        if (!user)
            return res.status(401).send({
                message: 'Invalid email or password',
            });
        
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        
        if (!passwordMatch)
            return res.status(401).send({
                message: 'Invalid email or password',
            });
        
        req.session.save(function(err)  {
           req.session.user = {
               id: user.id,
               name: user.name
           }
           
           return res.json(req.session);
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const validation = await validate(new User(email, password, name));
        
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        
        if (existingUser)
        {
            return res.status(400).json({
                error: "Email already in use"
            })
        }

        if (validation.length > 0){
            return res.status(400).send({
                errors: validation,
            });
        }
        
        await prisma.user.signUp(name, email, password);
        
        return res.status(200).json({
            message: 'Account created successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const logout = async (req: Request, res: Response) => {
    req.session.save(() => {
        req.session.user = undefined;
        
        return res.status(200).redirect('/');
    });
};
