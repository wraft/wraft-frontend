import { z } from 'zod';

import { emailPattern } from 'utils/zodPatterns';

export const LoginSchema = z.object({
  email: emailPattern,
  password: z.string().min(3, { message: 'Please enter a valid password.' }),
});

export type Login = z.infer<typeof LoginSchema>;

export const SignUpSchema = z.object({
  first_name: z.string().min(3, { message: 'Please enter your first name' }),
  last_name: z.string().min(1, { message: 'Please enter your last name' }),
  email: emailPattern,
});

export type SignUp = z.infer<typeof SignUpSchema>;

export const ForgetPasswordSchema = z.object({
  email: emailPattern,
});

export type ForgetPassword = z.infer<typeof ForgetPasswordSchema>;
