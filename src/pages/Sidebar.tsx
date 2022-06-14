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
import { faBars, faBuilding, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { AppBar, Box } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { BalanceSheetItem } from '../dataTransferObjects/BalanceSheet';
import { useApi } from '../contexts/ApiContext';

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
  const api = useApi();
  const [balanceSheets, setBalanceSheets] = useState<BalanceSheetItem[]>([]);

  useEffect(() => {
    const fetchBalanceSheets = async () => {
      const response = await api.get('/v1/balancesheets');
      const newData = await response.data;
      setBalanceSheets(newData);
    };
    fetchBalanceSheets();
  });

  const drawerWidth = 240;
  const toogleSidebar = () => {
    setOpen(!open);
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
          <List>
            <ListItem key={'create-balance-sheet'} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faPlus} />
                </ListItemIcon>
                <ListItemText
                  primary={<Trans t={t}>Create balance sheet</Trans>}
                />
              </ListItemButton>
            </ListItem>
          </List>
          <List>
            {balanceSheets.map((b) => (
              <ListItem key={b.id} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faBuilding} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Trans t={t}>Balance sheet {{ id: b.id }}</Trans>}
                  />
                </ListItemButton>
              </ListItem>
            ))}
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
