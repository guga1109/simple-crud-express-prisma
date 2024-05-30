import prisma from "../db";
import { Request, Response } from 'express';
import { PostSchema } from "../models/post";
import {LoginSchema} from "../models/login";

/**
 * Retrieves a list of all posts from the database.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 *
 * @returns {Promise<Response>} - A Promise that resolves to an Express response object containing the list of posts.
 */
export const getPosts = async (req: Request, res: Response) => {
    const posts = await prisma.post.findMany();
    
    return res.json(posts);
};

/**
 * Retrieves a single post from the database based on the provided post id.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 *
 * @returns {Promise<Response>} - A Promise that resolves to an Express response object containing the requested post.
 * If the post id is null or less than or equal to 0, a 400 status code with an error message is returned.
 * If the post is not found in the database, a 404 status code with an error message is returned.
 * Otherwise, a 200 status code with the requested post is returned.
 */
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

/**
 * Creates a new post in the database.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 *
 * @returns {Promise<Response>} - A Promise that resolves to an Express response object.
 * If the request body is not valid according to the PostSchema, a 400 status code with an error message is returned.
 * Otherwise, a 200 status code with the newly created post is returned.
 */
export const createPost = async (req: Request, res: Response) => {
    const { title, content } = req.body;
    
    const postModel = {
        title: title,
        content: content,
        active: true,
        authorId: req.session.user!.id
    };

    const validation = PostSchema.safeParse(postModel);

    if (!validation.success) {
        return res.status(400).send({
            errors: validation.error,
        });
    }
    
    const post = await prisma.post.create({
        data: postModel
    });
    
    return res.json(post);
};

/**
 * Updates an existing post in the database.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 *
 * @returns {Promise<Response>} - A Promise that resolves to an Express response object.
 * If the request body is not valid according to the PostSchema, a 400 status code with an error message is returned.
 * If the post is not found in the database, a 400 status code with an error message is returned.
 * If the user is not the author of the post, a 401 status code with an error message is returned.
 * Otherwise, a 200 status code with a success message is returned.
 */
export const updatePost = async (req: Request, res: Response) => {
    const user = req.session.user!;

    const { id, title, content, active } = req.body;

    const postModel = {
        title: title,
        content: content,
        active: active,
        authorId: req.session.user!.id
    };

    const validation = PostSchema.safeParse(postModel);

    if (!validation.success) {
        return res.status(400).send({
            errors: validation.error,
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
    
    if (post.authorId!== user.id) {
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

/**
 * Deletes a post from the database.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 *
 * @returns {Promise<Response>} - A Promise that resolves to an Express response object.
 * If the post is not found in the database, a 400 status code with an error message is returned.
 * If the user is not the author of the post, a 401 status code with an error message is returned.
 * Otherwise, a 200 status code with a success message is returned.
 */
export const deletePost = async (req: Request, res: Response) => {
    const user = req.session.user!; // Assuming req.session.user is defined and authenticated
    
    const { id } = req.params; // Assuming req.params.id contains the post id
    
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
    
    if (post.authorId!== user.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    await prisma.post.delete({
        where: {
            id: parseInt(id)
        }
    });
    
    return res.json({ message: 'Post deleted successfully' });
};