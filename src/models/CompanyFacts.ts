import { z } from 'zod';
import {
  CompanyFactsPatchRequestBodySchema,
  CompanyFactsResponseBodySchema,
} from '@ecogood/e-calculator-schemas/dist/company.facts.dto';
import {
  isCountryCode,
  isIndustryCode,
  isNumberWithDefaultZero,
  isPercentage,
  isPositiveNumber,
  isPositiveNumberNotZero,
} from '@ecogood/e-calculator-schemas/dist/shared.schemas';

export type CompanyFacts = z.infer<typeof CompanyFactsResponseBodySchema>;
export type CompanyFactsPatchRequestBody = z.infer<
  typeof CompanyFactsPatchRequestBodySchema
>;
const SupplyFractionFormSchema = z.object({
  countryCode: isCountryCode.optional(),
  industryCode: isIndustryCode.optional(),
  costs: isPositiveNumberNotZero,
});
const EmployeesFractionFormSchema = z.object({
  countryCode: isCountryCode.optional(),
  percentage: isPercentage,
});
const IndustrySectorFormSchema = z.object({
  industryCode: isIndustryCode.optional(),
  amountOfTotalTurnover: isPercentage,
  description: z.string().default(''),
});

function isSumGreaterThan(array: number[], value: number): boolean {
  // Calculate the sum of the array
  const sum = array.reduce((acc, curr) => acc + curr, 0);

  // Check if the sum is greater than the specified value
  return sum > value;
}

export const CompanyFactsFormSchema = z.object({
  totalPurchaseFromSuppliers: isPositiveNumber,
  totalStaffCosts: isPositiveNumber,
  profit: isNumberWithDefaultZero,
  financialCosts: isPositiveNumber,
  incomeFromFinancialInvestments: isNumberWithDefaultZero,
  additionsToFixedAssets: isNumberWithDefaultZero,
  turnover: isPositiveNumber,
  totalAssets: isPositiveNumber,
  financialAssetsAndCashBalance: isPositiveNumber,
  numberOfEmployees: isPositiveNumber,
  hasCanteen: z.oboolean(),
  averageJourneyToWorkForStaffInKm: isPositiveNumber,
  isB2B: z.boolean(),
  supplyFractions: SupplyFractionFormSchema.array(),
  employeesFractions: EmployeesFractionFormSchema.array().refine(
    (efs) =>
      !isSumGreaterThan(
        efs.map((ef) => ef.percentage),
        100
      ),
    {
      message:
        'The sum of all percentage values should not be greater than 100.',
    }
  ),
  industrySectors: IndustrySectorFormSchema.array().refine(
    (is) =>
      !isSumGreaterThan(
        is.map((is) => is.amountOfTotalTurnover),
        100
      ),
    {
      message:
        'The sum of all percentage values should not be greater than 100.',
    }
  ),
  mainOriginOfOtherSuppliers: z.object({
    countryCode: isCountryCode.optional(),
    costs: z.number(),
  }),
});
