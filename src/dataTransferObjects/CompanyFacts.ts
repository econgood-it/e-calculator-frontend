import { z } from 'zod';

const CurrencySchema = z
  .number({
    invalid_type_error: 'Number expected',
    required_error: 'Number expected',
  })
  .nonnegative('Number should be positive');

export const CompanyFactsSchema = z.object({
  totalPurchaseFromSuppliers: CurrencySchema,
  supplyFractions: z
    .object({
      countryCode: z.string(),
      costs: CurrencySchema,
      industryCode: z.string(),
    })
    .array(),
});
export const CompanyFactsRequestBodySchema = CompanyFactsSchema.deepPartial();

export type CompanyFactsRequestBody = z.infer<
  typeof CompanyFactsRequestBodySchema
>;
export type CompanyFacts = z.infer<typeof CompanyFactsSchema>;
