import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
} from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { useState } from 'react';
import { User } from '../authentication/User';
import RatingsPage from '../pages/RatingsPage';
import { StakholderShortNames } from '../models/Rating';
import RequiresAuth from './RequiresAuth';
import Sidebar from '../pages/Sidebar';
import BalanceSheetListPage from '../pages/BalanceSheetListPage';
import WithActiveBalanceSheet from '../components/balanceSheet/WithActiveBalanceSheet';
import BalanceSheetOverviewPage from '../pages/BalanceSheetOverviewPage';
import CompanyFactsPage from '../pages/CompanyFactsPage';

export function useRouter() {
  const userString = window.localStorage.getItem('user');

  const [user, setUser] = useState<User | undefined>(
    userString ? JSON.parse(userString) : undefined
  );

  return createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path={'/'} element={<Navigate to="/balancesheets" />} />
        <Route path={'/login'} element={<LoginPage setUser={setUser} />} />
        <Route path={'/balancesheets'} element={<RequiresAuth user={user} />}>
          <Route element={<Sidebar />}>
            <Route index element={<BalanceSheetListPage />} />
            <Route path=":balanceSheetId" element={<WithActiveBalanceSheet />}>
              <Route index element={<BalanceSheetOverviewPage />} />
              <Route path="companyfacts" element={<CompanyFactsPage />} />
              <Route
                path="ratings"
                element={
                  <>
                    <Outlet />
                  </>
                }
              >
                <Route
                  path="suppliers"
                  element={
                    <RatingsPage
                      stakeholderToFilterBy={StakholderShortNames.Suppliers}
                    />
                  }
                />
                <Route
                  path="finance"
                  element={
                    <RatingsPage
                      stakeholderToFilterBy={StakholderShortNames.Finance}
                    />
                  }
                />
                <Route
                  path="employees"
                  element={
                    <RatingsPage
                      stakeholderToFilterBy={StakholderShortNames.Employees}
                    />
                  }
                />
                <Route
                  path="customers"
                  element={
                    <RatingsPage
                      stakeholderToFilterBy={StakholderShortNames.Customers}
                    />
                  }
                />
                <Route
                  path="society"
                  element={
                    <RatingsPage
                      stakeholderToFilterBy={StakholderShortNames.Society}
                    />
                  }
                />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    )
  );
}
