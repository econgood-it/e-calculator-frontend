import { screen, waitFor } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import { BalanceSheetMockBuilder } from '../testUtils/balanceSheets';
import { useAlert } from '../contexts/AlertContext';
import { Rating, StakholderShortNames } from '../models/Rating';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { loader } from './RatingsPage.tsx';
import { setupApiMock } from '../testUtils/api.ts';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { BalanceSheetOverviewPage } from './BalanceSheetOverviewPage.tsx';
import { RatingType } from '@ecogood/e-calculator-schemas/dist/rating.dto';

vi.mock('../contexts/AlertContext');
describe('RatingsPage', () => {
  beforeEach(() => {
    (useAlert as Mock).mockReturnValue({ addErrorAlert: vi.fn() });
  });

  it('renders ratings', () => {
    const ratings: Rating[] = [
      {
        shortName: 'A1',
        name: 'Menschenwürde in der Zulieferkette',
        estimations: 0,
        isPositive: true,
        type: RatingType.topic,
        weight: 0,
        isWeightSelectedByUser: false,
        maxPoints: 0,
        points: 0,
      },
      {
        shortName: 'A1.1',
        name: 'Arbeitsbedingungen und gesellschaftliche Auswirkungen in der Zulieferkette',
        estimations: 0,
        isPositive: true,
        type: RatingType.aspect,
        weight: 0,
        isWeightSelectedByUser: false,
        maxPoints: 0,
        points: 0,
      },
    ];
    const router = createMemoryRouter(
      [
        {
          path: '/balancesheet/1/suppliers',
          element: <BalanceSheetOverviewPage />,
          loader: () => ratings,
        },
      ],
      { initialEntries: ['/balancesheet/1/suppliers'] }
    );
    renderWithTheme(<RouterProvider router={router} />);

    ratings.forEach(async (r: Rating) => {
      await waitFor(async () =>
        expect(await screen.findByText(`${r.name}`)).toBeInTheDocument()
      );
    });
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
  it.each([
    ['suppliers', StakholderShortNames.Suppliers],
    ['finance', StakholderShortNames.Finance],
    ['employees', StakholderShortNames.Employees],
    ['customers', StakholderShortNames.Customers],
    ['society', StakholderShortNames.Society],
  ])('loads ratings for stakeholder %s', async (path, stakeholderShortName) => {
    const response = {
      ...new BalanceSheetMockBuilder().build(),
      ratings: [
        { shortName: 'A1', name: 'Rating A1', type: 'topic' },
        { shortName: 'A2', name: 'Rating A2', type: 'aspect' },
        { shortName: 'B1', name: 'Rating B1', type: 'topic' },
        { shortName: 'B2', name: 'Rating B2', type: 'aspect' },
        { shortName: 'C1', name: 'Rating C1', type: 'topic' },
        { shortName: 'C2', name: 'Rating C2', type: 'aspect' },
        { shortName: 'D1', name: 'Rating D1', type: 'topic' },
        { shortName: 'D2', name: 'Rating D2', type: 'aspect' },
        { shortName: 'E1', name: 'Rating E1', type: 'topic' },
        { shortName: 'E2', name: 'Rating E2', type: 'aspect' },
      ],
    };
    mockApi.getBalanceSheet.mockResolvedValue(response);
    const result = await loader(
      {
        params: { balanceSheetId: '3' },
        request: new Request(new URL(`http://localhost/${path}`)),
      },
      { userData: { access_token: 'token' } }
    );
    const filteredRatings = response.ratings.filter((r) =>
      r.shortName.startsWith(stakeholderShortName)
    );
    expect(result).toEqual(filteredRatings);
    expect(mockApi.getBalanceSheet).toHaveBeenCalledWith(3);
  });
});
