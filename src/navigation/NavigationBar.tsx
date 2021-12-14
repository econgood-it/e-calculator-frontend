import { AppBar, IconButton, Tabs, Toolbar } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { Dispatch, SetStateAction, SyntheticEvent, useState } from 'react';
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
    background-color: ${(props) => props.$highlightColor};
    opacity: ${(props) => props.$highlightColor};
  }
  & .MuiTabs-indicator {
    background-color: transparent;
  }
`;

type NavigationProps = {
  user: User;
  activeSheet: number | boolean;
  setActiveSheet: Dispatch<SetStateAction<number | boolean>>;
};

const NavigationBar = ({
  user,
  activeSheet,
  setActiveSheet,
}: NavigationProps) => {
  const [sheets, setSheets] = useState<number[]>([]);

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
    setSheets((sheets) => sheets.concat(id));
    setActiveSheet(id);
  };

  const deleteSheet = (idToDelete: number) => {
    setSheets((sheets) => sheets.filter((id) => id !== idToDelete));
  };

  const goToHome = () => {
    setActiveSheet(false);
  };

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setActiveSheet(newValue);
  };

  const highlightColor = `rgba(0, 0, 0, 0.3)`;

  return (
    <>
      <AppBar key={'navigation'} position="static">
        <SmallToolbar>
          <SquaredIconButton
            $backgroundColor={
              activeSheet === false ? highlightColor : undefined
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
            $highlightColor={highlightColor}
            textColor="inherit"
            value={activeSheet}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            {sheets.map((sheet) => (
              <BalanceSheetTab value={sheet} onDelete={deleteSheet} />
            ))}
          </StyledTabs>
        </SmallToolbar>
      </AppBar>
    </>
  );
};
export default NavigationBar;
