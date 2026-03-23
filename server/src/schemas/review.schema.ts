import { z } from 'zod';

export const createReviewSchema = z.object({
  authorName: z.string().trim().min(1).max(100),
  body: z.string().trim().min(10).max(2000),
  rating: z.number().int().min(1).max(5),
  bookingId: z.string().optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
