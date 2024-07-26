import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  BalanceSheetCreateRequestBody,
  BalanceSheetItem,
} from '../../models/BalanceSheet.ts';
import GridContainer from '../layout/GridContainer.tsx';
import GridItem from '../layout/GridItem.tsx';
import { BalanceSheetCreationDialog } from './BalanceSheetCreationDialog.tsx';

type BalanceSheetListProps = {
  balanceSheetItems: BalanceSheetItem[];
  onCreateBalanceSheet: (
    balanceSheet: BalanceSheetCreateRequestBody
  ) => Promise<void>;
};

export function BalanceSheetList({
  balanceSheetItems,
  onCreateBalanceSheet,
}: BalanceSheetListProps) {
  const [showBalanceSheetCreationDialog, setShowBalanceSheetCreationDialog] =
    useState<boolean>(false);

  return (
    <GridContainer spacing={3}>
      <GridItem xs={12}>
        <Typography variant={'h1'}>
          <Trans>Balance sheets</Trans>
        </Typography>
      </GridItem>
      <GridItem xs={12}>
        <Button
          variant="contained"
          onClick={() => setShowBalanceSheetCreationDialog(true)}
        >
          <Trans>Create balance sheet</Trans>
        </Button>
      </GridItem>
      {balanceSheetItems.map((b) => (
        <GridItem key={b.id} xs={12} sm={3}>
          <CardActionArea component={Link} to={`/balancesheet/${b.id}/overview`}>
            <Card aria-label={`Balance sheet ${b.id}`}>
              <CardContent>
                <Typography variant="h5" component="div">
                  <Trans>Balance sheet</Trans> {b.id}
                </Typography>
              </CardContent>
            </Card>
          </CardActionArea>
        </GridItem>
      ))}
      <BalanceSheetCreationDialog
        open={showBalanceSheetCreationDialog}
        onClose={() => setShowBalanceSheetCreationDialog(false)}
        onSave={onCreateBalanceSheet}
      />
    </GridContainer>
  );
}
