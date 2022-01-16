import { AppBar, IconButton, Toolbar } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { Dispatch, SetStateAction } from 'react';
import BalanceSheetTab from './BalanceSheetTab';
import styled from 'styled-components';
import axios from 'axios';
import { API_URL } from '../configuration';
import { User } from '../authentication/User';
import { BalanceSheetId } from '../pages/HomePage';

interface ISquaredIconButton {
  $selected?: boolean;
}

const SquaredIconButton = styled(IconButton)<ISquaredIconButton>`
  border-radius: 0px;
  background-color: ${(props) =>
    props.$selected ? props.theme.palette.secondary.main : 'initial'};
  &.MuiIconButton-root:hover {
    background-color: ${(props) =>
      props.$selected ? props.theme.palette.secondary.main : 'initial'};
  }
`;

const SmallToolbar = styled(Toolbar)`
  min-height: 52px;
`;

type NavigationProps = {
  user: User;
  openSheets: number[];
  addOpenSheet: (sheetId: number) => void;
  deleteOpenSheet: (sheetId: number) => void;
  activeSheet: number | undefined;
  setActiveSheet: Dispatch<SetStateAction<number | undefined>>;
  addBalanceSheetId: (sheetId: BalanceSheetId) => void;
};

const NavigationBar = ({
  user,
  activeSheet,
  setActiveSheet,
  openSheets,
  addOpenSheet,
  deleteOpenSheet,
  addBalanceSheetId,
}: NavigationProps) => {
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
    addOpenSheet(id);
    setActiveSheet(id);
    addBalanceSheetId({ id: id });
  };

  const goToHome = () => {
    setActiveSheet(undefined);
  };

  return (
    <>
      <AppBar key={'navigation'} position="fixed">
        <SmallToolbar>
          <SquaredIconButton
            $selected={activeSheet === undefined}
            onClick={goToHome}
            size="large"
            edge="start"
            color="inherit"
            aria-label="home"
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
          {openSheets.map((sheet) => (
            <BalanceSheetTab
              key={sheet}
              sheetId={sheet}
              onDelete={deleteOpenSheet}
              setActiveSheet={setActiveSheet}
              activeSheet={activeSheet}
            />
          ))}
        </SmallToolbar>
      </AppBar>
    </>
  );
};

export default NavigationBar;
