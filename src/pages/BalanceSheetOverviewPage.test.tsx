import renderWithTheme from '../testUtils/rendering';
import { BalanceSheetOverviewPage } from './BalanceSheetOverviewPage';
import { MatrixMockBuilder } from '../testUtils/matrix';
import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { action, loader } from './BalanceSheetOverviewPage.tsx';
import { setupApiMock } from '../testUtils/api.ts';
import {
  ActionFunctionArgs,
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom';
import { CertificationAuthorityNames } from '../../../e-calculator-schemas/src/audit.dto.ts';
import { AuditMockBuilder } from '../testUtils/balanceSheets.ts';
import { AuthProvider, AuthProviderProps } from 'oidc-react';
import { AUTHORITY, CLIENT_ID, FRONTEND_URL } from '../configuration';

const storeLastPath = () => {
  const currentPath = window.location.pathname;
  sessionStorage.setItem('lastPath', currentPath);
};

const oidcConfig: AuthProviderProps = {
  authority: AUTHORITY,
  clientId: CLIENT_ID,
  responseType: 'code',
  redirectUri: FRONTEND_URL,
  scope: 'openid email profile',
  onBeforeSignIn: () => {
    storeLastPath();
  },
  onSignIn: () => {
    const lastPath = sessionStorage.getItem('lastPath') || '/';
    sessionStorage.removeItem('lastPath'); // Clean up
    window.location.href = lastPath;
  },
};

describe('BalanceSheetOverviewPage', () => {
  it('renders overview page', async () => {
    const mockedMatrix = new MatrixMockBuilder().build();
    const audit = new AuditMockBuilder().build();
    const router = createMemoryRouter(
      [
        {
          path: '/balancesheet/1/overview',
          element: <AuthProvider {...oidcConfig}><BalanceSheetOverviewPage /></AuthProvider>,
          loader: () => ({
            matrix: mockedMatrix,
            audit,
          }),
        },
      ],
      { initialEntries: ['/balancesheet/1/overview'] }
    );
    renderWithTheme(<RouterProvider router={router} />);
    for (const rating of mockedMatrix.ratings) {
      expect(await screen.findByText(rating.shortName)).toBeInTheDocument();
    }
    // Check that total points are shown on the page
    expect(
      screen.getByText(`${mockedMatrix.totalPoints.toFixed(0)} / 1000`)
    ).toBeInTheDocument();

    expect(screen.getByLabelText(`Audit process number`)).toHaveTextContent(
      audit.id.toString()
    );

    expect(
      screen.queryByRole('button', { name: 'Submit to audit' })
    ).not.toBeInTheDocument();
  });

  it('should submit balance sheet to audit', async () => {
    const mockedMatrix = new MatrixMockBuilder().build();
    const action = vi.fn().mockResolvedValue(null);
    const router = createMemoryRouter(
      [
        {
          path: '/balancesheet/1/overview',
          element: <AuthProvider {...oidcConfig}><BalanceSheetOverviewPage /></AuthProvider >,
          loader: () => ({
            matrix: mockedMatrix,
          }),
          action: async ({ request }: ActionFunctionArgs) =>
            action(await request.json()),
        },
      ],
      { initialEntries: ['/balancesheet/1/overview'] }
    );
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    const submitButton = await screen.findByRole('button', {
      name: 'Submit to audit',
    });
    await user.click(submitButton);

    await waitFor(() =>
      expect(action).toHaveBeenCalledWith({
        authority: 'AUDIT',
        intent: 'submitBalanceSheet',
      })
    );
  });

  it('should submit balance sheet to peer group', async () => {
    const mockedMatrix = new MatrixMockBuilder().build();
    const action = vi.fn().mockResolvedValue(null);
    const router = createMemoryRouter(
      [
        {
          path: '/balancesheet/1/overview',
          element: <AuthProvider {...oidcConfig}><BalanceSheetOverviewPage /></AuthProvider>,
          loader: () => ({
            matrix: mockedMatrix,
          }),
          action: async ({ request }: ActionFunctionArgs) =>
            action(await request.json()),
        },
      ],
      { initialEntries: ['/balancesheet/1/overview'] }
    );
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    const selectAuthorityButton = await screen.findByLabelText(
      'select between audit and peer group'
    );
    await user.click(selectAuthorityButton);

    const peerGroupSelection = await screen.findByRole('menuitem', {
      name: 'Submit to peer-group',
    });
    await user.click(peerGroupSelection);
    const submitButton = await screen.getByRole('button', {
      name: 'Submit to peer-group',
    });
    await user.click(submitButton);

    await waitFor(() =>
      expect(action).toHaveBeenCalledWith({
        authority: 'PEER_GROUP',
        intent: 'submitBalanceSheet',
      })
    );
  });
});

const mockApi = setupApiMock();

vi.mock('../api/api.client.ts', async () => {
  const originalModule = await vi.importActual('../api/api.client.ts');
  return {
    ...originalModule,
    createApiClient: () => mockApi,
  };
});

describe('loader', () => {
  it('loads balance sheet', async () => {
    const matrix = new MatrixMockBuilder().build();
    mockApi.getBalanceSheetAsMatrix.mockResolvedValue(matrix);
    const audit = new AuditMockBuilder().build();
    mockApi.findAuditByBalanceSheet.mockResolvedValue(audit);
    const result = await loader(
      {
        params: { balanceSheetId: '3' },
        request: new Request(new URL('http://localhost')),
      },
      { userData: { access_token: 'token' } }
    );
    expect(result).toEqual({ matrix, audit });
    expect(mockApi.getBalanceSheetAsMatrix).toHaveBeenCalledWith(3);
    expect(mockApi.findAuditByBalanceSheet).toHaveBeenCalledWith(3);
  });
});

describe('actions', () => {
  it('submits balance sheet', async () => {
    mockApi.submitBalanceSheetToAudit.mockResolvedValue({ status: 201 });

    const request = new Request(new URL('http://localhost'), {
      method: 'post',
      body: JSON.stringify({
        intent: 'submitBalanceSheet',
        authority: CertificationAuthorityNames.AUDIT,
      }),
    });

    await action(
      { params: { orgaId: '1', balanceSheetId: '4' }, request },
      { userData: { access_token: 'token' } }
    );

    expect(mockApi.submitBalanceSheetToAudit).toHaveBeenCalledWith(
      4,
      CertificationAuthorityNames.AUDIT
    );
  });
});
