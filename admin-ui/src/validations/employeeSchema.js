import {z} from 'zod'

export const employeeSchema = z.object({
   employee_name: z
   .string()
   .min(1, { message:"Employee name is required."}),

   mobile_no: z
   .string()
   .min(1, { message: "Mobile number is required." })
   .regex(/^[6-9]\d{9}$/, {
     message: "Enter a valid 10-digit Indian mobile number.",
   }),

   salary: z
   .number({ invalid_type_error: "Salary amount must be a number."})
   .min(0, {message:"Minimum value is 0."}),

   branch: z
   .string()
   .min(1, { message:"Please select branch." }),

   employee_type: z
   .string()
   .min(1, { message:"Please select employee type." })

})