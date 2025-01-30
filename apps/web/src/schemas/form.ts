import { z } from 'zod';

export const FormSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  description: z.string().nonempty({ message: 'Description is required' }),
  prefix: z
    .string()
    .min(2, 'Minimum 2 characters required')
    .max(8, 'Maximum 6 characters allowed')
    .regex(/^\D*$/, 'Prefix cannot contain numbers')
    .optional(),
});

export type Form = z.infer<typeof FormSchema>;
