import {z} from 'zod'
export const acceptSchema=z.object({
    acceptMessage: z.boolean()
})