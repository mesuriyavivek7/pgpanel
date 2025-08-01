import { z } from 'zod';

export const accountSchema = z.object({
  full_name: z.string().min(1, { message: "Full name is required." }),

  contact_no:z.string().min(1, { message: "Mobile number is required." }).regex(/^[6-9]\d{9}$/, { message: "Enter a valid 10-digit Indian mobile number."}),

  email: z.string().email({ message: "Invalid email format." }).min(1, { message: "Email address is required." }),

  branch: z.string().min(1, { message: "Please select branch." }),

  password: z.string().min(1, { message: "Password is required." }),
});
