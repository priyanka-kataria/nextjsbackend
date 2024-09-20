import {z} from 'zod'
export const verifyScema=z.object({
    code: z.string().length(6,"verification code  must be atleat 6 digits")
})