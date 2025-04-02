import { z } from 'zod';

import { emailPattern, passwordPattern } from 'utils/zodPatterns';
import { nameRegex } from 'utils/regex';

export const RegistrationSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First Name has to be filled.' })
    .regex(nameRegex, 'Allows only letters and spaces'),
  lastName: z
    .string()
    .min(1, { message: 'Last Name has to be filled.' })
    .regex(nameRegex, 'Allows only letters and spaces'),
  email: emailPattern,
  password: passwordPattern,
});

export type Registration = z.infer<typeof RegistrationSchema>;
