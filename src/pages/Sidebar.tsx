import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { Box, Divider } from '@mui/material';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { OrganizationSidebarSection } from '../components/organization/OrganizationSidebarSection';
import GridContainer from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import { BalanceSheetSidebarSection } from '../components/balanceSheet/BalanceSheetSidebarSection';
import { useState } from 'react';
import { FixedToolbar } from '../components/lib/FixedToolbar';

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
  const drawerWidth = 260;
  const [open, setOpen] = useState<boolean>(true);

  const toogleSidebar = () => {
    setOpen(!open);
  };

  return (
    <>
      <FixedToolbar onToogleSidebar={toogleSidebar} />
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
