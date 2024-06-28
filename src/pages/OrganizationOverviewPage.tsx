import { Trans, useTranslation } from 'react-i18next';
import { OrganizationForm } from '../components/organization/OrganizationForm';
import { useOrganizations } from '../contexts/OrganizationProvider';
import GridContainer from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import { Typography } from '@mui/material';
import { useAlert } from '../contexts/AlertContext';
import { OrganizationRequestBody } from '../models/Organization';
import { BalanceSheetList } from '../components/balanceSheet/BalanceSheetList.tsx';
import { LoaderFunctionArgs } from 'react-router-dom';
import { User } from 'oidc-react';
import { useLoaderData } from 'react-router-typesafe';
import { ApiClient, makeWretchInstanceWithAuth } from '../api/api.client.ts';
import { API_URL } from '../configuration.ts';

export function OrganizationOverviewPage() {
  const { addSuccessAlert } = useAlert();
  const organization = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const { updateActiveOrganization } = useOrganizations();
  async function onOrganizationSave(organization: OrganizationRequestBody) {
    await updateActiveOrganization(organization);
    addSuccessAlert(t`Updated organization`);
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

export function loader({ params }: LoaderFunctionArgs, handlerCtx: unknown) {
  const { userData } = handlerCtx as { userData: User };
  if (!params.orgaId || !userData) {
    return null;
  }
  const apiClient = new ApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, 'en')
  );

  return apiClient.getOrganization(Number.parseInt(params.orgaId));
}
