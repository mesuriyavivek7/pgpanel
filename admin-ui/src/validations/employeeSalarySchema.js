import {z} from 'zod'

export const employeeSalarySchema = (pending_salary) => z.object({
    date: z.
    string()
    .min(1, {message: "Please select date of payment."}),

    amount: z.
    number({invalid_type_error: "Salary amount must be number."}).
    min(1, {message: "Minimum value is 1."})
    .refine(
        (val) => val <= pending_salary,
        { message: `Amount cannot be greater than pending salary (₹${pending_salary}).` }
    ),

    payment_mode: z.
    string()
    .min(1, {message:"Please select payment mode."}),

    bank_account: z.
    string()
    .min(1, {message:"Please select bank account."})
});