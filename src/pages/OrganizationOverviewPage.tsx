import { Trans, useTranslation } from 'react-i18next';
import { OrganizationForm } from '../components/organization/OrganizationForm';
import { useOrganizations } from '../contexts/OrganizationProvider';
import GridContainer from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import { Typography } from '@mui/material';
import { useAlert } from '../contexts/AlertContext';
import { OrganizationRequestBody } from '../models/Organization';
import { OrganizationInvitations } from '../components/organization/OrganizationInvitations.tsx';
import { BalanceSheetList } from '../components/balanceSheet/BalanceSheetList.tsx';

export function OrganizationOverviewPage() {
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
          <BalanceSheetList />
        </GridItem>
        <GridItem xs={12}>
          <OrganizationInvitations />
        </GridItem>
      </GridContainer>
    </>
  );
}
