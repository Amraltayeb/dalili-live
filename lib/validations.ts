import { z } from 'zod';

export const businessSubmissionSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessNameAr: z.string().optional(),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  descriptionAr: z.string().optional(),
  categoryId: z.string().uuid('Please select a valid category'),
  phone: z.string().regex(/^(\+20|0)?1[0-9]{9}$/, 'Please enter a valid Egyptian phone number'),
  email: z.string().email('Please enter a valid email address').optional(),
  address: z.string().min(10, 'Please provide a detailed address'),
  area: z.string().min(2, 'Please select an area'),
  governorate: z.string().min(2, 'Please select a governorate'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  website: z.string().url('Please enter a valid website URL').optional(),
  facebookUrl: z.string().url('Please enter a valid Facebook URL').optional(),
  instagramUrl: z.string().url('Please enter a valid Instagram URL').optional(),
  whatsapp: z.string().regex(/^(\+20|0)?1[0-9]{9}$/, 'Please enter a valid WhatsApp number').optional(),
  photos: z.array(z.string()).min(1, 'Please upload at least one photo'),
  openingHours: z.object({
    monday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
    tuesday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
    wednesday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
    thursday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
    friday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
    saturday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
    sunday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() })
  }).optional()
});

export type BusinessSubmissionData = z.infer<typeof businessSubmissionSchema>;

export const reviewSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  content: z.string().min(20, "Review must be at least 20 characters"),
  photos: z.array(z.string()).optional(),
  visit_date: z.date().optional(),
});

export type ReviewData = z.infer<typeof reviewSchema>; 