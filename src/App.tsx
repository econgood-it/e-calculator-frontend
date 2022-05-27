import { Suspense } from 'react';
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material';
import { AlertContextProvider } from './alerts/AlertContext';
import NotificationList from './alerts/NotificationList';
import { ThemeProvider } from 'styled-components';

import axios from 'axios';
import AppRoutes from './routing/AppRoutes';
import { BrowserRouter as Router } from 'react-router-dom';

axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      window.location.pathname = '/login';
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#94a231',
      contrastText: 'rgba(255,255,255,0.8)',
    },
    secondary: {
      main: '#00828b',
      contrastText: 'rgba(255,255,255,0.8)',
    },
  },
  shape: {
    borderRadius: 0,
  },
};
const theme = createTheme(themeOptions);

function App() {
  return (
    <Suspense fallback={'Loading'}>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <AlertContextProvider>
            <>
              <Router>
                <AppRoutes />
              </Router>
              <NotificationList />
            </>
          </AlertContextProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </Suspense>
  );
}

export default App;
