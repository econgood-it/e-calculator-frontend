import { z } from 'zod';

const PositiveNumberSchema = z
  .number({
    invalid_type_error: 'Number expected',
    required_error: 'Number expected',
  })
  .nonnegative('Number should be positive');
const isCountryCode = z.string().min(3).max(3);
const isIndustryCode = z.string().min(1).max(4);

const isPercentage = z
  .number({
    invalid_type_error: 'Percentage expected',
    required_error: 'Percentage expected',
  })
  .min(0, 'Percentage should be between 0 and 100')
  .max(100, 'Percentage should be between 0 and 100');

export const CompanyFactsSchema = z.object({
  totalPurchaseFromSuppliers: PositiveNumberSchema,
  supplyFractions: z
    .object({
      countryCode: isCountryCode.optional(),
      costs: PositiveNumberSchema,
      industryCode: isIndustryCode.optional(),
    })
    .array(),
  mainOriginOfOtherSuppliers: z.object({
    costs: PositiveNumberSchema,
    countryCode: isCountryCode.optional(),
  }),
  profit: PositiveNumberSchema,
  financialCosts: PositiveNumberSchema,
  incomeFromFinancialInvestments: PositiveNumberSchema,
  totalAssets: PositiveNumberSchema,
  additionsToFixedAssets: PositiveNumberSchema,
  financialAssetsAndCashBalance: PositiveNumberSchema,
  numberOfEmployees: PositiveNumberSchema,
  totalStaffCosts: PositiveNumberSchema,
  averageJourneyToWorkForStaffInKm: PositiveNumberSchema,
  hasCanteen: z.boolean().optional(),
  employeesFractions: z
    .object({
      countryCode: isCountryCode.optional(),
      percentage: isPercentage,
    })
    .array(),
  industrySectors: z
    .object({
      industryCode: isIndustryCode.optional(),
      amountOfTotalTurnover: isPercentage,
      description: z.string().optional(),
    })
    .array(),
  turnover: PositiveNumberSchema,
  isB2B: z.boolean().optional(),
});
export const CompanyFactsRequestBodySchema =
  CompanyFactsSchema.deepPartial().merge(
    z.object({ mainOriginOfOtherSuppliers: isCountryCode.optional() })
  );

export type CompanyFactsRequestBody = z.infer<
  typeof CompanyFactsRequestBodySchema
>;
export type CompanyFacts = z.infer<typeof CompanyFactsSchema>;
