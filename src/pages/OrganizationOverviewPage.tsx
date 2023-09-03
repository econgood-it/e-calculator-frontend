import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListProvider';
import { OrganizationForm } from '../components/organization/OrganizationForm';
import { useOrganizations } from '../contexts/OrganizationProvider';
import GridContainer from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import { Typography } from '@mui/material';
import { useAlert } from '../contexts/AlertContext';
import { OrganizationRequestBody } from '../models/Organization';

export function OrganizationOverviewPage() {
  const [balanceSheetItems] = useBalanceSheetItems();
  const { addSuccessAlert } = useAlert();
  const { t } = useTranslation();
  const { activeOrganization, updateActiveOrganization } = useOrganizations();
  async function onOrganizationSave(organization: OrganizationRequestBody) {
    await updateActiveOrganization(organization);
    addSuccessAlert(t`Updated organization`);
  }
  return (
    <GridContainer spacing={3}>
      <GridItem xs={12}>
        <Typography variant={'h2'}>
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
        <Typography variant={'h2'}>
          <Trans>Balance sheets</Trans>
        </Typography>
      </GridItem>
      <GridItem xs={12}>
        {balanceSheetItems.map((b) => (
          <div key={b.id}>
            <Link to={`balancesheet/${b.id}`}>
              <Trans>Balance sheet</Trans> {b.id}
            </Link>
          </div>
        ))}
      </GridItem>
    </GridContainer>
  );
}
