import {z} from "zod";


export const changePasswordSchema = z.object({
    current_password: z.string().min(1, {message:"Current password is required."}),
    password: z.string().min(1, {message:"Password is required."}),
    confirm_password: z.string().min(1, {message:"Confirm password is required."})
})