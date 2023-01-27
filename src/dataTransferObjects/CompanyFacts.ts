import { z } from 'zod';

const CurrencySchema = z
  .number({
    invalid_type_error: 'Number expected',
    required_error: 'Number expected',
  })
  .nonnegative('Number should be positive');
const isCountryCode = z.string().min(3).max(3);
const isIndustryCode = z.string().min(1).max(4);
export const CompanyFactsSchema = z.object({
  totalPurchaseFromSuppliers: CurrencySchema,
  supplyFractions: z
    .object({
      countryCode: isCountryCode.optional(),
      costs: CurrencySchema,
      industryCode: isIndustryCode.optional(),
    })
    .array(),
  mainOriginOfOtherSuppliers: z.object({
    costs: z.number(),
    countryCode: isCountryCode.optional(),
  }),
});
export const CompanyFactsRequestBodySchema =
  CompanyFactsSchema.deepPartial().merge(
    z.object({ mainOriginOfOtherSuppliers: isCountryCode.optional() })
  );

export type CompanyFactsRequestBody = z.infer<
  typeof CompanyFactsRequestBodySchema
>;
export type CompanyFacts = z.infer<typeof CompanyFactsSchema>;
