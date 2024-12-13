import { MatrixView } from '../components/matrix/MatrixView';
import GridContainer, {
  FormContainer,
} from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import { Avatar, Card, CardContent, Typography, useTheme } from '@mui/material';
import { Trans } from 'react-i18next';
import { LoaderFunctionArgs } from 'react-router-dom';
import {
  createApiClient,
  makeWretchInstanceWithAuth,
} from '../api/api.client.ts';
import { API_URL } from '../configuration.ts';
import { useLoaderData } from 'react-router-typesafe';
import { HandlerContext } from './handlerContext.ts';
import { BigNumber } from '../components/lib/BigNumber.tsx';

export function BalanceSheetOverviewPage() {
  const theme = useTheme();
  const matrix = useLoaderData<typeof loader>();

  return (
    <FormContainer spacing={2}>
      <GridItem xs={12}>
        <Typography variant="h1">
          <Trans>Matrix representation</Trans>
        </Typography>
      </GridItem>
      {matrix && (
        <>
          <GridItem>
            <Card>
              <CardContent>
                <GridContainer
                  alignItems={'center'}
                  justifyContent="space-between"
                  spacing={2}
                >
                  <GridItem>
                    <Avatar src="/icon_ECG_seeds.png" />
                  </GridItem>
                  <GridItem>
                    <Typography variant={'h1'}>
                      <Trans>Total points:</Trans>
                    </Typography>
                  </GridItem>
                  <GridItem>
                    <BigNumber
                      $color={theme.palette.primary.main}
                    >{`${matrix.totalPoints.toFixed(0)} / 1000`}</BigNumber>
                  </GridItem>
                </GridContainer>
              </CardContent>
            </Card>
          </GridItem>
          <GridItem xs={12}>
            <MatrixView matrix={matrix} />
          </GridItem>
        </>
      )}
    </FormContainer>
  );
}

export async function loader(
  { params }: LoaderFunctionArgs,
  handlerCtx: unknown
) {
  const { userData, lng } = handlerCtx as HandlerContext;
  if (!userData) {
    return null;
  }
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
  );
  return await apiClient.getBalanceSheetAsMatrix(Number(params.balanceSheetId));
}
