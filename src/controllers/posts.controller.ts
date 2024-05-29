import prisma from "../db";
import { Request, Response } from 'express';
import { Post } from "../models/post";
import { validate } from "class-validator";

export const getPosts = async (req: Request, res: Response) => {
    const posts = await prisma.post.findMany();
    
    return res.json(posts);
};

export const getPost = async (req: Request, res: Response) => {
    const postId = parseInt(req.query.id as string);
    console.log(req.session);
    
    if (postId == null || postId === 0) {
        return res.status(400).json({
            error: "Post id can't be null or <= 0"
        });
    }
    
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    });
    
    if (post === null) {
        return res.status(404).send({
            error: "Post not found."
        })
    }
    
    return res.json(post);
};

export const createPost = async (req: Request, res: Response) => {
    const { title, name, content } = req.body;
    const postModel = new Post(title, name, content, req.session.user!.id);
    
    const validation = await validate(postModel);

    if (validation.length > 0){
        return res.status(400).send({
           errors: validation, 
        });
    }
    
    const post = await prisma.post.create({
        data: postModel
    });
    
    return res.json(post);
};