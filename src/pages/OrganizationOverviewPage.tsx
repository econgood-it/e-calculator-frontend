import { Trans, useTranslation } from 'react-i18next';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListProvider';
import { OrganizationForm } from '../components/organization/OrganizationForm';
import { useOrganizations } from '../contexts/OrganizationProvider';
import GridContainer from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';
import { useAlert } from '../contexts/AlertContext';
import { OrganizationRequestBody } from '../models/Organization';
import { Link } from 'react-router-dom';
import { BalanceSheetCreationDialog } from '../components/balanceSheet/BalanceSheetCreationDialog';
import { useState } from 'react';

export function OrganizationOverviewPage() {
  const { balanceSheetItems } = useBalanceSheetItems();
  const [showBalanceSheetCreationDialog, setShowBalanceSheetCreationDialog] =
    useState<boolean>(false);
  const { addSuccessAlert } = useAlert();
  const { t } = useTranslation();
  const { activeOrganization, updateActiveOrganization } = useOrganizations();
  async function onOrganizationSave(organization: OrganizationRequestBody) {
    await updateActiveOrganization(organization);
    addSuccessAlert(t`Updated organization`);
  }
  return (
    <>
      <GridContainer spacing={3}>
        <GridItem xs={12}>
          <Typography variant={'h1'}>
            <Trans>Your Organization</Trans>
          </Typography>
        </GridItem>
        <GridItem xs={12}>
          <OrganizationForm
            organization={activeOrganization}
            onSave={onOrganizationSave}
          />
        </GridItem>
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
            <CardActionArea
              component={Link}
              to={`balancesheet/${b.id}/overview`}
            >
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
      </GridContainer>
      <BalanceSheetCreationDialog
        open={showBalanceSheetCreationDialog}
        onClose={() => setShowBalanceSheetCreationDialog(false)}
      />
    </>
  );
}
