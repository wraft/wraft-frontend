import { z } from 'zod';

import {
  lowercaseRegex,
  numberRegex,
  specialCharacterRegex,
  uppercaseRegex,
} from './regex';

const MIN_LENGTH = 6;
const FIELD_VALIDATION = {
  TEST: {
    SPECIAL_CHAR: (value: string) => specialCharacterRegex.test(value),
    LOWERCASE: (value: string) => lowercaseRegex.test(value),
    UPPERCASE: (value: string) => uppercaseRegex.test(value),
    NUMBER: (value: string) => numberRegex.test(value),
  },
  MSG: {
    MIN_LEN: `Password must have ${MIN_LENGTH} characters`,
    SPECIAL_CHAR: 'Password must contain atleast one special character',
    LOWERCASE: 'Password must contain at least one lowercase letter',
    UPPERCASE: 'Password must contain at least one uppercase letter',
    NUMBER: 'Password must contain at least one number',
    MATCH: 'Password must match',
  },
};

export const passwordPattern = z
  .string()
  .min(MIN_LENGTH, {
    message: FIELD_VALIDATION.MSG.MIN_LEN,
  })
  .refine(FIELD_VALIDATION.TEST.SPECIAL_CHAR, FIELD_VALIDATION.MSG.SPECIAL_CHAR)
  .refine(FIELD_VALIDATION.TEST.LOWERCASE, FIELD_VALIDATION.MSG.LOWERCASE)
  .refine(FIELD_VALIDATION.TEST.UPPERCASE, FIELD_VALIDATION.MSG.UPPERCASE)
  .refine(FIELD_VALIDATION.TEST.NUMBER, FIELD_VALIDATION.MSG.NUMBER);

export const emailPattern = z
  .string()
  .min(1, { message: 'Please enter a valid email address.' })
  .email('This is not a valid email.');

export const addFieldIssue = (field: string, ctx: z.RefinementCtx) => {
  ctx.addIssue({
    code: 'custom',
    message: FIELD_VALIDATION.MSG.MATCH,
    path: [field],
    fatal: true,
  });
};
