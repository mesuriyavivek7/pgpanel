import {z} from "zod"

export const branchSchema = z.object({
    branch_name: z.string().min(1, {message:"Branch name is required."}),
    branch_address: z.string().min(1, {message:"Branch address is required."})
})