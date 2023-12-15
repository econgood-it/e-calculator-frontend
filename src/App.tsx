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
import { FRONTEND_URL } from './configuration';

const primaryColor = '#94a231';
const secondaryColor = '#00828b';
const contrastColor = 'rgba(255,255,255,0.8)';

export const themeOptions: ThemeOptions = {
  typography: {
    h1: {
      fontSize: '2rem', // Customize the font size for h1
      color: secondaryColor,
    },
    h2: {
      fontSize: '1.75rem', // Customize the font size for h2
      color: primaryColor,
    },
    h3: {
      fontSize: '1.5rem', // Customize the font size for h3
    },
    h4: {
      fontSize: '1.25rem', // Customize the font size for h4
    },
    h5: {
      fontSize: '1rem', // Customize the font size for h5
    },
    h6: {
      fontSize: '0.75rem', // Customize the font size for h6
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
  redirectUri: FRONTEND_URL,
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
