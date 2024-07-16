import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useRouteError,
} from 'react-router-dom';
import RatingsPage from '../pages/RatingsPage';
import { StakholderShortNames } from '../models/Rating';

import Sidebar from '../pages/Sidebar';
import {
  action as orgaAction,
  loader as orgaLoader,
  OrganizationOverviewPage,
} from '../pages/OrganizationOverviewPage';
import WithActiveBalanceSheet from '../components/balanceSheet/WithActiveBalanceSheet';
import CompanyFactsPage from '../pages/CompanyFactsPage';
import { RedirectToActiveOrganization } from './RedirectToActiveOrganization';
import { RequireActiveOrganization } from './RequireActiveOrganization';
import { OrganizationProvider } from '../contexts/OrganizationProvider';
import { BalanceSheetListProvider } from '../contexts/BalanceSheetListProvider';
import { RequiresAuth } from './RequiresAuth';
import { BalanceSheetOverviewPage } from '../pages/BalanceSheetOverviewPage';
import { BalanceSheetSettingsPage } from '../pages/BalanceSheetSettingsPage';
import { useAuth } from 'oidc-react';
import { Alert, AlertTitle } from '@mui/material';
import { Trans } from 'react-i18next';

function ErrorPage() {
  const error = useRouteError();
  const message = error instanceof Error && error.message;

  return (
    <Alert severity={'error'} sx={{ width: '100%' }}>
      <AlertTitle>
        <Trans>Following error occured</Trans>
      </AlertTitle>
      {message}
    </Alert>
  );
}

export function useRouter() {
  const { userData } = useAuth();

  return createBrowserRouter(
    [
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
                    index: true,
                    element: <OrganizationOverviewPage />,
                    loader: orgaLoader,
                    action: orgaAction,
                    errorElement: <ErrorPage />,
                  },
                  {
                    path: 'balancesheet/:balanceSheetId',
                    element: <WithActiveBalanceSheet />,
                    children: [
                      {
                        path: 'overview',
                        element: <BalanceSheetOverviewPage />,
                      },
                      {
                        path: 'settings',
                        element: <BalanceSheetSettingsPage />,
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
    ],
    {
      unstable_dataStrategy: function ({ matches }) {
        return Promise.all(
          matches.map((match) =>
            match.resolve(async (handler) => {
              const result = await handler({ userData });
              return { type: 'data', result };
            })
          )
        );
      },
    }
  );
}
