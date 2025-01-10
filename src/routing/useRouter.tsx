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
import Sidebar, {
  action as sidebarAction,
  loader as sidebarLoader,
} from '../pages/Sidebar';

import { Alert, AlertTitle } from '@mui/material';
import { useAuth } from 'oidc-react';
import { Trans } from 'react-i18next';
import {
  BalanceSheetOverviewPage,
  loader as matrixLoader,
} from '../pages/BalanceSheetOverviewPage';
import { loader as loaderForRedirect } from './RedirectToActiveOrganization.tsx';
import {
  action as deleteBalanceSheetAction,
  BalanceSheetSettingsPage,
} from '../pages/BalanceSheetSettingsPage';
import CompanyFactsPage, {
  action as companyFactsAction,
  loader as loaderCompanyFacts,
} from '../pages/CompanyFactsPage';
import { RequiresAuth } from './RequiresAuth';
import {
  action as orgaCreationAction,
  OrganizationCreationPage,
} from '../pages/OrganizationCreationPage.tsx';
import { useLanguage } from '../i18n.ts';

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
  const { lng } = useLanguage();

  return createBrowserRouter(
    [
      {
        element: <RequiresAuth />,
        children: [
          { path: '/', loader: loaderForRedirect },
          {
            path: '/organization',
            element: <OrganizationCreationPage />,
            action: orgaCreationAction,
          },
          {
            path: '/organization/:orgaId',
            element: <Sidebar />,
            errorElement: <ErrorPage />,
            loader: sidebarLoader,
            action: sidebarAction,
            children: [
              {
                path: 'overview',
                element: <OrganizationOverviewPage />,
                loader: orgaLoader,
                action: orgaAction,
              },
              {
                path: 'balancesheet/:balanceSheetId',
                children: [
                  {
                    path: 'overview',
                    element: <BalanceSheetOverviewPage />,
                    loader: matrixLoader,
                  },
                  {
                    path: 'settings',
                    element: <BalanceSheetSettingsPage />,
                    action: deleteBalanceSheetAction,
                  },
                  {
                    path: 'companyfacts',
                    element: <CompanyFactsPage />,
                    loader: loaderCompanyFacts,
                    action: companyFactsAction,
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
              const result = await handler({ userData, lng });
              return { type: 'data', result };
            })
          )
        );
      },
    }
  );
}
