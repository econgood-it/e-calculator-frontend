import GridItem from '../components/layout/GridItem.tsx';
import { Trans } from 'react-i18next';
import { OrganizationForm } from '../components/organization/OrganizationForm.tsx';
import GridContainer from '../components/layout/GridContainer.tsx';
import { FixedToolbar } from '../components/lib/FixedToolbar.tsx';
import Toolbar from '@mui/material/Toolbar';
import { Box, Typography } from '@mui/material';
import {
  ActionFunctionArgs,
  json,
  redirect,
  useSubmit,
} from 'react-router-dom';
import { User } from 'oidc-react';
import {
  createApiClient,
  makeWretchInstanceWithAuth,
} from '../api/api.client.ts';
import { API_URL } from '../configuration.ts';
import { OrganizationRequestBody } from '../models/Organization.ts';

export function OrganizationCreationPage() {
  const submit = useSubmit();
  async function createOrganization(organization: OrganizationRequestBody) {
    submit(
      { organization, intent: 'createOrganization' },
      { method: 'post', encType: 'application/json' }
    );
  }
  return (
    <>
      <FixedToolbar showCompleteUserMenu={false} />
      <Box>
        <Toolbar />
        <GridContainer spacing={3} padding={2}>
          <GridItem xs={12}>
            <Typography variant="h1">
              <Trans>
                Please create an organization to be able to create balance
                sheets for it later.
              </Trans>
            </Typography>
          </GridItem>
          <GridItem xs={12}>
            <OrganizationForm
              organization={undefined}
              onSave={createOrganization}
            />
          </GridItem>
        </GridContainer>
      </Box>
    </>
  );
}

export async function action(
  { request }: ActionFunctionArgs,
  handlerCtx: unknown
) {
  const { intent, ...data } = await request.json();
  const { userData } = handlerCtx as { userData: User };
  if (!userData) {
    return null;
  }
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, 'en')
  );

  if (intent === 'createOrganization') {
    const organization = await apiClient.createOrganization(data.organization);
    return redirect(`/organization/${organization.id}/overview`);
  }
  throw json({ message: 'Invalid intent' }, { status: 400 });
}
