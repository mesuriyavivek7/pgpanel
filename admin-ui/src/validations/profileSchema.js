import { z } from "zod"

export const profileSchema = z.object({
    full_name:z.
    string()
    .min(1, { message:"Full name is required." }),

    email: z
    .string()
    .min(1, {message:"Email address is required."})
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
        message: "Invalid email address format.",
    })
    
})