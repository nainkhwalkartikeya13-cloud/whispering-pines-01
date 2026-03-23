import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string().trim().min(1).max(200),
  category: z.enum(['accommodation', 'add-on', 'merchandise']),
  price: z.number().positive(),
  priceType: z.enum(['per_night', 'one_time']),
  description: z.string().trim().min(1).max(1000),
  sortOrder: z.number().int().default(0),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
