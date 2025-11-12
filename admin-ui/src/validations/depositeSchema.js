import {z} from 'zod'

export const depositeSchema = z.object({
    customer: z.
    string()
    .min(1, { message: 'Customer id is required.'}),

    amount: z.
    number({invalid_type_error: "Deposit amount must be number."})
    .min(1, { message: 'Minimum value is 1.'}),

    payment_mode: z.
    string()
    .min(1, {message:"Please select payment mode."}),

    bank_account: z.
    string()
    .min(1, {message:"Please select bank account."})

})