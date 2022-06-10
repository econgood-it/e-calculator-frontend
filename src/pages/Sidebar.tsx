import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faBuilding,
  faFolderOpen,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { AppBar, Box, ListSubheader } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

const FixedAppBar = styled(AppBar)`
  z-index: ${(props) => props.theme.zIndex.drawer + 1};
`;

const StyledToolbar = styled(Toolbar)`
  padding-left: 0px;
`;

const Content = styled.div<{ $open: boolean; $drawerWidth: number }>`
  margin-top: 16px;
  margin-left: ${(props) => (props.$open ? props.$drawerWidth + 16 : 16)}px;
`;

const DrawerWithFixedWidth = styled(Drawer)<{ $drawerWidth: number }>`
  & .MuiDrawer-paper {
    width: ${(props) => props.$drawerWidth}px;
  }
`;

export default function Sidebar() {
  const [open, setOpen] = useState<boolean>(true);
  const { t } = useTranslation('sidebar');
  const navigate = useNavigate();
  const { balanceSheetId } = useParams();

  const drawerWidth = 240;
  const toogleSidebar = () => {
    setOpen(!open);
  };

  const navigateWithinActiveBalanceSheet = (path: string) => {
    if (balanceSheetId) {
      navigate(`/balancesheets/${balanceSheetId}/${path}`);
    }
  };

  return (
    <>
      <FixedAppBar>
        <StyledToolbar>
          <IconButton aria-label="toogle sidebar" onClick={toogleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            <Trans t={t}>ECG Calculator</Trans>
          </Typography>
        </StyledToolbar>
      </FixedAppBar>
      <DrawerWithFixedWidth
        variant="persistent"
        anchor="left"
        open={open}
        sx={{ width: drawerWidth }}
        $drawerWidth={drawerWidth}
      >
        <Toolbar />
        <Box>
          <ListSubheader>
            <Trans t={t}>Overview</Trans>
          </ListSubheader>
          <List>
            <ListItem key={'balancesheets'} disablePadding>
              <ListItemButton onClick={() => navigate('/balancesheets')}>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faFolderOpen} />
                </ListItemIcon>
                <ListItemText primary={<Trans t={t}>Balance sheets</Trans>} />
              </ListItemButton>
            </ListItem>
          </List>
          {balanceSheetId && (
            <>
              <ListSubheader>
                <Trans t={t}>Active Balance Sheet</Trans>
              </ListSubheader>
              <List>
                <ListItem key={'company-facts'} disablePadding>
                  <ListItemButton
                    onClick={() =>
                      navigateWithinActiveBalanceSheet('company-facts')
                    }
                  >
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faBuilding} />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Trans t={t}>Company Facts</Trans>}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </>
          )}
        </Box>
      </DrawerWithFixedWidth>
      <Box>
        <Toolbar />
        <Content $open={open} $drawerWidth={drawerWidth}>
          <Outlet />
        </Content>
      </Box>
    </>
  );
}
