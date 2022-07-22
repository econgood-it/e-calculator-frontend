import { Suspense } from 'react';
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material';
import { AlertProvider } from './contexts/AlertContext';
import NotificationList from './components/alerts/NotificationList';
import { ThemeProvider } from 'styled-components';
import AppRoutes from './routing/AppRoutes';
import { BrowserRouter as Router } from 'react-router-dom';

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
          <AlertProvider>
            <>
              <Router>
                <AppRoutes />
              </Router>
              <NotificationList />
            </>
          </AlertProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </Suspense>
  );
}

export default App;
