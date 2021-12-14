import { Button, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';

const StyledButton = styled(Button)`
  color: ${(props) => props.theme.palette.primary.contrastText};
`;

const StyledIconButton = styled(IconButton)`
  border-radius: 0px;
  height: 100%;
  &:hover {
    background-color: initial;
  }
`;

const StyledDiv = styled.div<{ $selected: boolean }>`
  height: 52px;
  background-color: ${(props) =>
    props.$selected ? props.theme.palette.secondary.main : 'initial'};
`;

type BalanceSheetTabProps = {
  activeSheet: number | undefined;
  sheetId: number;
  setActiveSheet: Dispatch<SetStateAction<number | undefined>>;
  onDelete: (sheetId: number) => void;
};

const BalanceSheetTab = ({
  onDelete,
  activeSheet,
  setActiveSheet,
  sheetId,
}: BalanceSheetTabProps) => {
  const selected = activeSheet !== undefined && activeSheet === sheetId;

  return (
    <StyledDiv $selected={selected}>
      <StyledButton
        onClick={() => setActiveSheet(sheetId)}
      >{`Balance sheet ${sheetId}`}</StyledButton>
      <StyledIconButton
        onClick={() => onDelete(sheetId)}
        size="small"
        color={'inherit'}
      >
        <FontAwesomeIcon icon={faTimes} />
      </StyledIconButton>
    </StyledDiv>
  );
};
export default BalanceSheetTab;
