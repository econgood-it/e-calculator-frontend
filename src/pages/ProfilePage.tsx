import { LoaderFunctionArgs } from 'react-router-dom';
import {
  createApiClient,
  makeWretchInstanceWithAuth,
} from '../api/api.client.ts';
import { API_URL } from '../configuration.ts';
import { User } from 'oidc-react';

export async function loader(_: LoaderFunctionArgs, handlerCtx: unknown) {
  const { userData } = handlerCtx as { userData: User };
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, 'en')
  );
  return await apiClient.getInvitations();
}
