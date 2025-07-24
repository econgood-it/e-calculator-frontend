import { faHouse, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import { Trans } from 'react-i18next';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import {
  OrganizationItems,
  OrganizationRequestBody,
} from '../../models/Organization';
import GridContainer from '../layout/GridContainer';
import GridItem from '../layout/GridItem';
import { OrganizationCreationDialog } from './OrganizationCreationDialog';

type OrganizationSidebarSectionProps = {
  organizationItems: OrganizationItems;
  activeOrganizationId: number;
  onCreateClicked: (organization: OrganizationRequestBody) => Promise<void>;
  isMemberOfCertificationAuthority: boolean;
};

export function OrganizationSidebarSection({
  organizationItems,
  activeOrganizationId,
  onCreateClicked,
  isMemberOfCertificationAuthority,
}: OrganizationSidebarSectionProps) {
  const [organizationDialogOpen, setOrganizationDialogOpen] =
    useState<boolean>(false);
  const matchOrgaView = useMatch('organization/:id');

  const navigate = useNavigate();

  function onOrganizationChange(v: SelectChangeEvent<number | string>) {
    const selectedOrgaId = Number(v.target.value);
    // setActiveOrganizationById(selectedOrgaId);
    navigate(`/organization/${selectedOrgaId}/overview`);
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
            {!isMemberOfCertificationAuthority ? (
              <ListItem disablePadding>
                <ListItemButton
                  selected={matchOrgaView !== null}
                  component={Link}
                  to={`/organization/${activeOrganizationId}/overview`}
                >
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faHouse} />
                  </ListItemIcon>
                  <ListItemText primary={<Trans>Overview</Trans>} />
                </ListItemButton>
              </ListItem>
            ) : null}
            {!isMemberOfCertificationAuthority ? (
              <ListItem key={'create-organization'} disablePadding>
                <ListItemButton onClick={() => setOrganizationDialogOpen(true)}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faPlus} />
                  </ListItemIcon>
                  <ListItemText primary={<Trans>Create organization</Trans>} />
                </ListItemButton>
              </ListItem>
            ) : null}
            {
              <ListItem key={'select-organization'}>
                <Select
                  variant="standard"
                  aria-label="Organization selection"
                  fullWidth
                  value={activeOrganizationId}
                  onChange={onOrganizationChange}
                >
                  {organizationItems.map((o) => (
                    <MenuItem key={o.id} value={o.id}>
                      {o.name}
                    </MenuItem>
                  ))}
                </Select>
              </ListItem>
            }
          </List>
        </GridItem>
      </GridContainer>
      <OrganizationCreationDialog
        onCreateClicked={onCreateClicked}
        fullScreen={false}
        open={organizationDialogOpen}
        onClose={() => {
          setOrganizationDialogOpen(false);
        }}
      />
    </>
  );
}
