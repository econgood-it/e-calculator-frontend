import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useReducer,
} from 'react';
import { AlertColor } from '@mui/material';

export type AlertMsg = {
  msg: string;
  severity: AlertColor;
  id: number;
};

enum AlertType {
  ADD_ALERT,
  REMOVE_ALERT,
}

type AlertAction = {
  type: AlertType;
  payload: AlertMsg;
};

interface IAlertContext {
  state: { alerts: AlertMsg[] };
  addSuccessAlert: (message: string) => void;
  addErrorAlert: (message: string) => void;
  removeAlert: (payload: AlertMsg) => void;
}

const AlertContext = createContext<IAlertContext | undefined>(undefined);

const reducer = (
  state: { alerts: AlertMsg[] },
  alertAction: AlertAction
): { alerts: AlertMsg[] } => {
  let newAlerts, element;
  switch (alertAction.type) {
    case AlertType.ADD_ALERT:
      newAlerts = [...state.alerts, alertAction.payload];
      return { ...state.alerts, alerts: newAlerts };
    case AlertType.REMOVE_ALERT:
      element = state.alerts.filter((e) => e.id !== alertAction.payload.id);
      return { alerts: element };
    default:
      return { alerts: state.alerts };
  }
};

type AlertContextProviderProps = {
  children: ReactNode;
};

function AlertProvider({ children }: AlertContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, { alerts: [] });

  const addSuccessAlert = useCallback((msg: string) => {
    dispatch({
      type: AlertType.ADD_ALERT,
      payload: {
        severity: 'success',
        msg: msg,
        id: Date.now(),
      },
    });
  }, []);

  const addErrorAlert = useCallback((msg: string) => {
    dispatch({
      type: AlertType.ADD_ALERT,
      payload: {
        severity: 'error',
        msg: msg,
        id: Date.now(),
      },
    });
  }, []);
  const removeAlert = useCallback((payload: AlertMsg) => {
    dispatch({ type: AlertType.REMOVE_ALERT, payload: payload });
  }, []);

  return (
    <AlertContext.Provider
      value={{
        state: state,
        addSuccessAlert,
        addErrorAlert,
        removeAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be within AlertProvider');
  }

  return context;
};

export { AlertProvider };
