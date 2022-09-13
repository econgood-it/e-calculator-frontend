import { z } from 'zod';
import { RatingSchema } from './Rating';
import i18n from '../i18n';

const CurrenySchema = z
  .number({
    invalid_type_error: i18n.t('Number expected'),
    required_error: i18n.t('Number expected'),
  })
  .positive(i18n.t('Number should be positive'));

export const CompanyFactsSchema = z.object({
  totalPurchaseFromSuppliers: CurrenySchema,
  supplyFractions: z
    .object({
      countryCode: z.string(),
      costs: z.number(),
      industryCode: z.string(),
    })
    .array(),
});

export type CompanyFacts = z.infer<typeof CompanyFactsSchema>;

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
  ratings: RatingSchema.array(),
  companyFacts: CompanyFactsSchema,
});

export type BalanceSheetResponse = z.infer<typeof BalanceSheetResponseSchema>;
export type BalanceSheet = z.infer<typeof BalanceSheetResponseSchema>;

export const BalanceSheetRequestSchema = z.object({
  type: z.nativeEnum(BalanceSheetType),
  version: z.nativeEnum(BalanceSheetVersion),
});

export type BalanceSheetRequest = z.infer<typeof BalanceSheetRequestSchema>;
