import { MatrixView } from '../components/matrix/MatrixView';
import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import { useEffect, useState } from 'react';
import { Matrix } from '../models/Matrix';
import { useApi } from '../contexts/ApiProvider';
import { LoadingPage } from './LoadingPage';
import GridContainer from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import { Typography } from '@mui/material';
import { Trans } from 'react-i18next';

export function BalanceSheetOverviewPage() {
  const { balanceSheet } = useActiveBalanceSheet();
  const api = useApi();
  const [matrix, setMatrix] = useState<Matrix | undefined>();
  useEffect(() => {
    (async () => {
      if (balanceSheet) {
        setMatrix(await api.getBalanceSheetAsMatrix(balanceSheet.id!));
      }
    })();
  }, [balanceSheet, api]);
  return (
    <GridContainer spacing={2}>
      <GridItem xs={12}>
        <Typography variant="h1">
          <Trans>Matrix representation</Trans>
        </Typography>
      </GridItem>
      <GridItem xs={12}>
        {matrix ? <MatrixView matrix={matrix} /> : <LoadingPage />}
      </GridItem>
    </GridContainer>
  );
}
