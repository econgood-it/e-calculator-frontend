import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons/faBuilding';
import ListItemText from '@mui/material/ListItemText';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import ListItemButton from '@mui/material/ListItemButton';

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
}

type BalanceSheetNavigationProps = {
  selected: NavigationItems;
  setSelected: Dispatch<SetStateAction<NavigationItems>>;
};

const BalanceSheetNavigation = ({
  selected,
  setSelected,
}: BalanceSheetNavigationProps) => {
  return (
    <nav aria-label="balance sheet menu">
      <List>
        <StyledListItemButton
          selected={selected === NavigationItems.COMPANY_FACTS}
          onClick={() => setSelected(NavigationItems.COMPANY_FACTS)}
        >
          <ListItemIcon>
            <FontAwesomeIcon icon={faBuilding} />
          </ListItemIcon>
          <ListItemText primary="Fakten zum Unternehmen" />
        </StyledListItemButton>
        <StyledListItemButton
          selected={selected === NavigationItems.RATINGS}
          onClick={() => setSelected(NavigationItems.RATINGS)}
        >
          <ListItemIcon>
            <FontAwesomeIcon icon={faStar} />
          </ListItemIcon>
          <ListItemText primary="Selbsteinschätzungen" />
        </StyledListItemButton>
      </List>
    </nav>
  );
};
export default BalanceSheetNavigation;
