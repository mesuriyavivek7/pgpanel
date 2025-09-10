import {z} from 'zod'

export const bankAccountSchema = z.object({
    account_holdername: z.string().min(1, {message: "Account holder name is required."})
})