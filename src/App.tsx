import { Suspense } from 'react';
import {
  createTheme,
  CssBaseline,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material';
import { AlertProvider } from './contexts/AlertContext';
import NotificationList from './components/alerts/NotificationList';
import { ThemeProvider } from 'styled-components';
import { RouterProvider } from 'react-router-dom';
import { useRouter } from './routing/useRouter';
import { AuthProvider } from 'oidc-react';
import { AuthProviderProps } from 'oidc-react/build/src/AuthContextInterface';

const primaryColor = '#94a231';
const secondaryColor = '#00828b';
const contrastColor = 'rgba(255,255,255,0.8)';

export const themeOptions: ThemeOptions = {
  typography: {
    // allVariants: {
    //   color: '#747474',
    // },
    h1: {
      color: primaryColor,
    },
    h2: {
      color: secondaryColor,
    },
  },
  palette: {
    text: {
      primary: '#747474',
    },
    primary: {
      main: primaryColor,
      contrastText: contrastColor,
    },
    secondary: {
      main: secondaryColor,
      contrastText: contrastColor,
    },
    error: { main: '#C2887C' },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: secondaryColor,
            color: contrastColor,
            '&:hover': {
              backgroundColor: secondaryColor,
              color: contrastColor,
            },
            '& .MuiListItemIcon-root': {
              color: `${contrastColor} !important`,
            },
          },
        },
      },
    },
  },
};
const theme = createTheme(themeOptions);

const oidcConfig: AuthProviderProps = {
  authority: 'https://econgood-kmtyuy.zitadel.cloud',
  clientId: '243348809789290637@econgood',
  responseType: 'code',
  redirectUri: 'http://localhost:3000/',
  scope: 'openid email profile',
};

function App() {
  const router = useRouter();

  return (
    <Suspense fallback={'Loading'}>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <AlertProvider>
            <>
              <CssBaseline enableColorScheme />
              <AuthProvider {...oidcConfig}>
                <RouterProvider router={router} />
              </AuthProvider>
              <NotificationList />
            </>
          </AlertProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </Suspense>
  );
}

export default App;
