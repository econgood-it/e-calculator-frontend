import { IconButton, Tab, TabProps } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import styled from 'styled-components';

const StyledIconButton = styled(IconButton)`
  margin-left: 8px;
`;

interface BalanceSheetTabProps extends TabProps {
  index: number;
}

const BalanceSheetTab = ({ index, ...tabProps }: BalanceSheetTabProps) => {
  return (
    <Tab
      {...tabProps}
      label={
        <span>
          {`Balance sheet ${index}`}
          <StyledIconButton size="small" color={'inherit'}>
            <FontAwesomeIcon icon={faTimes} />
          </StyledIconButton>
        </span>
      }
    />
  );
};
export default BalanceSheetTab;
