import { IconButton, Tab, TabProps } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import styled from 'styled-components';
import { MouseEvent } from 'react';

const StyledIconButton = styled(IconButton)`
  margin-left: 8px;
`;

interface BalanceSheetTabProps extends TabProps {
  onDelete: (value: number) => void;
}

const BalanceSheetTab = ({
  onDelete,
  value,
  ...tabProps
}: BalanceSheetTabProps) => {
  const onClose = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete(value);
  };

  return (
    <Tab
      {...tabProps}
      value={value}
      label={
        <span>
          {`Balance sheet ${value}`}
          <StyledIconButton
            onClick={(e) => onClose(e)}
            size="small"
            color={'inherit'}
          >
            <FontAwesomeIcon icon={faTimes} />
          </StyledIconButton>
        </span>
      }
    />
  );
};
export default BalanceSheetTab;
