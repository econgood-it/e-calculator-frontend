import { Typography } from '@mui/material';
import { Trans } from 'react-i18next';
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  useSubmit,
} from 'react-router-dom';
import { redirect, useLoaderData } from 'react-router-typesafe';
import {
  createApiClient,
  makeWretchInstanceWithAuth,
} from '../api/api.client.ts';
import { BalanceSheetList } from '../components/balanceSheet/BalanceSheetList.tsx';
import { FormContainer } from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import { OrganizationForm } from '../components/organization/OrganizationForm';
import { OrganizationInvitations } from '../components/organization/OrganizationInvitations.tsx';
import { API_URL } from '../configuration.ts';
import { BalanceSheetCreateRequestBody } from '../models/BalanceSheet.ts';
import { OrganizationRequestBody } from '../models/Organization';
import { HandlerContext } from './handlerContext.ts';

export function OrganizationOverviewPage() {
  const data = useLoaderData<typeof loader>();
  const submit = useSubmit();
  async function onOrganizationSave(organization: OrganizationRequestBody) {
    submit(
      { ...organization, intent: 'updateOrganization' },
      {
        method: 'put',
        encType: 'application/json',
      }
    );
  }
  async function onInvitation(email: string) {
    submit(
      { email, intent: 'inviteToOrganization' },
      {
        method: 'put',
        encType: 'application/json',
      }
    );
  }
  async function onCreateBalanceSheet(
    newBalanceSheet: BalanceSheetCreateRequestBody
  ) {
    submit(
      { ...newBalanceSheet, intent: 'createBalanceSheet' },
      {
        method: 'post',
        encType: 'application/json',
      }
    );
  }

  return (
    <FormContainer spacing={3}>
      <GridItem xs={12}>
        <Typography variant={'h1'}>
          <Trans>Your Organization</Trans>
        </Typography>
      </GridItem>
      <GridItem xs={12}>
        {data && (
          <OrganizationForm
            organization={data.organization}
            onSave={onOrganizationSave}
          />
        )}
      </GridItem>
      <GridItem xs={12}>
        {data && (
          <BalanceSheetList
            balanceSheetItems={data?.balanceSheetItems}
            onCreateBalanceSheet={onCreateBalanceSheet}
          />
        )}
      </GridItem>
      <GridItem xs={12}>
        {data?.organization?.invitations && (
          <OrganizationInvitations
            invitations={data.organization.invitations}
            onInvitation={onInvitation}
          />
        )}
      </GridItem>
    </FormContainer>
  );
}

export async function loader(
  { params }: LoaderFunctionArgs,
  handlerCtx: unknown
) {
  const { userData, lng } = handlerCtx as HandlerContext;
  if (!params.orgaId || !userData) {
    return null;
  }
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
  );
  const orgaId = Number.parseInt(params.orgaId);
  const organization = await apiClient.getOrganization(orgaId);
  const balanceSheetItems = await apiClient.getBalanceSheets(orgaId);
  return { organization, balanceSheetItems };
}

export async function action(
  { params, request }: ActionFunctionArgs,
  handlerCtx: unknown
) {
  const { intent, ...data } = await request.json();
  const { userData, lng } = handlerCtx as HandlerContext;
  if (!params.orgaId || !userData) {
    return null;
  }
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
  );

  const organizationId = Number.parseInt(params.orgaId);
  if (intent === 'inviteToOrganization') {
    await apiClient.inviteUserToOrganization(organizationId, data.email);
    return { ok: true };
  } else if (intent === 'updateOrganization') {
    await apiClient.updateOrganization(organizationId, data);
    return { ok: true };
  } else if (intent === 'createBalanceSheet') {
    const { id } = await apiClient.createBalanceSheet(data, organizationId);
    return redirect(`../balancesheet/${id}/overview`);
  }

  throw json({ message: 'Invalid intent' }, { status: 400 });
}
