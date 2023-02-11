import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import SuppliersForm from '../components/balanceSheet/companyFacts/SuppliersForm';
import { useApi } from '../contexts/ApiContext';
import { OwnersAndFinancialServicesForm } from '../components/balanceSheet/companyFacts/OwnersAndFinancialServicesForm';
import { useEffect, useState } from 'react';
import { Region, RegionSchema } from '../dataTransferObjects/Region';
import { Industry, IndustrySchema } from '../dataTransferObjects/Industry';
import { EmployeesForm } from '../components/balanceSheet/companyFacts/EmployeesForm';
import { CustomersForm } from '../components/balanceSheet/companyFacts/CustomersForm';

const CompanyFactsPage = () => {
  const { balanceSheet } = useActiveBalanceSheet();
  const api = useApi();
  const [regions, setRegions] = useState<Region[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);

  useEffect(() => {
    (async () => {
      const regionResponse = await api.get<Region[]>('/v1/regions');
      setRegions(RegionSchema.array().parse(regionResponse.data));
    })();
  }, [api]);

  useEffect(() => {
    (async () => {
      const industryResponse = await api.get<Region[]>('/v1/industries');
      setIndustries(IndustrySchema.array().parse(industryResponse.data));
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
            formData={{ turnover: balanceSheet.companyFacts.turnover }}
          />
        </>
      )}
    </>
  );
};

export default CompanyFactsPage;
