import { Alert } from '@mui/material';
import { AlertContext, AlertMsg } from './AlertContext';
import { SyntheticEvent, useContext, useEffect } from 'react';

type NotificationProps = {
  alertMsg: AlertMsg;
};

const Notification = ({ alertMsg }: NotificationProps) => {
  const { removeAlert } = useContext(AlertContext);

  useEffect(() => {
    setTimeout(() => {
      removeAlert(alertMsg);
    }, 6000);
  }, []);

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    removeAlert(alertMsg);
  };

  return (
    <Alert
      severity={alertMsg.severity}
      onClose={() => handleClose()}
      sx={{ width: '100%' }}
    >
      {alertMsg.msg}
    </Alert>
  );
};

export default Notification;
