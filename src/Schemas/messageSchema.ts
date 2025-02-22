import {z} from 'zod'
export const MessageSchema=z.object({
    content: z
    .string().min(10,{message:"Content must be at aleast 10 characters "})
    .max(300,{message:"Content must not be more than 300 characters"})
})