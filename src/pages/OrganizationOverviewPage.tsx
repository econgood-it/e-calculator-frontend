import { Trans } from 'react-i18next';
import { OrganizationForm } from '../components/organization/OrganizationForm';
import GridContainer from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import { Typography } from '@mui/material';
import { OrganizationRequestBody } from '../models/Organization';
import { BalanceSheetList } from '../components/balanceSheet/BalanceSheetList.tsx';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useSubmit,
} from 'react-router-dom';
import { User } from 'oidc-react';
import { useLoaderData } from 'react-router-typesafe';
import {
  createApiClient,
  makeWretchInstanceWithAuth,
} from '../api/api.client.ts';
import { API_URL } from '../configuration.ts';

export function OrganizationOverviewPage() {
  const organization = useLoaderData<typeof loader>();
  const submit = useSubmit();
  async function onOrganizationSave(organization: OrganizationRequestBody) {
    submit(organization, {
      method: 'put',
      encType: 'application/json',
    });
  }
  return (
    <>
      <GridContainer spacing={3}>
        <GridItem xs={12}>
          <Typography variant={'h1'}>
            <Trans>Your Organization</Trans>
          </Typography>
        </GridItem>
        <GridItem xs={12}>
          {organization && (
            <OrganizationForm
              organization={organization}
              onSave={onOrganizationSave}
            />
          )}
        </GridItem>
        <GridItem xs={12}>
          <BalanceSheetList />
        </GridItem>
      </GridContainer>
    </>
  );
}

export async function loader(
  { params }: LoaderFunctionArgs,
  handlerCtx: unknown
) {
  const { userData } = handlerCtx as { userData: User };
  if (!params.orgaId || !userData) {
    return null;
  }
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, 'en')
  );
  return await apiClient.getOrganization(Number.parseInt(params.orgaId));
}

export async function action(
  { params, request }: ActionFunctionArgs,
  handlerCtx: unknown
) {
  const data = await request.json();
  const { userData } = handlerCtx as { userData: User };
  if (!params.orgaId || !userData) {
    return null;
  }
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, 'en')
  );
  await apiClient.updateOrganization(Number.parseInt(params.orgaId), data);
  return null;
}
