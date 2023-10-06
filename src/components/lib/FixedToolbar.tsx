import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRightFromBracket,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import { Trans } from 'react-i18next';
import { AppBar, Tooltip, useTheme } from '@mui/material';
import { useUser } from '../../contexts/UserProvider';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

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
  const { logout } = useUser();
  const navigate = useNavigate();

  function onLogoutClicked() {
    logout();
    navigate('/');
  }

  return (
    <FixedAppBar>
      <StyledToolbar>
        <IconButton
          aria-label="toogle sidebar"
          disabled={onToogleSidebar === undefined}
          onClick={onToogleSidebar}
        >
          <FontAwesomeIcon icon={faBars} />
        </IconButton>
        <ApplicationName
          variant="h6"
          color={theme.palette.primary.contrastText}
        >
          <Trans>ECG Calculator</Trans>
        </ApplicationName>
        <Tooltip title="Logout">
          <IconButton aria-label="logout" onClick={onLogoutClicked}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </IconButton>
        </Tooltip>
      </StyledToolbar>
    </FixedAppBar>
  );
}
