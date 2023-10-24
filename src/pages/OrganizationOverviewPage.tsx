import { Trans, useTranslation } from 'react-i18next';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListProvider';
import { OrganizationForm } from '../components/organization/OrganizationForm';
import { useOrganizations } from '../contexts/OrganizationProvider';
import GridContainer from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { useAlert } from '../contexts/AlertContext';
import { OrganizationRequestBody } from '../models/Organization';
import { Link } from 'react-router-dom';

export function OrganizationOverviewPage() {
  const { balanceSheetItems } = useBalanceSheetItems();
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
      {balanceSheetItems.map((b) => (
        <GridItem key={b.id} xs={12} sm={3}>
          <CardActionArea component={Link} to={`balancesheet/${b.id}/overview`}>
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
  );
}
