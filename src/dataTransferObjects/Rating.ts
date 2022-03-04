import { z } from 'zod';

export const RatingSchema = z.object({
  shortName: z.string(),
  name: z.string(),
  estimations: z.number(),
  isPositive: z.boolean().optional(),
});

export type Rating = z.infer<typeof RatingSchema>;
