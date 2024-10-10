import { RatingsForm } from '../components/balanceSheet/RatingsForm';
import { Rating, StakholderShortNames } from '../models/Rating';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useSubmit,
} from 'react-router-dom';
import {
  createApiClient,
  makeWretchInstanceWithAuth,
} from '../api/api.client.ts';

import { API_URL } from '../configuration.ts';
import { useLoaderData } from 'react-router-typesafe';
import { WeightConfigurator } from '../components/balanceSheet/WeightConfigurators.tsx';
import GridContainer from '../components/layout/GridContainer.tsx';
import GridItem from '../components/layout/GridItem.tsx';
import { HandlerContext } from './handlerContext.ts';

export default function RatingsPage() {
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
            <WeightConfigurator
              ratings={data.ratings}
              onRatingsChange={onRatingsChange}
              version={data.balanceSheetVersion}
            />
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
  const { userData, lng } = handlerCtx as HandlerContext;
  if (!userData) {
    return null;
  }

  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
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
  const { userData, lng } = handlerCtx as HandlerContext;
  if (!userData) {
    return null;
  }

  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
  );
  return await apiClient.updateBalanceSheet(Number(params.balanceSheetId), {
    ratings: data.ratings.map((r: Rating) => ({
      shortName: r.shortName,
      estimations: r.estimations,
      weight: r.isWeightSelectedByUser ? r.weight : undefined,
    })),
  });
}
