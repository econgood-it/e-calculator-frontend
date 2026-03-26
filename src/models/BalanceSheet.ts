import {
  BalanceSheetCreateRequestBodySchema,
  BalanceSheetItemResponseSchema,
  BalanceSheetPatchRequestBodySchema,
  BalanceSheetResponseBodySchema,
} from '@ecogood/e-calculator-schemas/dist/balance.sheet.dto';
import { Currency } from '@ecogood/e-calculator-schemas/dist/general.information.dto';
import { z } from 'zod';

export type BalanceSheetItem = z.infer<typeof BalanceSheetItemResponseSchema>;
export type BalanceSheet = z.infer<typeof BalanceSheetResponseBodySchema>;
export type BalanceSheetCreateRequestBody = z.input<
  typeof BalanceSheetCreateRequestBodySchema
>;
export type BalanceSheetPatchRequestBody = z.input<
  typeof BalanceSheetPatchRequestBodySchema
>;
export const BalanceSheetCurrencies = {
  [Currency.EUR]: '€',
  [Currency.USD]: '$',
  [Currency.CHF]: 'CHF',
};
