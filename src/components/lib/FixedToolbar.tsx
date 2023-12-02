import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRightFromBracket,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import { Trans } from 'react-i18next';
import { AppBar, Tooltip, useTheme } from '@mui/material';
import styled from 'styled-components';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useAuth } from 'oidc-react';

const FixedAppBar = styled(AppBar)`
  z-index: ${(props) => props.theme.zIndex.drawer + 1};
  background: ${(props) => props.theme.palette.primary.main};
`;

const StyledToolbar = styled(Toolbar)`
  padding-left: 0px;
`;

const ApplicationName = styled(Typography)`
  flex-grow: 1;
`;

type FixedToolbarProps = {
  onToogleSidebar?: () => void;
};

export function FixedToolbar({ onToogleSidebar }: FixedToolbarProps) {
  const theme = useTheme();
  const { signOutRedirect } = useAuth();

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
          variant="h6"
          color={theme.palette.primary.contrastText}
        >
          <Trans>ECG Calculator</Trans>
        </ApplicationName>
        <Tooltip title="Logout">
          <IconButton aria-label="logout" onClick={onLogoutClicked}>
            <FontAwesomeIcon
              color={theme.palette.primary.contrastText}
              icon={faArrowRightFromBracket}
            />
          </IconButton>
        </Tooltip>
      </StyledToolbar>
    </FixedAppBar>
  );
}
