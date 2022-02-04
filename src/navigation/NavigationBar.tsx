import {
  AppBar,
  Box,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { Dispatch, SetStateAction, useState } from 'react';
import BalanceSheetTab from './BalanceSheetTab';
import styled from 'styled-components';
import axios from 'axios';
import { API_URL } from '../configuration';
import { User } from '../authentication/User';
import { BalanceSheetId } from '../pages/HomePage';
import { useTranslation } from 'react-i18next';

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

const LanguageSelector = styled(Select)`
  color: ${(props) => props.theme.palette.primary.contrastText};
  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }
  & .MuiSelect-iconOutlined {
    color: ${(props) => props.theme.palette.primary.contrastText};
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
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language.split('-')[0]);
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
          <Box sx={{ flexGrow: 1 }} />
          <LanguageSelector
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value as string);
              i18n.changeLanguage(e.target.value as string);
            }}
          >
            <MenuItem value="de">de</MenuItem>
            <MenuItem value="en">en</MenuItem>
          </LanguageSelector>
        </SmallToolbar>
      </AppBar>
    </>
  );
};

export default NavigationBar;
