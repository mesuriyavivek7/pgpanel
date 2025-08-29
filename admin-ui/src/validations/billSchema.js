import {z} from 'zod'

export const billSchema = z.object({
    payment_name:z
    .string()
    .min(1, {message:"Monthly bill name is required."}),

    notes:z
    .string()
    .optional(),

    branch: z
    .string() 
    .min(1, {message:"Branch name is required."}),

    amount: z
    .number({invalid_type_error: "Amount must be number."})
    .min(1, {message:"Minimum value is 1."}),

    starting_date: z
    .date({invalid_type_error:"Starting date is required"})

})