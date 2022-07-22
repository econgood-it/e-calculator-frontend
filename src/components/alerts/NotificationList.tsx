import { Stack } from '@mui/material';

import Notification from './Notification';
import styled from 'styled-components';
import { useAlert } from '../../contexts/AlertContext';

const FixedStack = styled(Stack)`
  z-index: 9999;
  position: fixed;
  top: 0px;
  right: 50px;
`;

const NotificationList = () => {
  const { state } = useAlert();

  return (
    <FixedStack>
      {state.alerts.map((alertMsg) => (
        <Notification key={alertMsg.id} alertMsg={alertMsg} />
      ))}
    </FixedStack>
  );
};

export default NotificationList;
