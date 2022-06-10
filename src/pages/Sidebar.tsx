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
import { faBars, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { AppBar, Box, ListSubheader } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Outlet, useNavigate } from 'react-router-dom';

const FixedAppBar = styled(AppBar)`
  z-index: ${(props) => props.theme.zIndex.drawer + 1};
`;

const StyledToolbar = styled(Toolbar)`
  padding-left: 0px;
`;

const Content = styled.div<{ $open: boolean; $drawerWidth: number }>`
  margin-top: 16px;
  margin-left: ${(props) => (props.$open ? props.$drawerWidth : 16)}px;
`;

const DrawerWithFixedWidth = styled(Drawer)<{ $drawerWidth: number }>`
  &.MuiDrawer-paper {
    width: ${(props) => props.$drawerWidth}px;
  }
`;

export default function Sidebar() {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation('sidebar');
  const navigate = useNavigate();

  const drawerWidth = 240;
  const toogleSidebar = () => {
    setOpen(!open);
  };

  const navigateToBalanceSheets = () => {
    navigate('/balancesheets');
  };

  return (
    <>
      <FixedAppBar>
        <StyledToolbar>
          <IconButton aria-label="toogle sidebar" onClick={toogleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            <Trans>ECG Calculator</Trans>
          </Typography>
        </StyledToolbar>
      </FixedAppBar>
      <DrawerWithFixedWidth
        variant="persistent"
        anchor="left"
        open={open}
        $drawerWidth={drawerWidth}
      >
        <Toolbar />
        <Box>
          <ListSubheader>
            <Trans t={t}>Overview</Trans>
          </ListSubheader>
          <List>
            <ListItem key={'balancesheets'} disablePadding>
              <ListItemButton onClick={navigateToBalanceSheets}>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faFolderOpen} />
                </ListItemIcon>
                <ListItemText primary={<Trans t={t}>Balance sheets</Trans>} />
              </ListItemButton>
            </ListItem>
          </List>
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
