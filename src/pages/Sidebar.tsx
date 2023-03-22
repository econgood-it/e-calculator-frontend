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
import { AppBar, Box, useTheme } from '@mui/material';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { Outlet, useNavigate } from 'react-router-dom';

import { useApi } from '../contexts/ApiContext';
import { BalanceSheetNavigationItem } from '../components/balanceSheet/BalanceSheetNavigationItem';
import { AxiosResponse } from 'axios';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListContext';
import {
  BalanceSheetType,
  BalanceSheetVersion,
} from 'e-calculator-schemas/dist/shared.schemas';
import {
  BalanceSheetCreateRequestBodySchema,
  BalanceSheetResponseBodySchema,
} from 'e-calculator-schemas/dist/balance.sheet.dto';
import { z } from 'zod';
import { BalanceSheet } from '../models/BalanceSheet';

const FixedAppBar = styled(AppBar)`
  z-index: ${(props) => props.theme.zIndex.drawer + 1};
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
  margin-top: 16px;
  margin-left: ${(props) => (props.$open ? props.$drawerWidth + 16 : 16)}px;
`;

export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(true);
  const [balanceSheetItems, setBalanceSheetItems] = useBalanceSheetItems();
  const navigate = useNavigate();
  const drawerWidth = 240;
  const api = useApi();

  const toogleSidebar = () => {
    setOpen(!open);
  };

  const createBalanceSheet = async () => {
    const response = await api.post<
      BalanceSheet,
      AxiosResponse<BalanceSheet>,
      z.input<typeof BalanceSheetCreateRequestBodySchema>
    >('/v1/balancesheets', {
      type: BalanceSheetType.Full,
      version: BalanceSheetVersion.v5_0_8,
    });
    const newBalanceSheet = BalanceSheetResponseBodySchema.parse(
      await response.data
    );
    const id = newBalanceSheet.id!;
    setBalanceSheetItems((prevBalanceSheets) =>
      prevBalanceSheets.concat({ id: id })
    );
    navigate(`${id}`);
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
        <Box>
          <List>
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
