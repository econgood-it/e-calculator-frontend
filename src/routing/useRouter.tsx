import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import RatingsPage from '../pages/RatingsPage';
import { StakholderShortNames } from '../models/Rating';

import Sidebar from '../pages/Sidebar';
import { OrganizationOverviewPage } from '../pages/OrganizationOverviewPage';
import WithActiveBalanceSheet from '../components/balanceSheet/WithActiveBalanceSheet';
import CompanyFactsPage from '../pages/CompanyFactsPage';
import { RedirectToActiveOrganization } from './RedirectToActiveOrganization';
import { RequireActiveOrganization } from './RequireActiveOrganization';
import { OrganizationProvider } from '../contexts/OrganizationProvider';
import { BalanceSheetListProvider } from '../contexts/BalanceSheetListProvider';
import { RequiresAuth } from './RequiresAuth';
import { BalanceSheetOverviewPage } from '../pages/BalanceSheetOverviewPage';

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
              <BalanceSheetListProvider>
                <RequireActiveOrganization />
              </BalanceSheetListProvider>
            </OrganizationProvider>
          ),
          children: [
            { path: '/', element: <RedirectToActiveOrganization /> },
            {
              path: '/organization/:orgaId',
              element: <Sidebar />,
              children: [
                {
                  path: '',
                  element: <OrganizationOverviewPage />,
                },
                {
                  path: 'balancesheet/:balanceSheetId',
                  element: <WithActiveBalanceSheet />,
                  children: [
                    {
                      path: '',
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
