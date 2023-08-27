import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
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
import { RedirectToActiveOrganization } from './RedirectToActiveOrganization';
import { RequireActiveOrganization } from './RequireActiveOrganization';

export function useRouter() {
  const userString = window.localStorage.getItem('user');

  const [user, setUser] = useState<User | undefined>(
    userString ? JSON.parse(userString) : undefined
  );

  return createBrowserRouter([
    {
      path: '/login',
      element: <LoginPage setUser={setUser} />,
    },
    {
      element: <RequiresAuth user={user} />,
      children: [
        {
          element: <RequireActiveOrganization />,
          children: [
            { path: '/', element: <RedirectToActiveOrganization /> },
            {
              path: '/organization/:orgaId',
              element: <Sidebar />,
              children: [
                {
                  element: <BalanceSheetListPage />,
                },
                {
                  path: 'balancesheet/:balanceSheetId',
                  element: <WithActiveBalanceSheet />,
                  children: [
                    {
                      element: <BalanceSheetOverviewPage />,
                    },
                    {
                      path: 'companyfacts',
                      element: <CompanyFactsPage />,
                    },
                    {
                      path: 'ratings',
                      element: (
                        <>
                          <Outlet />
                        </>
                      ),
                      children: [
                        {
                          path: 'suppliers',
                          element: (
                            <RatingsPage
                              stakeholderToFilterBy={
                                StakholderShortNames.Suppliers
                              }
                            />
                          ),
                        },
                        {
                          path: 'finance',
                          element: (
                            <RatingsPage
                              stakeholderToFilterBy={
                                StakholderShortNames.Finance
                              }
                            />
                          ),
                        },
                        {
                          path: 'employees',
                          element: (
                            <RatingsPage
                              stakeholderToFilterBy={
                                StakholderShortNames.Employees
                              }
                            />
                          ),
                        },
                        {
                          path: 'customers',
                          element: (
                            <RatingsPage
                              stakeholderToFilterBy={
                                StakholderShortNames.Customers
                              }
                            />
                          ),
                        },
                        {
                          path: 'society',
                          element: (
                            <RatingsPage
                              stakeholderToFilterBy={
                                StakholderShortNames.Society
                              }
                            />
                          ),
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" />,
    },
  ]);
}
