import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { AppBar, Box, Divider, useTheme } from '@mui/material';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { OrganizationSidebarSection } from '../components/organization/OrganizationSidebarSection';
import GridContainer from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import { BalanceSheetSidebarSection } from '../components/balanceSheet/BalanceSheetSidebarSection';

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
  margin: 16px 16px 16px
    ${(props) => (props.$open ? props.$drawerWidth + 16 : 16)}px;
`;

export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(true);

  const drawerWidth = 260;

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
            <BalanceSheetSidebarSection />
          </GridItem>
        </GridContainer>
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
