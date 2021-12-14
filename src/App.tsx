import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { User } from './authentication/User';
import RequiresAuth from './authentication/RequiresAuth';
import { useState } from 'react';
import { AlertContextProvider } from './alerts/AlertContext';
import { LoginPage } from './pages/LoginPage';
import HomePage from './pages/HomePage';
import NotificationList from './alerts/NotificationList';

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#94a231',
      contrastText: 'rgba(255,255,255,0.8)',
    },
    secondary: {
      main: '#f50057',
    },
  },
  shape: {
    borderRadius: 0,
  },
};
const theme = createTheme(themeOptions);

function App() {
  // we get the user from the localStorage because that's where we will save their account on the login process
  const userString = window.localStorage.getItem('user');

  const [user, setUser] = useState<User | undefined>(
    userString ? JSON.parse(userString) : undefined
  );

  return (
    <ThemeProvider theme={theme}>
      <AlertContextProvider>
        <>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage setUser={setUser} />} />
              <Route
                path="/"
                element={
                  <RequiresAuth user={user}>
                    {user && <HomePage user={user} />}
                  </RequiresAuth>
                }
              />
            </Routes>
          </Router>
          <NotificationList />
        </>
      </AlertContextProvider>
    </ThemeProvider>
  );
}

export default App;
