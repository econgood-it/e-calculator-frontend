import { z } from 'zod';

export const RegionSchema = z.object({
  countryCode: z.string(),
  countryName: z.string(),
});

export type Region = z.infer<typeof RegionSchema>;
