import { RatingType } from '@ecogood/e-calculator-schemas/dist/rating.dto';
import {
  BalanceSheetType,
  BalanceSheetVersion,
} from '@ecogood/e-calculator-schemas/dist/shared.schemas';
import { CompanyFacts } from '../models/CompanyFacts';
import { Rating } from '../models/Rating';
import {
  BalanceSheet,
  BalanceSheetCreateRequestBody,
  BalanceSheetItem,
} from '../models/BalanceSheet';
import _ from 'lodash';

export const CustomersMocks = {
  customers1: () => ({
    turnover: 19,
    isB2B: false,
    industrySectors: [
      { industryCode: 'A', description: 'desc', amountOfTotalTurnover: 80 },
    ],
  }),
};

export const OwnersAndFinancialServicesMocks = {
  ownersAndFinancialServices1: () => ({
    profit: 90,
    financialCosts: 120,
    incomeFromFinancialInvestments: 10,
    totalAssets: 1,
    additionsToFixedAssets: 2,
    financialAssetsAndCashBalance: 23,
  }),
};

export const EmployeesMocks = {
  employees1: () => ({
    numberOfEmployees: 30,
    totalStaffCosts: 17,
    averageJourneyToWorkForStaffInKm: 13,
    hasCanteen: false,
    employeesFractions: [{ countryCode: 'AFG', percentage: 50 }],
  }),
};

export const SuppliersMocks = {
  suppliers1: () => ({
    totalPurchaseFromSuppliers: 900,
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
    mainOriginOfOtherSuppliers: { costs: 388 + 54, countryCode: 'BEL' },
  }),
};

export class RatingsMockBuilder {
  private ratings: Rating[] = [
    {
      shortName: 'A1',
      name: 'Menschenwürde in der Zulieferkette',
      estimations: 0,
      isPositive: true,
      type: RatingType.topic,
      weight: 0,
      maxPoints: 0,
      points: 0,
    },
    {
      shortName: 'A1.1',
      name: 'Arbeitsbedingungen und gesellschaftliche Auswirkungen in der Zulieferkette',
      estimations: 0,
      isPositive: true,
      type: RatingType.aspect,
      weight: 0,
      maxPoints: 0,
      points: 0,
    },
    {
      shortName: 'A1.2',
      name: 'Negativ-Aspekt: Verletzung der Menschenwürde in der Zulieferkette',
      estimations: 0,
      isPositive: false,
      type: RatingType.aspect,
      weight: 0,
      maxPoints: 0,
      points: 0,
    },
    {
      shortName: 'B1.1',
      name: 'Financial independence through equity financing',
      estimations: 0,
      isPositive: false,
      type: RatingType.aspect,
      weight: 0,
      maxPoints: 0,
      points: 0,
    },
  ];

  public buildRequestBody() {
    return this.ratings.map((r) => ({
      shortName: r.shortName,
      weight: r.weight,
      estimations: r.estimations,
    }));
  }

  public buildResponseBody(): Rating[] {
    return this.build();
  }

  public build(): Rating[] {
    return this.ratings;
  }
}

export class CompanyFactsMockBuilder {
  private companyFacts: CompanyFacts = {
    ...SuppliersMocks.suppliers1(),
    ...OwnersAndFinancialServicesMocks.ownersAndFinancialServices1(),
    ...EmployeesMocks.employees1(),
    ...CustomersMocks.customers1(),
  };

  public buildRequestBody() {
    return {
      ...this.companyFacts,
      mainOriginOfOtherSuppliers:
        this.companyFacts.mainOriginOfOtherSuppliers.countryCode,
    };
  }

  public buildResponseBody(): CompanyFacts {
    return this.companyFacts;
  }

  public build(): CompanyFacts {
    return this.companyFacts;
  }
}

export class BalanceSheetMockBuilder {
  private balanceSheet = {
    id: 3,
    type: BalanceSheetType.Full,
    version: BalanceSheetVersion.v5_0_8,
    companyFacts: new CompanyFactsMockBuilder(),
    ratings: new RatingsMockBuilder(),
    stakeholderWeights: [],
  };

  public withId(id: number) {
    this.balanceSheet.id = id;
    return this;
  }

  public buildRequestBody(): BalanceSheetCreateRequestBody {
    return _.omit(
      {
        ...this.balanceSheet,
        companyFacts: this.balanceSheet.companyFacts.buildRequestBody(),
        ratings: this.balanceSheet.ratings.buildRequestBody(),
      },
      ['id']
    );
  }

  public buildResponseBody() {
    return this.build();
  }

  public build(): BalanceSheet {
    return {
      ...this.balanceSheet,
      companyFacts: this.balanceSheet.companyFacts.build(),
      ratings: this.balanceSheet.ratings.build(),
    };
  }
}

export class BalanceSheetItemMockBuilder {
  private balanceSheetItem = {
    id: 3,
  };

  public withId(id: number) {
    this.balanceSheetItem.id = id;
    return this;
  }

  public buildRequestBody() {
    return this.build();
  }

  public buildResponseBody() {
    return this.build();
  }

  public build(): BalanceSheetItem {
    return this.balanceSheetItem;
  }
}

export class BalanceSheetItemsMockBuilder {
  private balanceSheetItemsBuilder = [
    new BalanceSheetItemMockBuilder().withId(7),
    new BalanceSheetItemMockBuilder().withId(3),
  ];

  public addItem(balanceSheetItemBuilder: BalanceSheetItemMockBuilder) {
    this.balanceSheetItemsBuilder.push(balanceSheetItemBuilder);
    return this;
  }

  public buildRequestBody() {
    return this.build();
  }

  public buildResponseBody() {
    return this.build();
  }

  public build(): BalanceSheetItem[] {
    return this.balanceSheetItemsBuilder.map((b) => b.build());
  }
}
