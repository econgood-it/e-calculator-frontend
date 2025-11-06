import { Suspense } from 'react';
import {
  createTheme,
  CssBaseline,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material';
import styled, { ThemeProvider } from 'styled-components';
import { RouterProvider } from 'react-router-dom';
import { useRouter } from './routing/useRouter';
import { AuthProvider, AuthProviderProps } from 'oidc-react';
import { MaterialDesignContent, SnackbarProvider } from 'notistack';

import { AUTHORITY, CLIENT_ID, FRONTEND_URL } from './configuration';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useLanguage } from './i18n.ts';
import 'dayjs/locale/de';

const primaryColor = '#94a231';
const secondaryColor = '#00828b';
const contrastColor = 'rgba(255,255,255,0.8)';
const errorColor = '#C2887C';

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
    error: { main: errorColor },
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

const storeLastPath = () => {
  const currentPath = window.location.pathname;
  sessionStorage.setItem('lastPath', currentPath);
};

// TODO: Make oidcConfig configurable via environment variables
const oidcConfig: AuthProviderProps = {
  authority: AUTHORITY,
  clientId: CLIENT_ID,
  responseType: 'code',
  redirectUri: FRONTEND_URL,
  scope: 'openid email profile',
  onBeforeSignIn: () => {
    storeLastPath();
  },
  onSignIn: () => {
    const lastPath = sessionStorage.getItem('lastPath') || '/';
    sessionStorage.removeItem('lastPath'); // Clean up
    window.location.href = lastPath;
  },
};

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  '&.notistack-MuiContent-success': {
    backgroundColor: primaryColor,
  },
  '&.notistack-MuiContent-error': {
    backgroundColor: errorColor,
  },
}));

function App() {
  return (
    <Suspense fallback={'Loading'}>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          <AuthProvider {...oidcConfig}>
            <Routes />
          </AuthProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </Suspense>
  );
}

function Routes() {
  const router = useRouter();
  const { lng } = useLanguage();
  return (
    <div>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'top', // Position vertically: "top" or "bottom"
          horizontal: 'right', // Position horizontally: "left", "center", or "right"
        }}
        Components={{
          success: StyledMaterialDesignContent,
          error: StyledMaterialDesignContent,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={lng}>
          <RouterProvider router={router} />
        </LocalizationProvider>
      </SnackbarProvider>
    </div>
  );
}

export default App;
