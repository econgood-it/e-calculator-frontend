import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppBar, Popover, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useAuth } from 'oidc-react';
import { MouseEvent, useState } from 'react';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FixedAppBar = styled(AppBar)`
  z-index: ${(props) => props.theme.zIndex.drawer + 1};
  background: ${(props) => props.theme.palette.primary.main};
`;

const StyledToolbar = styled(Toolbar)`
  padding-left: 0;
`;

const ApplicationName = styled(Typography)`
  flex-grow: 1;
`;

type FixedToolbarProps = {
  onToogleSidebar?: () => void;
  showCompleteUserMenu: boolean;
};

export function FixedToolbar({
  onToogleSidebar,
  showCompleteUserMenu,
}: FixedToolbarProps) {
  const theme = useTheme();
  const { signOutRedirect } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const openUserNavigationMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeOpenUserNavigationMenu = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  async function onLogoutClicked() {
    await signOutRedirect();
  }

  return (
    <FixedAppBar>
      <StyledToolbar>
        <IconButton
          aria-label="toogle sidebar"
          disabled={onToogleSidebar === undefined}
          onClick={onToogleSidebar}
        >
          <FontAwesomeIcon
            color={theme.palette.primary.contrastText}
            icon={faBars}
          />
        </IconButton>
        <ApplicationName
          variant="h3"
          color={theme.palette.primary.contrastText}
        >
          <Trans>ECG Calculator</Trans>
        </ApplicationName>
        <IconButton
          aria-label="Open user navigation menu"
          onClick={openUserNavigationMenu}
        >
          <FontAwesomeIcon
            color={theme.palette.primary.contrastText}
            icon={faUser}
          />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={closeOpenUserNavigationMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <List>
            {showCompleteUserMenu && (
              <ListItemButton to={'profile'} component={Link}>
                <Trans>Profile</Trans>
              </ListItemButton>
            )}
            <ListItemButton onClick={onLogoutClicked}>
              <Trans>Logout</Trans>
            </ListItemButton>
          </List>
        </Popover>
      </StyledToolbar>
    </FixedAppBar>
  );
}
