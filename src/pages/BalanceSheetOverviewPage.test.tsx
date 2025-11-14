import renderWithTheme from '../testUtils/rendering';
import { BalanceSheetOverviewPage } from './BalanceSheetOverviewPage';
import { MatrixMockBuilder } from '../testUtils/matrix';
import { screen, waitFor, within } from '@testing-library/react';
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
import { auditFactory } from '../testUtils/audit.ts';

describe('BalanceSheetOverviewPage', () => {
  it('renders overview page', async () => {
    const mockedMatrix = new MatrixMockBuilder().build();
    const audit = new AuditMockBuilder().build();
    const router = createMemoryRouter(
      [
        {
          path: '/balancesheet/1/overview',
          element: <BalanceSheetOverviewPage />,
          loader: () => ({
            matrix: mockedMatrix,
            audit,
            isMemberOfCertificationAuthority: false,
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

  it.skip('should submit balance sheet to audit', async () => {
    const mockedMatrix = new MatrixMockBuilder().build();
    const action = vi.fn().mockResolvedValue(null);
    const router = createMemoryRouter(
      [
        {
          path: '/balancesheet/1/overview',
          element: <BalanceSheetOverviewPage />,
          loader: () => ({
            matrix: mockedMatrix,
            isMemberOfCertificationAuthority: false,
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

  it.skip('should submit balance sheet to peer group', async () => {
    const mockedMatrix = new MatrixMockBuilder().build();
    const action = vi.fn().mockResolvedValue(null);
    const router = createMemoryRouter(
      [
        {
          path: '/balancesheet/1/overview',
          element: <BalanceSheetOverviewPage />,
          loader: () => ({
            matrix: mockedMatrix,
            isMemberOfCertificationAuthority: false,
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

  it('should reset audit', async () => {
    const mockedMatrix = new MatrixMockBuilder().build();
    const action = vi.fn().mockResolvedValue(null);
    const mockAudit = auditFactory.build();
    const router = createMemoryRouter(
      [
        {
          path: '/balancesheet/1/overview',
          element: <BalanceSheetOverviewPage />,
          loader: () => ({
            matrix: mockedMatrix,
            isMemberOfCertificationAuthority: true,
            audit: mockAudit,
          }),
          action: async ({ request }: ActionFunctionArgs) =>
            action(await request.json()),
        },
      ],
      { initialEntries: ['/balancesheet/1/overview'] }
    );
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    const resetAuditButton = await screen.findByRole('button', {
      name: 'Reset audit process',
    });
    await user.click(resetAuditButton);

    const dialog = await screen.findByRole('dialog', {
      name: 'Reset audit process',
    });
    await user.click(within(dialog).getByRole('button', { name: 'Ok' }));

    await waitFor(() =>
      expect(action).toHaveBeenCalledWith({
        intent: 'deleteAudit',
        auditId: mockAudit.id,
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

const mocks = vi.hoisted(() => ({
  mockEnqueueSnackbar: vi.fn(),
}));

vi.mock('notistack', async () => {
  const originalModule = await vi.importActual('notistack');
  return {
    ...originalModule,
    enqueueSnackbar: mocks.mockEnqueueSnackbar,
  };
});

describe('loader', () => {
  it.skip('loads balance sheet', async () => {
    const matrix = new MatrixMockBuilder().build();
    mockApi.getBalanceSheetAsMatrix.mockResolvedValue(matrix);
    const audit = new AuditMockBuilder().build();
    mockApi.findAuditByBalanceSheet.mockResolvedValue(audit);
    const result = await loader(
      {
        params: { balanceSheetId: '3' },
        request: new Request(new URL('http://localhost')),
      },
      {
        userData: { access_token: 'token' },
        isMemberOfCertificationAuthority: false,
      }
    );
    expect(result).toEqual({
      matrix,
      audit,
      isMemberOfCertificationAuthority: false,
    });
    expect(mockApi.getBalanceSheetAsMatrix).toHaveBeenCalledWith(3);
    expect(mockApi.findAuditByBalanceSheet).toHaveBeenCalledWith(
      3,
      'submittedBalanceSheetId'
    );
  });
});

describe('actions', () => {
  it.skip('submits balance sheet', async () => {
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

  it('delete audit', async () => {
    mockApi.deleteAudit.mockResolvedValue({ status: 200 });
    const auditId = 4;
    const request = new Request(new URL('http://localhost'), {
      method: 'delete',
      body: JSON.stringify({
        intent: 'deleteAudit',
        auditId,
      }),
    });

    const result: Response = (await action(
      { params: { orgaId: '1', balanceSheetId: '4' }, request },
      {
        userData: {
          access_token: 'token',
        },
        isMemberOfCertificationAuthority: true,
        lng: 'de',
      }
    )) as Response;

    expect(mockApi.deleteAudit).toHaveBeenCalledWith(auditId);
    expect(result!.status).toEqual(302);
    expect(result!.headers.get('Location')).toEqual(`/`);
    expect(mocks.mockEnqueueSnackbar).toHaveBeenCalledWith(
      `Audit mit ID 4 erfolgreich zurückgesetzt.`,
      { variant: 'success' }
    );
  });
});
