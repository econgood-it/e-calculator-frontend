import {
  BalanceSheetItemResponseSchema,
  BalanceSheetResponseBodySchema,
} from 'e-calculator-schemas/dist/balance.sheet.dto';
import { z } from 'zod';

export type BalanceSheetItem = z.infer<typeof BalanceSheetItemResponseSchema>;
export type BalanceSheet = z.infer<typeof BalanceSheetResponseBodySchema>;
