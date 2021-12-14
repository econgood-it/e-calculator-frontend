import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons/faBuilding';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { MouseEvent, useState } from 'react';
import styled from 'styled-components';

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
const BalanceSheetView = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(1);

  const handleListItemClick = (event: MouseEvent, index: number) => {
    setSelectedIndex(index);
  };
  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="main mailbox folders">
        <List>
          <StyledListItemButton
            selected={selectedIndex === 0}
            onClick={(event) => handleListItemClick(event, 0)}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={faBuilding} />
            </ListItemIcon>
            <ListItemText primary="Fakten zum Unternehmen" />
          </StyledListItemButton>
          <StyledListItemButton
            selected={selectedIndex === 1}
            onClick={(event) => handleListItemClick(event, 1)}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={faStar} />
            </ListItemIcon>
            <ListItemText primary="Selbsteinschätzungen" />
          </StyledListItemButton>
        </List>
      </nav>
    </Box>
  );
};

export default BalanceSheetView;
