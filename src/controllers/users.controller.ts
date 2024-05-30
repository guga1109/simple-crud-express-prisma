import { Request, Response } from 'express';
import { LoginSchema } from "../models/login";
import prisma from "../db";
import bcrypt from "bcrypt";

/**
 * Handles user login.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 *
 * @returns A Promise that resolves to void.
 *
 * @throws Will throw an error if the email or password is invalid.
 * @throws Will throw an error if there is an internal server error.
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        
        const validation = LoginSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).send({
                errors: validation.error,
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

/**
 * Handles user sign up.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 *
 * @returns A Promise that resolves to void.
 *
 * @throws Will throw an error if the email is already in use.
 * @throws Will throw an error if the email or password is invalid.
 * @throws Will throw an error if there is an internal server error.
 */
export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        
        const validation = LoginSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).send({
                errors: validation.error,
            });
        }
        
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
        
        await prisma.user.signUp(name, email, password);
        
        return res.status(200).json({
            message: 'Account created successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * Handles user logout.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 *
 * @returns A Promise that resolves to void.
 *
 * @remarks
 * This function logs out the user by clearing the session data and redirecting to the home page.
 */
export const logout = async (req: Request, res: Response) => {
    req.session.save(() => {
        req.session.user = undefined;
        
        return res.status(200).redirect('/');
    });
};