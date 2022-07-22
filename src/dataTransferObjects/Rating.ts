import { z } from 'zod';

export enum RatingType {
  topic = 'topic',
  aspect = 'aspect',
}

export const RatingSchema = z.object({
  shortName: z.string(),
  name: z.string(),
  estimations: z.number(),
  isPositive: z.boolean().optional(),
  type: z.nativeEnum(RatingType),
});

export type Rating = z.infer<typeof RatingSchema>;
