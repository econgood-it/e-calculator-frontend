import { MatrixView } from '../components/matrix/MatrixView';
import GridContainer from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import { Typography } from '@mui/material';
import { Trans } from 'react-i18next';
import { LoaderFunctionArgs } from 'react-router-dom';
import { User } from 'oidc-react';
import {
  createApiClient,
  makeWretchInstanceWithAuth,
} from '../api/api.client.ts';
import { API_URL } from '../configuration.ts';
import { useLoaderData } from 'react-router-typesafe';

export function BalanceSheetOverviewPage() {
  const matrix = useLoaderData<typeof loader>();

  return (
    <GridContainer spacing={2}>
      <GridItem xs={12}>
        <Typography variant="h1">
          <Trans>Matrix representation</Trans>
        </Typography>
      </GridItem>
      <GridItem xs={12}>{matrix && <MatrixView matrix={matrix} />}</GridItem>
    </GridContainer>
  );
}

export async function loader(
  { params }: LoaderFunctionArgs,
  handlerCtx: unknown
) {
  const { userData } = handlerCtx as { userData: User };
  if (!userData) {
    return null;
  }
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, 'en')
  );
  return await apiClient.getBalanceSheetAsMatrix(Number(params.balanceSheetId));
}
