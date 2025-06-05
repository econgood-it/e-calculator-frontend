import renderWithTheme from '../testUtils/rendering';
import { BalanceSheetOverviewPage } from './BalanceSheetOverviewPage';
import { MatrixMockBuilder } from '../testUtils/matrix';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { loader } from './BalanceSheetOverviewPage.tsx';
import { setupApiMock } from '../testUtils/api.ts';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { action } from './BalanceSheetOverviewPage.tsx';
import { CertificationAuthorityNames } from '../../../e-calculator-schemas/dist/audit.dto';
import { AuditMockBuilder } from '../testUtils/balanceSheets.ts';

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

    expect(
      screen.queryByText(`Audit process number ${audit.id}`)
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'Submit to audit' })
    ).not.toBeInTheDocument();
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
