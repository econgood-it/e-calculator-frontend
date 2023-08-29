import { MenuItem, Select, SelectChangeEvent, Tooltip } from '@mui/material';
import { Trans } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { OrganizationCreationDialog } from './OrganizationCreationDialog';
import { useState } from 'react';
import { useOrganizations } from '../../contexts/OrganizationProvider';
import GridContainer from '../layout/GridContainer';
import GridItem from '../layout/GridItem';
import { useNavigate } from 'react-router-dom';

export function OrganizationSidebarSection() {
  const { organizationItems, setActiveOrganizationById, activeOrganization } =
    useOrganizations();
  const [organizationDialogOpen, setOrganizationDialogOpen] =
    useState<boolean>(false);

  const navigate = useNavigate();

  function onOrganizationChange(v: SelectChangeEvent<number | string>) {
    const selectedOrgaId = Number(v.target.value);
    setActiveOrganizationById(selectedOrgaId);
    navigate(`/organization/${selectedOrgaId}`);
  }

  return (
    <>
      <GridContainer justifyContent="space-around" alignItems="center">
        <GridItem xs={6}>
          <Select
            variant="standard"
            value={
              (organizationItems.length > 0 && activeOrganization?.id) ||
              'placeholder'
            }
            onChange={onOrganizationChange}
          >
            <MenuItem value="placeholder" disabled>
              <Trans>Organization selection</Trans>
            </MenuItem>
            {organizationItems.map((o) => (
              <MenuItem key={o.id} value={o.id}>
                <Trans>{`Organization ${o.id}`}</Trans>
              </MenuItem>
            ))}
          </Select>
        </GridItem>
        <GridItem xs={3}>
          <Tooltip title={<Trans>Create organization</Trans>}>
            <IconButton
              color={'primary'}
              aria-label={'Create organization'}
              onClick={() => setOrganizationDialogOpen(true)}
            >
              <FontAwesomeIcon icon={faSquarePlus} />
            </IconButton>
          </Tooltip>
        </GridItem>
      </GridContainer>
      <OrganizationCreationDialog
        closable={true}
        open={organizationDialogOpen}
        onClose={() => setOrganizationDialogOpen(false)}
      />
    </>
  );
}
