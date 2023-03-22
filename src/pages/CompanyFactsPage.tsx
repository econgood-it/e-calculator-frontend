import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import SuppliersForm from '../components/balanceSheet/companyFacts/SuppliersForm';
import { useApi } from '../contexts/ApiContext';
import { OwnersAndFinancialServicesForm } from '../components/balanceSheet/companyFacts/OwnersAndFinancialServicesForm';
import { useEffect, useState } from 'react';

import { EmployeesForm } from '../components/balanceSheet/companyFacts/EmployeesForm';
import { CustomersForm } from '../components/balanceSheet/companyFacts/CustomersForm';
import { IndustryResponseBodySchema } from 'e-calculator-schemas/dist/industry.dto';
import { Region } from '../models/Region';
import { Industry } from '../models/Industry';
import { RegionResponseBodySchema } from 'e-calculator-schemas/dist/region.dto';

const CompanyFactsPage = () => {
  const { balanceSheet } = useActiveBalanceSheet();
  const api = useApi();
  const [regions, setRegions] = useState<Region[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);

  useEffect(() => {
    (async () => {
      const regionResponse = await api.get<Region[]>('/v1/regions');
      setRegions(RegionResponseBodySchema.array().parse(regionResponse.data));
    })();
  }, [api]);

  useEffect(() => {
    (async () => {
      const industryResponse = await api.get<Region[]>('/v1/industries');
      setIndustries(
        IndustryResponseBodySchema.array().parse(industryResponse.data)
      );
    })();
  }, [api]);

  return (
    <>
      {balanceSheet && (
        <>
          <SuppliersForm
            formData={{
              totalPurchaseFromSuppliers:
                balanceSheet.companyFacts.totalPurchaseFromSuppliers,
              supplyFractions: balanceSheet.companyFacts.supplyFractions,
              mainOriginOfOtherSuppliers:
                balanceSheet.companyFacts.mainOriginOfOtherSuppliers,
            }}
            regions={regions}
            industries={industries}
          />
          <OwnersAndFinancialServicesForm
            formData={{
              financialCosts: balanceSheet.companyFacts.financialCosts,
              profit: balanceSheet.companyFacts.profit,
              incomeFromFinancialInvestments:
                balanceSheet.companyFacts.incomeFromFinancialInvestments,
              totalAssets: balanceSheet.companyFacts.totalAssets,
              additionsToFixedAssets:
                balanceSheet.companyFacts.additionsToFixedAssets,
              financialAssetsAndCashBalance:
                balanceSheet.companyFacts.financialAssetsAndCashBalance,
            }}
          />
          <EmployeesForm
            formData={{
              numberOfEmployees: balanceSheet.companyFacts.numberOfEmployees,
              totalStaffCosts: balanceSheet.companyFacts.totalStaffCosts,
              averageJourneyToWorkForStaffInKm:
                balanceSheet.companyFacts.averageJourneyToWorkForStaffInKm,
              hasCanteen: balanceSheet.companyFacts.hasCanteen,
              employeesFractions: balanceSheet.companyFacts.employeesFractions,
            }}
            regions={regions}
          />
          <CustomersForm
            formData={{
              turnover: balanceSheet.companyFacts.turnover,
              industrySectors: balanceSheet.companyFacts.industrySectors,
              isB2B: balanceSheet.companyFacts.isB2B,
            }}
            industries={industries}
          />
        </>
      )}
    </>
  );
};

export default CompanyFactsPage;
