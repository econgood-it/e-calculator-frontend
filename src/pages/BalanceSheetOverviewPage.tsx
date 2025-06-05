import { MatrixView } from '../components/matrix/MatrixView';
import GridContainer, {
  FormContainer,
} from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';
import { Trans } from 'react-i18next';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from 'react-router-dom';
import {
  createApiClient,
  makeWretchInstanceWithAuth,
} from '../api/api.client.ts';
import { API_URL } from '../configuration.ts';
import { useLoaderData } from 'react-router-typesafe';
import { HandlerContext } from './handlerContext.ts';
import { BigNumber } from '../components/lib/BigNumber.tsx';
import { CertificationAuthorityNames } from '../../../e-calculator-schemas/src/audit.dto.ts';

export function BalanceSheetOverviewPage() {
  const theme = useTheme();
  const data = useLoaderData<typeof loader>();

  return (
    <FormContainer spacing={2}>
      <GridItem xs={12}>
        <Typography variant="h1">
          <Trans>Matrix representation</Trans>
        </Typography>
      </GridItem>
      {data?.matrix && (
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
                    >{`${data.matrix.totalPoints.toFixed(0)} / 1000`}</BigNumber>
                  </GridItem>
                  <GridItem>
                    {data.audit ? (
                      <div>
                        <Trans>Audit process number</Trans>
                        <div>{data.audit.id}</div>
                      </div>
                    ) : (
                      <Button>
                        <Trans>Submit to audit</Trans>
                      </Button>
                    )}
                  </GridItem>
                </GridContainer>
              </CardContent>
            </Card>
          </GridItem>
          <GridItem xs={12}>
            <MatrixView matrix={data.matrix} />
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
  const balanceSheetId = Number(params.balanceSheetId);
  return {
    matrix: await apiClient.getBalanceSheetAsMatrix(balanceSheetId),
    audit: await apiClient.findAuditByBalanceSheet(balanceSheetId),
  };
}

export async function action(
  { params, request }: ActionFunctionArgs,
  handlerCtx: unknown
) {
  const { intent } = await request.json();
  const { userData, lng } = handlerCtx as HandlerContext;

  if (!userData || !params.balanceSheetId) {
    return null;
  }
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
  );

  if (intent === 'submitBalanceSheet') {
    return await apiClient.submitBalanceSheetToAudit(
      parseInt(params.balanceSheetId),
      CertificationAuthorityNames.AUDIT
    );
  }

  throw json({ message: 'Invalid intent' }, { status: 400 });
}
