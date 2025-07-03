import { z } from 'zod';

import { safeTextRegex } from 'utils/regex';

export const WEBHOOK_EVENTS = [
  'document.created',
  'document.sent',
  'document.completed',
  'document.cancelled',
  'document.signed',
  'document.rejected',
  'document.state_updated',
  'document.comment_added',
  'document.deleted',
  'document.reminder_sent',
  'test',
] as const;

export const EVENT_DESCRIPTIONS = {
  'document.created': 'Triggered when a new document is created',
  'document.sent': 'Triggered when a document is sent for approval',
  'document.completed': 'Triggered when a document workflow is completed',
  'document.cancelled': 'Triggered when a document is cancelled',
  'document.signed': 'Triggered when a document is signed',
  'document.rejected': 'Triggered when a document is rejected',
  'document.state_updated': 'Triggered when a document state changes',
  'document.comment_added': 'Triggered when a comment is added',
  'document.deleted': 'Triggered when a document is deleted',
  'document.reminder_sent': 'Triggered when a reminder is sent',
  test: 'Test event for webhook verification',
} as const;

export const HeaderSchema = z.object({
  key: z
    .string()
    .min(1, { message: 'Header key is required' })
    .regex(/^[a-zA-Z0-9-_]+$/, {
      message:
        'Header key can only contain letters, numbers, hyphens and underscores',
    }),
  value: z.string().min(1, { message: 'Header value is required' }),
});

export const WebhookSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(120, { message: 'Maximum 120 characters allowed' })
    .regex(safeTextRegex, 'Only letters, numbers, spaces, -, _ allowed'),
  url: z
    .string()
    .min(1, { message: 'URL is required' })
    .url({ message: 'Please enter a valid HTTP/HTTPS URL' })
    .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
      message: 'URL must start with http:// or https://',
    }),
  events: z
    .array(z.enum(WEBHOOK_EVENTS))
    .min(1, { message: 'At least one event must be selected' }),
  secret: z.string().optional(),
  is_active: z.boolean().default(true),
  headers: z.array(HeaderSchema).optional().default([]),
  retry_count: z
    .number()
    .int()
    .min(1, { message: 'Retry count must be at least 1' })
    .max(10, { message: 'Retry count cannot exceed 10' })
    .default(3),
  timeout_seconds: z
    .number()
    .int()
    .min(1, { message: 'Timeout must be at least 1 second' })
    .max(300, { message: 'Timeout cannot exceed 300 seconds' })
    .default(30),
});

export type WebhookFormData = z.infer<typeof WebhookSchema>;
export type WebhookEvent = (typeof WEBHOOK_EVENTS)[number];
export type HeaderItem = z.infer<typeof HeaderSchema>;

export interface WebhookResponse {
  id: string;
  name: string;
  url: string;
  events: WebhookEvent[];
  is_active: boolean;
  headers: Record<string, string>;
  retry_count: number;
  timeout_seconds: number;
  last_triggered_at?: string;
  last_response_status?: number;
  failure_count: number;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  inserted_at: string;
  updated_at: string;
}

export interface WebhookListResponse {
  webhooks: WebhookResponse[];
  total_pages: number;
  total_entries: number;
  page_number: number;
}

export interface WebhookLog {
  id: string;
  webhook_id: string;
  event: WebhookEvent;
  status: 'success' | 'failed' | 'pending';
  response_status?: number;
  response_body?: string;
  error_message?: string;
  retry_count: number;
  triggered_at: string;
  completed_at?: string;
}

export interface WebhookStats {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  success_rate: number;
  average_response_time_ms: number;
  period_days: number;
}
