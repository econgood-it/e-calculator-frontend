import { AppBar, IconButton, Tabs, Toolbar } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { SyntheticEvent, useState } from 'react';
import BalanceSheetTab from '../pages/BalanceSheetTab';
import styled from 'styled-components';
import axios from 'axios';
import { API_URL } from '../configuration';
import { User } from '../authentication/User';

interface ISquaredIconButton {
  $backgroundColor?: string;
}

const SquaredIconButton = styled(IconButton)<ISquaredIconButton>`
  border-radius: 0px;
  background-color: ${(props) => props.$backgroundColor || 'initial'};
  &.MuiIconButton-root:hover {
    background-color: ${(props) => props.$backgroundColor || 'initial'};
  }
`;

const SmallToolbar = styled(Toolbar)`
  min-height: 52px;
`;

interface IStyledTabs {
  $highlightColor?: string;
}

const StyledTabs = styled(Tabs)<IStyledTabs>`
  & .Mui-selected {
    background-color: ${(props) => props.$highlightColor || 'inherit'};
    opacity: ${(props) => props.$highlightColor || 0.6};
  }
  & .MuiTabs-indicator {
    background-color: transparent;
  }
`;

enum ToolbarItems {
  HOME = 'HOME',
  BALANCE_SHEET_TABS = 'BALANCE_SHEET_TABS',
}

type NavigationProps = {
  user: User;
};

const NavigationBar = ({ user }: NavigationProps) => {
  const [value, setValue] = useState<number>(0);
  const [sheets, setSheets] = useState<number[]>([]);
  const [highlightedItem, setHighlightedItem] = useState<ToolbarItems>(
    ToolbarItems.HOME
  );

  const addSheet = async () => {
    const result = await axios.post(
      `${API_URL}/v1/balancesheets`,
      {
        type: 'Full',
        version: '5.06',
      },
      {
        params: { lng: 'en', save: true },
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    const { id } = result.data;
    const sheetsLength = sheets.length;
    setSheets((sheets) => sheets.concat(id));
    setValue(sheetsLength);
    setHighlightedItem(ToolbarItems.BALANCE_SHEET_TABS);
  };

  const goToHome = () => {
    setHighlightedItem(ToolbarItems.HOME);
  };

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setHighlightedItem(ToolbarItems.BALANCE_SHEET_TABS);
  };

  const highlightColor = `rgba(0, 0, 0, 0.3)`;

  return (
    <>
      <AppBar key={'navigation'} position="static">
        <SmallToolbar>
          <SquaredIconButton
            $backgroundColor={
              highlightedItem === ToolbarItems.HOME ? highlightColor : undefined
            }
            onClick={goToHome}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <FontAwesomeIcon icon={faHome} />
          </SquaredIconButton>
          <SquaredIconButton
            onClick={addSheet}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </SquaredIconButton>
          <StyledTabs
            $highlightColor={
              highlightedItem === ToolbarItems.BALANCE_SHEET_TABS
                ? highlightColor
                : undefined
            }
            textColor="inherit"
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            {sheets.map((sheet) => (
              <BalanceSheetTab index={sheet} />
            ))}
          </StyledTabs>
        </SmallToolbar>
      </AppBar>
    </>
  );
};
export default NavigationBar;
