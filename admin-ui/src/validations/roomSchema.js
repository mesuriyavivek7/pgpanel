import { z } from 'zod';

export const roomSchema = z.object({
  room_id: z.string().min(1, { message: 'Room no is required.' }),
  capacity: z
    .number({
      required_error: 'Capacity is required.',
      invalid_type_error: 'Capacity must be a number.',
    })
    .min(1, { message: 'Minimum value is 1.' }),
  remark: z.string().optional(),
});
