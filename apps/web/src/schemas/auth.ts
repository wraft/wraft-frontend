import { z } from 'zod';

import { emailPattern, passwordPattern } from 'utils/zodPatterns';

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

export const PasswordUpdateSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: passwordPattern,
    confirm_new_password: passwordPattern,
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    path: ['confirm_new_password'],
    message: 'Passwords must match',
  });

export type PasswordUpdate = z.infer<typeof PasswordUpdateSchema>;
