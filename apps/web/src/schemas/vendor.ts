import { z } from 'zod';

import { uuidRegex } from 'utils/regex';

// Phone number validation (international format)
const phoneRegex = /^[+]?[\d\s\-()]+$/;

// URL validation (basic)
const urlRegex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&=]*)$/;

// GSTIN validation (Indian GST format)
const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

// Vendor schema
export const VendorSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(255, { message: 'Name cannot exceed 255 characters' })
    .trim()
    .nonempty({ message: 'Name is required' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(50, { message: 'Phone number cannot exceed 50 characters' })
    .regex(phoneRegex, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(500, { message: 'Address cannot exceed 500 characters' })
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .max(100, { message: 'City cannot exceed 100 characters' })
    .optional()
    .or(z.literal('')),
  country: z
    .string()
    .max(100, { message: 'Country cannot exceed 100 characters' })
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .regex(urlRegex, 'Please enter a valid website URL')
    .optional()
    .or(z.literal('')),
  gstin: z
    .string()
    .regex(gstinRegex, 'Please enter a valid GSTIN number')
    .optional()
    .or(z.literal('')),
  registration_number: z
    .string()
    .max(100, { message: 'Registration number cannot exceed 100 characters' })
    .optional()
    .or(z.literal('')),
  contact_person: z
    .string()
    .max(100, { message: 'Contact person name cannot exceed 100 characters' })
    .optional()
    .or(z.literal('')),
  logo: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: 'Logo file size must be less than 5MB',
    })
    .refine(
      (file) =>
        !file ||
        ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(
          file.type,
        ),
      {
        message: 'Logo must be a valid image file (JPEG, PNG, GIF, SVG)',
      },
    ),
});

// Vendor contact schema
export const VendorContactSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(255, { message: 'Name cannot exceed 255 characters' })
    .trim()
    .nonempty({ message: 'Name is required' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(50, { message: 'Phone number cannot exceed 50 characters' })
    .regex(phoneRegex, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  job_title: z
    .string()
    .max(100, { message: 'Job title cannot exceed 100 characters' })
    .optional()
    .or(z.literal('')),
  vendor_id: z.string().regex(uuidRegex, 'Invalid vendor ID').optional(),
});

// For API responses - includes additional fields
export const VendorResponseSchema = VendorSchema.extend({
  id: z.string().regex(uuidRegex, 'Invalid vendor ID'),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  logo_url: z.string().optional(),
  contacts_count: z.number().optional(),
});

export const VendorContactResponseSchema = VendorContactSchema.extend({
  id: z.string().regex(uuidRegex, 'Invalid contact ID'),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  vendor: z
    .object({
      id: z.string().regex(uuidRegex, 'Invalid vendor ID'),
      name: z.string(),
    })
    .optional(),
});

// For form submissions - excludes file uploads (handled separately)
export const VendorFormSchema = VendorSchema.omit({ logo: true });

// Type definitions
export type Vendor = z.infer<typeof VendorSchema>;
export type VendorContact = z.infer<typeof VendorContactSchema>;
export type VendorResponse = z.infer<typeof VendorResponseSchema>;
export type VendorContactResponse = z.infer<typeof VendorContactResponseSchema>;
export type VendorForm = z.infer<typeof VendorFormSchema>;

// Search and filter schemas
export const VendorSearchSchema = z.object({
  query: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  has_contacts: z.boolean().optional(),
  created_after: z.string().datetime().optional(),
  created_before: z.string().datetime().optional(),
});

export type VendorSearch = z.infer<typeof VendorSearchSchema>;

// Pagination schema for vendor lists
export const VendorListResponseSchema = z.object({
  vendors: z.array(VendorResponseSchema),
  page: z.number(),
  page_size: z.number(),
  total_pages: z.number(),
  total_entries: z.number(),
});

export const VendorContactListResponseSchema = z.object({
  contacts: z.array(VendorContactResponseSchema),
  page: z.number(),
  page_size: z.number(),
  total_pages: z.number(),
  total_entries: z.number(),
});

export type VendorListResponse = z.infer<typeof VendorListResponseSchema>;
export type VendorContactListResponse = z.infer<
  typeof VendorContactListResponseSchema
>;

export const VendorContactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .nonempty('Name is required'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(/^[+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  job_title: z.string().optional().or(z.literal('')),
});

export type VendorContactFormType = z.infer<typeof VendorContactFormSchema>;
