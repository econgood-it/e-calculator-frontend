import {
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Trans } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faPlus } from '@fortawesome/free-solid-svg-icons';
import { OrganizationCreationDialog } from './OrganizationCreationDialog';
import { useState } from 'react';
import { useOrganizations } from '../../contexts/OrganizationProvider';
import GridContainer from '../layout/GridContainer';
import GridItem from '../layout/GridItem';
import { Link, useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

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
      <GridContainer>
        <GridItem xs={12}>
          <List
            subheader={
              <ListSubheader>
                <Trans>Organizations</Trans>
              </ListSubheader>
            }
          >
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to={`/organization/${activeOrganization?.id}`}
              >
                <ListItemIcon>
                  <FontAwesomeIcon icon={faHouse} />
                </ListItemIcon>
                <ListItemText primary={<Trans>Overview</Trans>} />
              </ListItemButton>
            </ListItem>
            <ListItem key={'create-organization'} disablePadding>
              <ListItemButton onClick={() => setOrganizationDialogOpen(true)}>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faPlus} />
                </ListItemIcon>
                <ListItemText primary={<Trans>Create organization</Trans>} />
              </ListItemButton>
            </ListItem>
            {activeOrganization && (
              <ListItem key={'select-organization'}>
                <Select
                  variant="standard"
                  aria-label="Organization selection"
                  fullWidth
                  value={activeOrganization.id}
                  onChange={onOrganizationChange}
                >
                  {organizationItems.map((o) => (
                    <MenuItem key={o.id} value={o.id}>
                      {o.name}
                    </MenuItem>
                  ))}
                </Select>
              </ListItem>
            )}
          </List>
        </GridItem>
      </GridContainer>
      <OrganizationCreationDialog
        fullScreen={false}
        open={organizationDialogOpen}
        onClose={() => {
          setOrganizationDialogOpen(false);
        }}
      />
    </>
  );
}
