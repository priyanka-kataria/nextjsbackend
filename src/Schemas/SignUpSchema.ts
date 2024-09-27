import {z} from 'zod'
export const usernameValidation = z
.string()
.min(2,"Username must be atleat 2 character")
.max(20,"Username must be no more than 20 characters")
// .regex(/^[a-zA-Z0-9]+ $/,"Username must not contains special characters")

export const signUpSchema=  z.object({
    username: usernameValidation,
    email:z.string().email({message:" invalid email address"}),
    password: z.string().min(6,{message:"password must be atleat 6 character"})
})