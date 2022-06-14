import { Route, Routes } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import RequiresAuth from './RequiresAuth';
import { useState } from 'react';
import { User } from '../authentication/User';
import BalanceSheetOverviewPage from '../pages/BalanceSheetOverviewPage';
import Sidebar from '../pages/Sidebar';
import WithActiveBalanceSheet from '../components/balanceSheet/WithActiveBalanceSheet';

const AppRoutes = () => {
  // we get the user from the localStorage because that's where we will save their account on the login process
  const userString = window.localStorage.getItem('user');

  const [user, setUser] = useState<User | undefined>(
    userString ? JSON.parse(userString) : undefined
  );

  return (
    <Routes>
      <Route path="/login" element={<LoginPage setUser={setUser} />} />
      <Route path="/" element={<RequiresAuth user={user} />}>
        <Route element={<Sidebar />}>
          <Route index element={<BalanceSheetOverviewPage />} />
          <Route path=":balanceSheetId" element={<WithActiveBalanceSheet />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
