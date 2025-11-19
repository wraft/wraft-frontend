import { z } from 'zod';

import { uuidRegex } from 'utils/regex';

export const ApiKeyFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(255, { message: 'Name cannot exceed 255 characters' })
    .trim()
    .nonempty({ message: 'Name is required' }),
  user_id: z.string().regex(uuidRegex, 'Invalid user ID').optional(),
  rate_limit: z
    .number()
    .int()
    .min(1, { message: 'Rate limit must be at least 1' })
    .max(100000, { message: 'Rate limit cannot exceed 100,000' })
    .default(1000),
  expires_at: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val === '') return true;
        const datetimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;
        const isValidDate = !isNaN(Date.parse(val));
        return datetimeLocalRegex.test(val) || isValidDate;
      },
      { message: 'Please provide a valid date and time' },
    ),
  ip_whitelist: z.array(z.string()).default([]),
  metadata: z.record(z.any()).optional(),
});

export type ApiKeyFormData = z.infer<typeof ApiKeyFormSchema>;

export interface ApiKeyResponse {
  id: string;
  name: string;
  key?: string;
  key_prefix: string;
  expires_at: string | null;
  is_active: boolean;
  rate_limit: number;
  ip_whitelist: string[];
  last_used_at: string | null;
  usage_count: number;
  metadata: Record<string, any>;
  user: {
    id: string;
    name: string;
    email: string;
  };
  created_by: {
    id: string;
    name: string;
    email: string;
  };
  inserted_at: string;
  updated_at: string;
}

export interface ApiKeyListResponse {
  api_keys: ApiKeyResponse[];
  page_number: number;
  total_pages: number;
  total_entries: number;
}

export const ApiKeyUpdateSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(255, { message: 'Name cannot exceed 255 characters' })
    .optional(),
  rate_limit: z
    .number()
    .int()
    .min(1, { message: 'Rate limit must be at least 1' })
    .max(100000, { message: 'Rate limit cannot exceed 100,000' })
    .optional(),
  is_active: z.boolean().optional(),
  expires_at: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val === '') return true;
        const datetimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;
        const isValidDate = !isNaN(Date.parse(val));
        return datetimeLocalRegex.test(val) || isValidDate;
      },
      { message: 'Please provide a valid date and time' },
    ),
  ip_whitelist: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

export type ApiKeyUpdateData = z.infer<typeof ApiKeyUpdateSchema>;
