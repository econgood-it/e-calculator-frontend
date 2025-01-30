import { z } from 'zod';
import {
  CompanyFactsPatchRequestBodySchema,
  CompanyFactsResponseBodySchema,
  EmployeesFractionSchema,
  IndustrySectorSchema,
  SupplyFractionSchema,
} from '@ecogood/e-calculator-schemas/dist/company.facts.dto';
import {
  isCountryCode,
  isNumberWithDefaultZero,
  isPositiveNumber,
} from '@ecogood/e-calculator-schemas/dist/shared.schemas';

export type CompanyFacts = z.infer<typeof CompanyFactsResponseBodySchema>;
export type CompanyFactsPatchRequestBody = z.infer<
  typeof CompanyFactsPatchRequestBodySchema
>;

export const CompanyFactsFormSchema = z.object({
  totalPurchaseFromSuppliers: isPositiveNumber,
  totalStaffCosts: isPositiveNumber,
  profit: isNumberWithDefaultZero,
  financialCosts: isPositiveNumber,
  incomeFromFinancialInvestments: isNumberWithDefaultZero,
  additionsToFixedAssets: isNumberWithDefaultZero,
  turnover: isPositiveNumber,
  totalAssets: isPositiveNumber,
  financialAssetsAndCashBalance: isNumberWithDefaultZero,
  numberOfEmployees: isPositiveNumber,
  hasCanteen: z.oboolean(),
  averageJourneyToWorkForStaffInKm: isPositiveNumber,
  isB2B: z.boolean(),
  supplyFractions: SupplyFractionSchema,
  employeesFractions: EmployeesFractionSchema,
  industrySectors: IndustrySectorSchema,
  mainOriginOfOtherSuppliers: z.object({
    countryCode: isCountryCode.optional(),
    costs: z.number(),
  }),
});
