import { Alert } from '@mui/material';
import { AlertMsg, useAlert } from '../../contexts/AlertContext';
import { SyntheticEvent, useEffect } from 'react';

type NotificationProps = {
  alertMsg: AlertMsg;
};

const Notification = ({ alertMsg }: NotificationProps) => {
  const { removeAlert } = useAlert();
  useEffect(() => {
    setTimeout(() => {
      removeAlert(alertMsg);
    }, 6000);
  }, []);

  const handleClose = (_?: SyntheticEvent | Event, reason?: string) => {
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
