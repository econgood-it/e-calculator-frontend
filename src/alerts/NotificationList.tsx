import { Stack } from '@mui/material';
import { useContext } from 'react';
import { AlertContext } from './AlertContext';
import Notification from './Notification';
import styled from 'styled-components';

const FixedStack = styled(Stack)`
  position: fixed;
  top: 0px;
  right: 50px;
`;

const NotificationList = () => {
  const { state } = useContext(AlertContext);

  return (
    <FixedStack>
      {state.alerts.map((alertMsg) => (
        <Notification key={alertMsg.id} alertMsg={alertMsg} />
      ))}
    </FixedStack>
  );
};

export default NotificationList;
