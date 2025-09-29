import { z } from "zod";

export const customerSchema = z.object({
  customer_name: z
    .string()
    .min(1, { message: "Customer name is required." }),

  mobile_no: z
    .string()
    .min(1, { message: "Mobile number is required." })
    .regex(/^[6-9]\d{9}$/, {
      message: "Enter a valid 10-digit Indian mobile number.",
    }),

  deposite_amount: z
    .number({ invalid_type_error: "Deposit amount must be a number." })
    .min(0, { message: "Minimum value is 0." }),

  rent_amount: z
  .number({invalid_type_error: 'Rent amount must be a number.'})
  .min(0, {message: 'Minimum value is 0.'}),

  room: z
    .string()
    .min(1, { message: "Please select any of one room." }),

  branch: z
    .string()
    .min(1, { message: "Please select branch." }),

  joining_date: z
    .date({ invalid_type_error: "Joining date is required." }),
  
  payment_mode: z.string().min(1, {message:"Please select payment mode."}),

  bank_account: z.
  string()
  .min(1, {message:"Please select bank account."}),
});
