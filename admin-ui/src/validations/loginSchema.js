import { z } from "zod"


export const loginSchema = z.object({
    email: z.string().min(1,{message:"Email is required."}).email({message:"Invalid email address."}),
    password: z.string().min(1, {message:'Password is required.'}),
    userType: z.enum(["Admin","Account"], {
        required_error:"User type is required."
    })
})