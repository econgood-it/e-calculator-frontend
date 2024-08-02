import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useRouteError,
} from 'react-router-dom';
import RatingsPage, {
  action as ratingsAction,
  loader as ratingsLoader,
} from '../pages/RatingsPage';

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
import Sidebar, { loader as sidebarLoader } from '../pages/Sidebar';

import { Alert, AlertTitle } from '@mui/material';
import { useAuth } from 'oidc-react';
import { Trans } from 'react-i18next';
import WithActiveBalanceSheet from '../components/balanceSheet/WithActiveBalanceSheet';
import { BalanceSheetListProvider } from '../contexts/BalanceSheetListProvider';
import { OrganizationProvider } from '../contexts/OrganizationProvider';
import {
  BalanceSheetOverviewPage,
  loader as matrixLoader,
} from '../pages/BalanceSheetOverviewPage';
import { BalanceSheetSettingsPage } from '../pages/BalanceSheetSettingsPage';
import CompanyFactsPage from '../pages/CompanyFactsPage';
import { RedirectToActiveOrganization } from './RedirectToActiveOrganization';
import { RequireActiveOrganization } from './RequireActiveOrganization';
import { RequiresAuth } from './RequiresAuth';

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
                errorElement: <ErrorPage />,
                loader: sidebarLoader,
                children: [
                  {
                    path: 'overview',
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
                            loader: ratingsLoader,
                            action: ratingsAction,
                          },
                          {
                            path: 'finance',
                            element: <RatingsPage />,
                            loader: ratingsLoader,
                            action: ratingsAction,
                          },
                          {
                            path: 'employees',
                            element: <RatingsPage />,
                            loader: ratingsLoader,
                            action: ratingsAction,
                          },
                          {
                            path: 'customers',
                            element: <RatingsPage />,
                            loader: ratingsLoader,
                            action: ratingsAction,
                          },
                          {
                            path: 'society',
                            element: <RatingsPage />,
                            loader: ratingsLoader,
                            action: ratingsAction,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    path: 'profile',
                    element: <ProfilePage />,
                    loader: profileLoader,
                    action: profileAction,
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
