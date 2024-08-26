import { RatingsForm } from '../components/balanceSheet/RatingsForm';
import { Rating, StakholderShortNames } from '../models/Rating';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useSubmit,
} from 'react-router-dom';
import { User } from 'oidc-react';
import {
  createApiClient,
  makeWretchInstanceWithAuth,
} from '../api/api.client.ts';
import { eq } from '@mr42/version-comparator/dist/version.comparator';

import { API_URL } from '../configuration.ts';
import { useLoaderData } from 'react-router-typesafe';
import { ComponentType } from 'react';
import { RatingsConfiguratorProps } from '../components/balanceSheet/FinanceConfigurators.tsx';
import GridContainer from '../components/layout/GridContainer.tsx';
import GridItem from '../components/layout/GridItem.tsx';
import { BalanceSheetVersion } from '@ecogood/e-calculator-schemas/dist/shared.schemas';

type RatingsPageProps = {
  Configurator?: ComponentType<RatingsConfiguratorProps>;
};

export default function RatingsPage({ Configurator }: RatingsPageProps) {
  const data = useLoaderData<typeof loader>();
  const submit = useSubmit();
  async function onRatingsChange(ratings: Rating[]) {
    submit({ ratings }, { method: 'patch', encType: 'application/json' });
  }

  return (
    <>
      {data && (
        <GridContainer spacing={3}>
          <GridItem xs={12}>
            {Configurator &&
              eq(data.balanceSheetVersion, BalanceSheetVersion.v5_1_0) && (
                <Configurator
                  initialRatings={data.ratings}
                  onRatingsChange={onRatingsChange}
                />
              )}
          </GridItem>
          <GridItem xs={12}>
            <RatingsForm
              ratings={data.ratings}
              onRatingsChange={onRatingsChange}
            />
          </GridItem>
        </GridContainer>
      )}
    </>
  );
}

export async function loader(
  { params, request }: LoaderFunctionArgs,
  handlerCtx: unknown
) {
  const { userData } = handlerCtx as { userData: User };
  if (!userData) {
    return null;
  }

  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, 'en')
  );
  const balanceSheet = await apiClient.getBalanceSheet(
    Number(params.balanceSheetId)
  );

  const pathMap: Record<string, StakholderShortNames> = {
    suppliers: StakholderShortNames.Suppliers,
    finance: StakholderShortNames.Finance,
    customers: StakholderShortNames.Customers,
    employees: StakholderShortNames.Employees,
    society: StakholderShortNames.Society,
  };
  const urlSplit = request.url.split('/');
  const lastSegment = urlSplit[urlSplit.length - 1];
  return {
    ratings: balanceSheet.ratings.filter((rating: Rating) =>
      rating.shortName.startsWith(pathMap[lastSegment])
    ),
    balanceSheetVersion: balanceSheet.version,
  };
}

export async function action(
  { params, request }: ActionFunctionArgs,
  handlerCtx: unknown
) {
  const data = await request.json();
  const { userData } = handlerCtx as { userData: User };
  if (!userData) {
    return null;
  }

  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, 'en')
  );
  return await apiClient.updateBalanceSheet(Number(params.balanceSheetId), {
    ratings: data.ratings.map((r: Rating) => ({
      shortName: r.shortName,
      estimations: r.estimations,
      weight: r.isWeightSelectedByUser ? r.weight : undefined,
    })),
  });
}
