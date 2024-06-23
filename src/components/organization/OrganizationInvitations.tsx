import { useOrganizations } from '../../contexts/OrganizationProvider.tsx';
import GridItem from '../layout/GridItem.tsx';
import { Card, CardContent, Typography } from '@mui/material';
import { Trans } from 'react-i18next';
import GridContainer from '../layout/GridContainer.tsx';

export function OrganizationInvitations() {
  const { activeOrganization } = useOrganizations();
  return (
    <GridContainer spacing={3}>
      <GridItem xs={12}>
        <Typography variant={'h1'}>
          <Trans>Invitations</Trans>
        </Typography>
      </GridItem>
      {activeOrganization?.invitations.map((invitation) => (
        <GridItem key={invitation} xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {invitation}
              </Typography>
            </CardContent>
          </Card>
        </GridItem>
      ))}
    </GridContainer>
  );
}
