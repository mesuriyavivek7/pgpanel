import {z} from 'zod'

export const customerRentSchema = z.object({
    customer: z.
    string()
    .min(1, { message: 'Customer id is required.'}),
  
    date: z.
    string()
    .min(1, {message: "Please select date of payment."}),

    amount: z.
    number({invalid_type_error: "Rent amount must be number."})  
    .optional(),

    isDeposite: z.
    boolean({invalid_type_error: "isDeposite must be boolean."})
    .default(false),

    payment_mode: z.
    string()
    .optional(),

    bank_account: z.
    string()
    .optional()

})
.refine(
    (data) =>
      data.isDeposite || (!!data.payment_mode && !!data.bank_account && !!data.amount),
    {
      message: "payment_mode, bank_account, and amount are required when not a deposit.",
      path: ["payment_mode"], // 👈 you can point to one field or leave blank
    }
  );