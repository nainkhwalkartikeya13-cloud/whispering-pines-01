import { z } from 'zod';

export const checkAvailabilitySchema = z.object({
  checkIn: z.string().refine((v) => !isNaN(Date.parse(v)), 'Invalid check-in date'),
  checkOut: z.string().refine((v) => !isNaN(Date.parse(v)), 'Invalid check-out date'),
  guests: z.object({
    adults: z.number().int().min(1).max(20),
    children: z.number().int().min(0).max(20),
  }),
});

export const createPaymentIntentSchema = z.object({
  accommodationId: z.string().min(1),
  checkIn: z.string().refine((v) => !isNaN(Date.parse(v)), 'Invalid check-in date'),
  checkOut: z.string().refine((v) => !isNaN(Date.parse(v)), 'Invalid check-out date'),
  guests: z.object({
    adults: z.number().int().min(1).max(20),
    children: z.number().int().min(0).max(20),
  }),
  selectedServiceIds: z.array(z.string()).default([]),
  guestFirstName: z.string().trim().min(1).max(100),
  guestLastName: z.string().trim().min(1).max(100),
  guestEmail: z.string().email(),
  specialRequests: z.string().trim().max(1000).optional(),
});

export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;
export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentSchema>;
