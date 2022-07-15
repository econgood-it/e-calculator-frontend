import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import RequiresAuth from './RequiresAuth';
import { useState } from 'react';
import { User } from '../authentication/User';
import BalanceSheetListPage from '../pages/BalanceSheetListPage';
import Sidebar from '../pages/Sidebar';
import BalanceSheetOverviewPage from '../pages/BalanceSheetOverviewPage';
import RatingsPage from '../pages/RatingsPage';
import WithActiveBalanceSheet from '../components/balanceSheet/WithActiveBalanceSheet';

const AppRoutes = () => {
  // we get the user from the localStorage because that's where we will save their account on the login process
  const userString = window.localStorage.getItem('user');

  const [user, setUser] = useState<User | undefined>(
    userString ? JSON.parse(userString) : undefined
  );

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/" element={<Navigate to="balancesheets" />} />
        <Route path="/balancesheets" element={<RequiresAuth user={user} />}>
          <Route element={<Sidebar />}>
            <Route index element={<BalanceSheetListPage />} />
            <Route path=":balanceSheetId" element={<WithActiveBalanceSheet />}>
              <Route index element={<BalanceSheetOverviewPage />} />
              <Route path="companyfacts" element={<div>Company Facts</div>} />
              <Route path="ratings" element={<RatingsPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
