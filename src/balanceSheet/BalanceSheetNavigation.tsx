import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListItemText from '@mui/material/ListItemText';
import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import ListItemButton from '@mui/material/ListItemButton';
import {
  faBuilding,
  faDolly,
  faGlobe,
  faHandHoldingUsd,
  faIdCard,
  faSeedling,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { Drawer } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

const StyledDrawer = styled(Drawer)`
  width: 400px;
  flex-shrink: 0px;
  & .MuiDrawer-paper {
    top: 53px;
    width: 400px;
    box-sizing: border-box;
  }
`;

const StyledListItemButton = styled(ListItemButton)`
  &.Mui-selected,
  &.Mui-selected:hover {
    background-color: ${(props) => props.theme.palette.secondary.main};
    color: ${(props) => props.theme.palette.secondary.contrastText};
  }
  &.Mui-selected .MuiListItemIcon-root {
    color: ${(props) => props.theme.palette.secondary.contrastText};
  }
`;

export enum NavigationItems {
  COMPANY_FACTS = 'COMPANY_FACTS',
  RATINGS = 'RATINGS',
  SUPPLIERS = 'SUPPLIERS',
  OWNERS = 'OWNERS',
  EMPLOYEES = 'EMPLOYEES',
  CUSTOMERS = 'CUSTOMERS',
  SOCIETY = 'SOCIETY',
}

type BalanceSheetNavigationProps = {
  selected: NavigationItems;
  setSelected: Dispatch<SetStateAction<NavigationItems>>;
};

const BalanceSheetNavigation = ({
  selected,
  setSelected,
}: BalanceSheetNavigationProps) => {
  const { t } = useTranslation('balance-sheet-navigation');
  return (
    <StyledDrawer variant="permanent">
      <nav aria-label="balance sheet menu">
        <List>
          <StyledListItemButton
            selected={selected === NavigationItems.COMPANY_FACTS}
            onClick={() => setSelected(NavigationItems.COMPANY_FACTS)}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={faBuilding} />
            </ListItemIcon>
            <ListItemText primary={<Trans t={t}>Company Facts</Trans>} />
          </StyledListItemButton>
          <StyledListItemButton
            selected={selected === NavigationItems.RATINGS}
            onClick={() => setSelected(NavigationItems.RATINGS)}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={faSeedling} />
            </ListItemIcon>
            <ListItemText primary={<Trans t={t}>Ratings</Trans>} />
          </StyledListItemButton>
          <List component="div" disablePadding>
            <StyledListItemButton
              selected={selected === NavigationItems.SUPPLIERS}
              onClick={() => setSelected(NavigationItems.SUPPLIERS)}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <FontAwesomeIcon icon={faDolly} />
              </ListItemIcon>
              <ListItemText secondary={<Trans t={t}>Suppliers</Trans>} />
            </StyledListItemButton>
            <StyledListItemButton
              selected={selected === NavigationItems.OWNERS}
              onClick={() => setSelected(NavigationItems.OWNERS)}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <FontAwesomeIcon icon={faHandHoldingUsd} />
              </ListItemIcon>
              <ListItemText
                secondary={
                  <Trans t={t}>
                    Owners, equity- and financial service providers
                  </Trans>
                }
              />
            </StyledListItemButton>
            <StyledListItemButton
              selected={selected === NavigationItems.EMPLOYEES}
              onClick={() => setSelected(NavigationItems.EMPLOYEES)}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <FontAwesomeIcon icon={faIdCard} />
              </ListItemIcon>
              <ListItemText secondary={<Trans t={t}>Employees</Trans>} />
            </StyledListItemButton>
            <StyledListItemButton
              selected={selected === NavigationItems.CUSTOMERS}
              onClick={() => setSelected(NavigationItems.CUSTOMERS)}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <FontAwesomeIcon icon={faUsers} />
              </ListItemIcon>
              <ListItemText
                secondary={<Trans t={t}>Customers and other companies</Trans>}
              />
            </StyledListItemButton>
            <StyledListItemButton
              selected={selected === NavigationItems.SOCIETY}
              onClick={() => setSelected(NavigationItems.SOCIETY)}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <FontAwesomeIcon icon={faGlobe} />
              </ListItemIcon>
              <ListItemText
                secondary={<Trans t={t}>Social Environment</Trans>}
              />
            </StyledListItemButton>
          </List>
        </List>
      </nav>
    </StyledDrawer>
  );
};
export default BalanceSheetNavigation;
