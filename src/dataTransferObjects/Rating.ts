import { z } from 'zod';

const AspectSchema = z.object({
  shortName: z.string(),
  name: z.string(),
  estimations: z.number(),
  isPositive: z.boolean(),
});

export type Aspect = z.infer<typeof AspectSchema>;

export const TopicSchema = z.object({
  shortName: z.string(),
  name: z.string(),
  estimations: z.number(),
  aspects: AspectSchema.array(),
});

export type Topic = z.infer<typeof TopicSchema>;

export const RatingSchema = z.object({
  topics: TopicSchema.array(),
});

export type Rating = z.infer<typeof RatingSchema>;
