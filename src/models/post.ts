import { z } from "zod";

export const PostSchema = z.object({
    id: z.number(),
    title: z.string().min(5).max(20, {
        message: 'Post title must be between 5 and 20 characters long'
    }),
    content: z.string().min(5).max(500, {
        message: 'Post content must be between 5 and 500 characters long'
    }),
    active: z.boolean()
})