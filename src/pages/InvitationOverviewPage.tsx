import GridContainer from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
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
import { OrganizationInvitations } from '../components/organization/OrganizationInvitations.tsx';
import i18n from '../i18n.ts';

export function InvitationOverviewPage() {
  const invitations = useLoaderData<typeof loader>();
  const submit = useSubmit();
  async function onInvitation(email: string) {
    submit(
      { email },
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
          {invitations && (
            <OrganizationInvitations
              invitations={invitations}
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
  const organization = await apiClient.getOrganization(
    Number.parseInt(params.orgaId)
  );
  return organization.invitations;
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
  try {
    await apiClient.inviteUserToOrganization(
      Number.parseInt(params.orgaId),
      data.email
    );
  } catch (error) {
    throw Error(i18n.t`Invitation failed`);
  }

  return null;
}
