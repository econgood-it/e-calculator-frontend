import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import RatingsPage from '../pages/RatingsPage';
import { StakholderShortNames } from '../models/Rating';

import Sidebar from '../pages/Sidebar';
import BalanceSheetListPage from '../pages/BalanceSheetListPage';
import WithActiveBalanceSheet from '../components/balanceSheet/WithActiveBalanceSheet';
import BalanceSheetOverviewPage from '../pages/BalanceSheetOverviewPage';
import CompanyFactsPage from '../pages/CompanyFactsPage';
import { RedirectToActiveOrganization } from './RedirectToActiveOrganization';
import { RequireActiveOrganization } from './RequireActiveOrganization';
import { OrganizationProvider } from '../contexts/OrganizationProvider';
import { BalanceSheetListProvider } from '../contexts/BalanceSheetListProvider';
import { RequiresAuth } from './RequiresAuth';

export function useRouter() {
  return createBrowserRouter([
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      element: <RequiresAuth />,
      children: [
        {
          element: (
            <OrganizationProvider>
              <RequireActiveOrganization />
            </OrganizationProvider>
          ),
          children: [
            { path: '/', element: <RedirectToActiveOrganization /> },
            {
              path: '/organization/:orgaId',
              element: (
                <BalanceSheetListProvider>
                  <Sidebar />
                </BalanceSheetListProvider>
              ),
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
