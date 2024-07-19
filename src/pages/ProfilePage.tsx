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
import { User } from 'oidc-react';
import { useLoaderData } from 'react-router-typesafe';
import { Trans } from 'react-i18next';
import GridContainer from '../components/layout/GridContainer.tsx';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import GridItem from '../components/layout/GridItem.tsx';

export function ProfilePage() {
  const invitations = useLoaderData<typeof loader>();
  const submit = useSubmit();
  async function onJoin(id: number) {
    submit({ id }, { method: 'patch', encType: 'application/json' });
  }
  return (
    <>
      <GridContainer spacing={3}>
        <GridItem xs={12}>
          <Typography variant="h1">
            <Trans>You were invited to the following organizations</Trans>
          </Typography>
        </GridItem>
        {invitations.map((invitation) => (
          <GridItem sm={3} xs={12} key={invitation.id}>
            <Card>
              <CardContent>{invitation.name}</CardContent>
              <CardActions>
                <Button
                  variant={'contained'}
                  onClick={() => onJoin(invitation.id)}
                >
                  <Trans>Join</Trans>
                </Button>
              </CardActions>
            </Card>
          </GridItem>
        ))}
      </GridContainer>
    </>
  );
}

export async function loader(_: LoaderFunctionArgs, handlerCtx: unknown) {
  const { userData } = handlerCtx as { userData: User };
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, 'en')
  );
  return await apiClient.getInvitations();
}

export async function action(
  { request }: ActionFunctionArgs,
  handlerCtx: unknown
) {
  const { userData } = handlerCtx as { userData: User };
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, 'en')
  );
  const { id } = await request.json();
  return await apiClient.joinOrganization(id);
}
