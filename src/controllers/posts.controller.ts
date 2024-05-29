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
    const { title, content } = req.body;
    const postModel = new Post(title, content, true, req.session.user!.id);
    
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

export const updatePost = async (req: Request, res: Response) => {
    const user = req.session.user!;

    const { id, title, content, active } = req.body;

    const postModel = new Post(title, content, active,  req.session.user!.id);

    const validation = await validate(postModel);

    if (validation.length > 0){
        return res.status(400).send({
            errors: validation,
        });
    }
    
    const post = await prisma.post.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!post) {
        return res.status(400).json({
            error: "Post not found"
        });
    }
    
    if (post.authorId !== user.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    await prisma.post.update({
        where: {
            id: id
        },
        data: postModel
    });
    
    return res.json({
        message: 'Post updated successfully'
    });
}

export const deletePost = async (req: Request, res: Response) => {
    const user = req.session.user!;
    
    const { id } = req.params;
    
    const post = await prisma.post.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    
    if (!post) {
        return res.status(400).json({
            error: "Post not found"
        });
    }
    
    if (post.authorId !== user.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    await prisma.post.delete({
        where: {
            id: parseInt(id)
        }
    });
    
    return res.json({ message: 'Post deleted successfully' });
};