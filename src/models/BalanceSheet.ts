import {
  BalanceSheetCreateRequestBodySchema,
  BalanceSheetItemResponseSchema,
  BalanceSheetResponseBodySchema,
} from '@ecogood/e-calculator-schemas/dist/balance.sheet.dto';
import { z } from 'zod';

export type BalanceSheetItem = z.infer<typeof BalanceSheetItemResponseSchema>;
export type BalanceSheet = z.infer<typeof BalanceSheetResponseBodySchema>;
export type BalanceSheetCreateRequestBody = z.input<
  typeof BalanceSheetCreateRequestBodySchema
>;
