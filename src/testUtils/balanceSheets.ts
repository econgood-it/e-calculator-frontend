import {
  BalanceSheet,
  CompanyFacts,
} from '../dataTransferObjects/BalanceSheet';
import { RatingType } from '../dataTransferObjects/Rating';

export const CompanyFactsMocks = {
  companyFacts1: (): CompanyFacts => ({
    totalPurchaseFromSuppliers: 4,
    supplyFractions: [
      {
        countryCode: 'EGY',
        industryCode: 'A',
        costs: 388,
      },
      {
        countryCode: 'AFG',
        industryCode: 'A',
        costs: 54,
      },
    ],
  }),
};

export const BalanceSheetMocks = {
  balanceSheet1: (): BalanceSheet => ({
    id: 3,
    companyFacts: CompanyFactsMocks.companyFacts1(),
    ratings: [
      {
        shortName: 'A1',
        name: 'Menschenwürde in der Zulieferkette',
        estimations: 0,
        type: RatingType.topic,
      },
      {
        shortName: 'A1.1',
        name: 'Arbeitsbedingungen und gesellschaftliche Auswirkungen in der Zulieferkette',
        estimations: 0,
        isPositive: true,
        type: RatingType.aspect,
      },
      {
        shortName: 'A1.2',
        name: 'Negativ-Aspekt: Verletzung der Menschenwürde in der Zulieferkette',
        estimations: 0,
        isPositive: false,
        type: RatingType.aspect,
      },
      {
        shortName: 'B1.1',
        name: 'Financial independence through equity financing',
        estimations: 0,
        isPositive: false,
        type: RatingType.aspect,
      },
    ],
  }),
};
