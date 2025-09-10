import { z } from 'zod';

export const ThemeSchema = z.object({
  name: z
    .string()
    .nonempty({ message: 'Theme name is required' })
    .trim()
    .min(2, 'Theme name must be at least 2 characters')
    .max(50, 'Theme name cannot exceed 50 characters'),
  font: z
    .string()
    .refine((value) => value !== '' && value !== 'invalid', {
      message: 'At least 2 fonts are required',
    })
    .refine((value) => value !== 'missing_regular', {
      message: 'Regular font is required',
    }),
  primary_color: z.string().optional(),
  secondary_color: z.string().optional(),
  body_color: z.string().optional(),
});

export type Theme = z.infer<typeof ThemeSchema>;
