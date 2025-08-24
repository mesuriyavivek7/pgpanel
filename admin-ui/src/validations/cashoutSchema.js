import {z} from "zod";

export const cashoutSchema = z.object({
    person_name: z.string().min(1, {message:'Person name is required.'}),
    mobile_no: z.string().optional(),
    notes: z.string().optional(),
    amount:z.coerce.number({ invalid_type_error: "Amount must be a number." })
    .min(0, { message: "Minimum value is 0." }),
    transactionType:z.string().min(1, {message:"Please select transaction type."}),
    payment_mode: z.string().min(1, {message:"Please select payment mode."}),
    bank_account: z.string().min(1, {message:"Please select bank account."})
})