import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppBar, MenuItem, Popover, Select, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useUser } from '../../authentication';
import { MouseEvent, useState } from 'react';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../../i18n.ts';
import packageJson from '../../../package.json';
import GridContainer from '../layout/GridContainer.tsx';
import GridItem from '../layout/GridItem.tsx';

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

const LanguageSelect = styled(Select)(({ theme }) => ({
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.contrastText,
  },
}));

type FixedToolbarProps = {
  onToogleSidebar?: () => void;
  showCompleteUserMenu: boolean;
};

export function FixedToolbar({
  onToogleSidebar,
  showCompleteUserMenu,
}: FixedToolbarProps) {
  const theme = useTheme();
  const { signOutRedirect } = useUser();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { lng, changeLanguage } = useLanguage();
  const version = packageJson.version;

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

  async function onLanguageChange(language: string) {
    await changeLanguage(language);
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
        <GridContainer spacing={2} alignItems="bottom">
          <GridItem>
            <ApplicationName
              variant="h3"
              color={theme.palette.primary.contrastText}
            >
              <Trans>ECG Calculator</Trans>
            </ApplicationName>
          </GridItem>
          <GridItem>
            <Typography variant="h3">{version}</Typography>
          </GridItem>
        </GridContainer>
        <LanguageSelect
          variant={'standard'}
          disableUnderline={true}
          aria-label={'Language selection'}
          value={lng}
          label="Language selection"
          onChange={(e) => onLanguageChange(e.target.value as string)}
        >
          <MenuItem value={'en'}>🇬🇧</MenuItem>
          <MenuItem value={'de'}>🇩🇪</MenuItem>
        </LanguageSelect>
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
