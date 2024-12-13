import renderWithTheme from '../testUtils/rendering';
import { BalanceSheetOverviewPage } from './BalanceSheetOverviewPage';
import { MatrixMockBuilder } from '../testUtils/matrix';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { loader } from './BalanceSheetOverviewPage.tsx';
import { setupApiMock } from '../testUtils/api.ts';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

describe('BalanceSheetOverviewPage', () => {
  it('renders overview page', async () => {
    const mockedMatrix = new MatrixMockBuilder().build();
    const router = createMemoryRouter(
      [
        {
          path: '/balancesheet/1/overview',
          element: <BalanceSheetOverviewPage />,
          loader: () => mockedMatrix,
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
    const response = new MatrixMockBuilder().build();
    mockApi.getBalanceSheetAsMatrix.mockResolvedValue(response);
    const result = await loader(
      {
        params: { balanceSheetId: '3' },
        request: new Request(new URL('http://localhost')),
      },
      { userData: { access_token: 'token' } }
    );
    expect(result).toEqual(response);
    expect(mockApi.getBalanceSheetAsMatrix).toHaveBeenCalledWith(3);
  });
});
