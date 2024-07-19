import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useRouteError,
} from 'react-router-dom';
import RatingsPage, { loader as ratinsLoader } from '../pages/RatingsPage';

import Sidebar from '../pages/Sidebar';
import {
  action as orgaAction,
  loader as orgaLoader,
  OrganizationOverviewPage,
} from '../pages/OrganizationOverviewPage';
import {
  action as profileAction,
  loader as profileLoader,
  ProfilePage,
} from '../pages/ProfilePage';

import {
  BalanceSheetOverviewPage,
  loader as matrixLoader,
} from '../pages/BalanceSheetOverviewPage';
import WithActiveBalanceSheet from '../components/balanceSheet/WithActiveBalanceSheet';
import CompanyFactsPage from '../pages/CompanyFactsPage';
import { RedirectToActiveOrganization } from './RedirectToActiveOrganization';
import { RequireActiveOrganization } from './RequireActiveOrganization';
import { OrganizationProvider } from '../contexts/OrganizationProvider';
import { BalanceSheetListProvider } from '../contexts/BalanceSheetListProvider';
import { RequiresAuth } from './RequiresAuth';
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
              {
                path: '/',
                element: <Sidebar />,
                errorElement: <ErrorPage />,
                children: [
                  { index: true, element: <RedirectToActiveOrganization /> },
                  {
                    path: '/profile',
                    element: <ProfilePage />,
                    loader: profileLoader,
                    action: profileAction,
                  },
                  {
                    path: '/organization/:orgaId',
                    element: <OrganizationOverviewPage />,
                    loader: orgaLoader,
                    action: orgaAction,
                  },
                  {
                    path: 'balancesheet/:balanceSheetId',
                    element: <WithActiveBalanceSheet />,
                    children: [
                      {
                        path: 'overview',
                        element: <BalanceSheetOverviewPage />,
                        loader: matrixLoader,
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
                            element: <RatingsPage />,
                            loader: ratinsLoader,
                          },
                          {
                            path: 'finance',
                            element: <RatingsPage />,
                            loader: ratinsLoader,
                          },
                          {
                            path: 'employees',
                            element: <RatingsPage />,
                            loader: ratinsLoader,
                          },
                          {
                            path: 'customers',
                            element: <RatingsPage />,
                            loader: ratinsLoader,
                          },
                          {
                            path: 'society',
                            element: <RatingsPage />,
                            loader: ratinsLoader,
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
