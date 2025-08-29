import {z} from 'zod'

export const billPaySchema = (pending_amount) => z.object({
    date: z
    .string() 
    .min(1, {message:"Please select date of payment."}),

    amount: z.
    number({invalid_type_error: "Salary amount must be number."}).
    min(1, {message: "Minimum value is 1."})
    .refine(
        (val) => val <= pending_amount,
        {message: `Amount can't be greater then pending amount (₹${pending_amount}).`}
    ),

    payment_mode: z.
    string()
    .min(1, {message:"Please select payment mode."}),

    bank_account: z.
    string()
    .min(1, {message:"Please select bank account."})
})