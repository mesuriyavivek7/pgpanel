import {z} from 'zod'

export const customerAdvanceRentSchema = z.object({
    customer: z.
    string()
    .min(1, { message: 'Customer id is required.'}),
  
    month: z.
    number({invalid_type_error:"Please select month of payment."})
    .min(1, {message: "Please select date of payment."}),

    year: z. 
    number({invalid_type_error:"Please select year of payment."})
    .min(1, {message: "Please select year of payment."}),

    amount: z.
    number({invalid_type_error: "Rent amount must be number."})
    .min(1, {message: "Advance rent amount must be at least 1."}),

    payment_mode: z.
    string()
    .min(1, {message: "Please select payment mode."}),

    bank_account: z.
    string()
    .min(1, {message: "Please select bank account."})
})
