import {z} from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Invalid email format"
    }),
    password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?%#&^]{8,}$/, {
        message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase, one number and one special character"
    })
})