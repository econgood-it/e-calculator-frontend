import { z } from 'zod';

export const BalanceSheetSchema = z.object({
  id: z.number(),
});

export type BalanceSheet = z.infer<typeof BalanceSheetSchema>;
