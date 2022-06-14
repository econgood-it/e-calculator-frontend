import { z } from 'zod';

export const BalanceSheetItemSchema = z.object({
  id: z.number(),
});

export type BalanceSheetItem = z.infer<typeof BalanceSheetItemSchema>;
