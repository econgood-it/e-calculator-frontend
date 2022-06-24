import { z } from 'zod';

export const BalanceSheetItemSchema = z.object({
  id: z.number(),
});

export type BalanceSheetItem = z.infer<typeof BalanceSheetItemSchema>;

export enum BalanceSheetType {
  Compact = 'Compact',
  Full = 'Full',
}

export enum BalanceSheetVersion {
  // eslint-disable-next-line camelcase
  v5_0_4 = '5.04',
  // eslint-disable-next-line camelcase
  v5_0_5 = '5.05',
  // eslint-disable-next-line camelcase
  v5_0_6 = '5.06',
  // eslint-disable-next-line camelcase
  v5_0_7 = '5.07',
  // eslint-disable-next-line camelcase
  v5_0_8 = '5.08',
}

export const BalanceSheetResponseSchema = z.object({
  id: z.number(),
});

export type BalanceSheetResponse = z.infer<typeof BalanceSheetResponseSchema>;

export const BalanceSheetRequestSchema = z.object({
  type: z.nativeEnum(BalanceSheetType),
  version: z.nativeEnum(BalanceSheetVersion),
});

export type BalanceSheetRequest = z.infer<typeof BalanceSheetRequestSchema>;
