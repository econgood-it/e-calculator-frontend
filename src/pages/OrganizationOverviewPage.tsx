import { Trans } from 'react-i18next';
import { OrganizationForm } from '../components/organization/OrganizationForm';
import GridContainer from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import { Typography } from '@mui/material';
import { OrganizationRequestBody } from '../models/Organization';
import { BalanceSheetList } from '../components/balanceSheet/BalanceSheetList.tsx';
import {
  ActionFunctionArgs,
  json,
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
import { OrganizationInvitations } from '../components/organization/OrganizationInvitations.tsx';

export function OrganizationOverviewPage() {
  const organization = useLoaderData<typeof loader>();
  const submit = useSubmit();
  async function onOrganizationSave(organization: OrganizationRequestBody) {
    submit(
      { ...organization, intent: 'update' },
      {
        method: 'put',
        encType: 'application/json',
      }
    );
  }
  async function onInvitation(email: string) {
    submit(
      { email, intent: 'invite' },
      {
        method: 'put',
        encType: 'application/json',
      }
    );
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
        <GridItem xs={12}>
          {organization?.invitations && (
            <OrganizationInvitations
              invitations={organization.invitations}
              onInvitation={onInvitation}
            />
          )}
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
  const { intent, ...data } = await request.json();
  const { userData } = handlerCtx as { userData: User };
  if (!params.orgaId || !userData) {
    return null;
  }
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, 'en')
  );
  if (intent === 'invite') {
    await apiClient.inviteUserToOrganization(
      Number.parseInt(params.orgaId),
      data.email
    );
    return { ok: true };
  } else if (intent === 'update') {
    await apiClient.updateOrganization(Number.parseInt(params.orgaId), data);
    return { ok: true };
  }

  throw json({ message: 'Invalid intent' }, { status: 400 });
}
