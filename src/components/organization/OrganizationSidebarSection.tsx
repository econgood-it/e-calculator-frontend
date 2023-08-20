import { MenuItem, Select, SelectChangeEvent, Tooltip } from '@mui/material';
import { Trans } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { OrganizationCreationDialog } from './OrganizationCreationDialog';
import { useState } from 'react';
import { useOrganizations } from '../../contexts/OrganizationContext';
import GridContainer from '../layout/GridContainer';
import GridItem from '../layout/GridItem';

export function OrganizationSidebarSection() {
  const { organizationItems, setActiveOrganizationById, activeOrganization } =
    useOrganizations();
  const [organizationDialogOpen, setOrganizationDialogOpen] =
    useState<boolean>(false);

  function onOrganizationChange(v: SelectChangeEvent<number | string>) {
    setActiveOrganizationById(
      v.target.value === 'default' ? undefined : Number(v.target.value)
    );
  }

  return (
    <>
      <GridContainer justifyContent="space-around" alignItems="center">
        <GridItem xs={6}>
          <Select
            variant="standard"
            value={
              (organizationItems.length > 0 && activeOrganization?.id) ||
              'default'
            }
            onChange={onOrganizationChange}
          >
            <MenuItem value={'default'}>
              <Trans>My balance sheets</Trans>
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
        open={organizationDialogOpen}
        setOpen={setOrganizationDialogOpen}
      />
    </>
  );
}
