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
import { faBars, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { AppBar, Divider, ListSubheader, useTheme } from '@mui/material';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { Outlet, useNavigate } from 'react-router-dom';

import { useApi } from '../contexts/ApiContext';
import { BalanceSheetNavigationItem } from '../components/balanceSheet/BalanceSheetNavigationItem';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListContext';
import {
  BalanceSheetType,
  BalanceSheetVersion,
} from '@ecogood/e-calculator-schemas/dist/shared.schemas';
import { useOrganizations } from '../contexts/OrganizationContext';
import { OrganizationSidebarSection } from '../components/organization/OrganizationSidebarSection';
import GridContainer from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';

const FixedAppBar = styled(AppBar)`
  z-index: ${(props) => props.theme.zIndex.drawer + 1};
  background: ${(props) => props.theme.palette.primary.main};
`;

const StyledToolbar = styled(Toolbar)`
  padding-left: 0px;
`;

const DrawerWithFixedWidth = styled(Drawer)<{ $drawerWidth: number }>`
  & .MuiDrawer-paper {
    width: ${(props) => props.$drawerWidth}px;
  }
`;

const Content = styled.div<{ $open: boolean; $drawerWidth: number }>`
  margin-right: 16px;
  margin-left: ${(props) => (props.$open ? props.$drawerWidth + 16 : 16)}px;
`;

export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(true);
  const [balanceSheetItems, setBalanceSheetItems] = useBalanceSheetItems();
  const navigate = useNavigate();
  const drawerWidth = 260;
  const api = useApi();
  const { activeOrganization } = useOrganizations();

  const toogleSidebar = () => {
    setOpen(!open);
  };

  const createBalanceSheet = async () => {
    const newBalanceSheet = await api.createBalanceSheet(
      {
        type: BalanceSheetType.Full,
        version: BalanceSheetVersion.v5_0_8,
      },
      activeOrganization?.id
    );
    const id = newBalanceSheet.id!;
    setBalanceSheetItems((prevBalanceSheets) =>
      prevBalanceSheets.concat({ id: id })
    );
    navigate(`/balancesheets/${id}`);
  };

  return (
    <>
      <FixedAppBar>
        <StyledToolbar>
          <IconButton aria-label="toogle sidebar" onClick={toogleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </IconButton>
          <Typography
            variant="h6"
            color={theme.palette.primary.contrastText}
            noWrap
            component="div"
          >
            <Trans>ECG Calculator</Trans>
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
        <GridContainer spacing={2}>
          <GridItem mt={2} xs={12}>
            <OrganizationSidebarSection />
          </GridItem>
          <GridItem xs={12}>
            <Divider variant="middle" />
          </GridItem>
          <GridItem xs={12}>
            <List
              subheader={
                <ListSubheader>
                  <Trans>Balance sheets</Trans>
                </ListSubheader>
              }
            >
              <ListItem key={'create-balance-sheet'} disablePadding>
                <ListItemButton onClick={createBalanceSheet}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faPlus} />
                  </ListItemIcon>
                  <ListItemText primary={<Trans>Create balance sheet</Trans>} />
                </ListItemButton>
              </ListItem>
            </List>
            <List component="nav">
              {balanceSheetItems.map((b) => (
                <BalanceSheetNavigationItem key={b.id} balanceSheetItem={b} />
              ))}
            </List>
          </GridItem>
        </GridContainer>
      </DrawerWithFixedWidth>
      <GridContainer mt={10} mb={10}>
        <Toolbar />
        <Content $open={open} $drawerWidth={drawerWidth}>
          <Outlet />
        </Content>
      </GridContainer>
    </>
  );
}
