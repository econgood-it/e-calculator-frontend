import { z } from 'zod';

export const IndustrySchema = z.object({
  industryCode: z.string(),
  industryName: z.string(),
});

export type Industry = z.infer<typeof IndustrySchema>;
