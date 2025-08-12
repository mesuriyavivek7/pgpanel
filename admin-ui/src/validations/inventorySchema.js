import { z } from 'zod'

export const inventorySchema = z.object({
   item_name: z.string().min(1, {message:"Inventory name is required."}),
   item_type: z.string().min(1, {message:'Please select item type.'}),
   amount: z.number({invalid_type_error: "Amount must be a number."}).min(0, {message:"Minimum value is 0."}),
   payment_mode: z.string().min(1, {message:"Please select payment mode."}),
   bank_account: z.
   string()
   .min(1, {message:"Please select bank account."}),
   branch:z.string().min(1, {message:"Please select branch."})
})