import { z } from 'zod';

import { emailPattern, passwordPattern } from 'utils/zodPatterns';

export const RegistrationSchema = z.object({
  firstName: z.string().min(1, { message: 'First Name has to be filled.' }),
  lastName: z.string().min(1, { message: 'Last Name has to be filled.' }),
  email: emailPattern,
  password: passwordPattern,
});

export type Registration = z.infer<typeof RegistrationSchema>;
