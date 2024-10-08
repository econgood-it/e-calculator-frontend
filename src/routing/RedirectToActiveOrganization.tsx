import { LoaderFunctionArgs } from 'react-router-dom';
import {
  createApiClient,
  makeWretchInstanceWithAuth,
} from '../api/api.client.ts';
import { API_URL } from '../configuration.ts';
import { redirect } from 'react-router-typesafe';
import { HandlerContext } from '../pages/handlerContext.ts';

export async function loader(_: LoaderFunctionArgs, handlerCtx: unknown) {
  const { userData, lng } = handlerCtx as HandlerContext;
  if (!userData) {
    return null;
  }
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
  );
  const organizations = await apiClient.getOrganizations();
  if (organizations.length > 0) {
    return redirect(`organization/${organizations[0].id}/overview`);
  }
  return redirect('organization');
}
