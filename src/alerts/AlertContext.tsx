import { createContext, ReactElement, useReducer } from 'react';
import { AlertColor } from '@mui/material';

export type AlertMsg = {
  msg: string;
  severity: AlertColor;
  id: number;
};

type AlertAction = {
  type: string;
  payload: AlertMsg;
};

interface IAlertContext {
  state: { alerts: AlertMsg[] };
  addAlert: (payload: { severity: AlertColor; msg: string }) => void;
  removeAlert: (payload: AlertMsg) => void;
}

const defaultState = {
  state: { alerts: [] },
  addAlert: () => null,
  removeAlert: () => null,
};

const AlertContext = createContext<IAlertContext>(defaultState);

const reducer = (
  state: { alerts: AlertMsg[] },
  alertAction: AlertAction
): { alerts: AlertMsg[] } => {
  let newAlerts, element;
  switch (alertAction.type) {
    case 'ADD_ALERT':
      newAlerts = [...state.alerts, alertAction.payload];
      return { ...state.alerts, alerts: newAlerts };
    case 'REMOVE_ALERT':
      element = state.alerts.filter((e) => e.id !== alertAction.payload.id);
      return { alerts: element };
    default:
      console.log('No valid action: ' + alertAction.type);
      return { alerts: state.alerts };
  }
};

type AlertContextProviderProps = {
  children: ReactElement;
};

function AlertContextProvider({ children }: AlertContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, { alerts: [] });

  const addAlert = (payload: { severity: AlertColor; msg: string }) => {
    dispatch({
      type: 'ADD_ALERT',
      payload: {
        ...payload,
        id: Date.now(),
      },
    });
  };
  const removeAlert = (payload: AlertMsg) => {
    dispatch({ type: 'REMOVE_ALERT', payload: payload });
  };

  return (
    <AlertContext.Provider
      value={{
        state: state,
        addAlert: addAlert,
        removeAlert: removeAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export { AlertContext, AlertContextProvider };
