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
import { API_URL } from '../configuration.ts';
import { useLoaderData } from 'react-router-typesafe';

const RatingsPage = () => {
  const ratings = useLoaderData<typeof loader>();
  const submit = useSubmit();
  async function onRatingsChange(ratings: Rating[]) {
    submit({ ratings }, { method: 'patch', encType: 'application/json' });
  }

  return (
    <>
      {ratings && (
        <RatingsForm ratings={ratings} onRatingsChange={onRatingsChange} />
      )}
    </>
  );
};

export default RatingsPage;

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
  return balanceSheet.ratings.filter((rating: Rating) =>
    rating.shortName.startsWith(pathMap[lastSegment])
  );
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
