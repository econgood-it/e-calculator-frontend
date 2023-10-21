import {
  BalanceSheetCreateRequestBodySchema,
  BalanceSheetItemResponseSchema,
  BalanceSheetPatchRequestBodySchema,
  BalanceSheetResponseBodySchema,
} from '@ecogood/e-calculator-schemas/dist/balance.sheet.dto';
import { z } from 'zod';
import { MatrixBodySchema } from '@ecogood/e-calculator-schemas/dist/matrix.dto';

export type BalanceSheetItem = z.infer<typeof BalanceSheetItemResponseSchema>;
export type BalanceSheet = z.infer<typeof BalanceSheetResponseBodySchema>;
export type BalanceSheetCreateRequestBody = z.input<
  typeof BalanceSheetCreateRequestBodySchema
>;
export type BalanceSheetPatchRequestBody = z.input<
  typeof BalanceSheetPatchRequestBodySchema
>;
