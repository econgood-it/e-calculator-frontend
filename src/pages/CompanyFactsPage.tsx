import SuppliersForm from '../components/balanceSheet/companyFacts/SuppliersForm';
import { OwnersAndFinancialServicesForm } from '../components/balanceSheet/companyFacts/OwnersAndFinancialServicesForm';

import { EmployeesForm } from '../components/balanceSheet/companyFacts/EmployeesForm';
import { CustomersForm } from '../components/balanceSheet/companyFacts/CustomersForm';
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  useSubmit,
} from 'react-router-dom';
import {
  createApiClient,
  makeWretchInstanceWithAuth,
} from '../api/api.client.ts';
import { API_URL } from '../configuration.ts';
import { useLoaderData } from 'react-router-typesafe';
import { CompanyFactsPatchRequestBody } from '../models/CompanyFacts.ts';
import { HandlerContext } from './handlerContext.ts';

const CompanyFactsPage = () => {
  const data = useLoaderData<typeof loader>();
  const submit = useSubmit();
  async function updateCompanyFacts(
    companyFacts: CompanyFactsPatchRequestBody
  ) {
    submit(
      { companyFacts, intent: 'updateCompanyFacts' },
      { method: 'patch', encType: 'application/json' }
    );
  }

  return (
    <>
      {data && (
        <>
          <SuppliersForm
            formData={{
              totalPurchaseFromSuppliers:
                data.companyFacts.totalPurchaseFromSuppliers,
              supplyFractions: data.companyFacts.supplyFractions,
              mainOriginOfOtherSuppliers:
                data.companyFacts.mainOriginOfOtherSuppliers,
            }}
            regions={data.regions}
            industries={data.industries}
            updateCompanyFacts={updateCompanyFacts}
          />
          <OwnersAndFinancialServicesForm
            formData={{
              financialCosts: data.companyFacts.financialCosts,
              profit: data.companyFacts.profit,
              incomeFromFinancialInvestments:
                data.companyFacts.incomeFromFinancialInvestments,
              totalAssets: data.companyFacts.totalAssets,
              additionsToFixedAssets: data.companyFacts.additionsToFixedAssets,
              financialAssetsAndCashBalance:
                data.companyFacts.financialAssetsAndCashBalance,
            }}
            updateCompanyFacts={updateCompanyFacts}
          />
          <EmployeesForm
            formData={{
              numberOfEmployees: data.companyFacts.numberOfEmployees,
              totalStaffCosts: data.companyFacts.totalStaffCosts,
              averageJourneyToWorkForStaffInKm:
                data.companyFacts.averageJourneyToWorkForStaffInKm,
              hasCanteen: data.companyFacts.hasCanteen,
              employeesFractions: data.companyFacts.employeesFractions,
            }}
            regions={data.regions}
            updateCompanyFacts={updateCompanyFacts}
          />
          <CustomersForm
            formData={{
              turnover: data.companyFacts.turnover,
              industrySectors: data.companyFacts.industrySectors,
              isB2B: data.companyFacts.isB2B,
            }}
            industries={data.industries}
            updateCompanyFacts={updateCompanyFacts}
          />
        </>
      )}
    </>
  );
};

export default CompanyFactsPage;

export async function loader(
  { params }: LoaderFunctionArgs,
  handlerCtx: unknown
) {
  const { userData, lng } = handlerCtx as HandlerContext;

  if (!userData || !params.balanceSheetId) {
    return null;
  }
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
  );

  const balanceSheet = await apiClient.getBalanceSheet(
    Number.parseInt(params.balanceSheetId)
  );
  const regions = await apiClient.getRegions();
  const industries = await apiClient.getIndustries();
  return { companyFacts: balanceSheet.companyFacts, regions, industries };
}

export async function action(
  { params, request }: ActionFunctionArgs,
  handlerCtx: unknown
) {
  const { intent, ...data } = await request.json();
  const { userData, lng } = handlerCtx as HandlerContext;

  if (!userData || !params.balanceSheetId) {
    return null;
  }
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
  );

  if (intent === 'updateCompanyFacts') {
    return await apiClient.updateBalanceSheet(parseInt(params.balanceSheetId), {
      companyFacts: data.companyFacts,
    });
  }

  throw json({ message: 'Invalid intent' }, { status: 400 });
}
