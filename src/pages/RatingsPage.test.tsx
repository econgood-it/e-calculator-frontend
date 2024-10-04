import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import { BalanceSheetMockBuilder } from '../testUtils/balanceSheets';
import { Rating, StakholderShortNames } from '../models/Rating';
import { describe, expect, it, vi } from 'vitest';

import RatingsPage, { action, loader } from './RatingsPage.tsx';
import { setupApiMock } from '../testUtils/api.ts';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { RatingType } from '@ecogood/e-calculator-schemas/dist/rating.dto';
import { saveForm } from '../testUtils/form.tsx';
import { FinanceConfigurator } from '../components/balanceSheet/FinanceConfigurators.tsx';
import { BalanceSheetVersion } from '@ecogood/e-calculator-schemas/dist/shared.schemas';

describe('RatingsPage', () => {
  it('renders ratings and updates these', async () => {
    const action = vi.fn().mockResolvedValue(null);
    const ratings: Rating[] = [
      {
        shortName: 'A1',
        name: 'Menschenwürde in der Zulieferkette',
        estimations: 0,
        isPositive: true,
        type: RatingType.topic,
        weight: 1,
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
        weight: 1,
        isWeightSelectedByUser: false,
        maxPoints: 0,
        points: 0,
      },
    ];
    const router = createMemoryRouter(
      [
        {
          path: '/balancesheet/1/suppliers',
          element: <RatingsPage />,
          loader: () => ({
            ratings,
            balanceSheetVersion: BalanceSheetVersion.v5_1_0,
          }),
          action: async ({ request }) => action(await request.json()),
        },
      ],
      { initialEntries: ['/balancesheet/1/suppliers'] }
    );
    const { user } = renderWithTheme(<RouterProvider router={router} />);

    await waitFor(async () =>
      expect(
        await screen.findByText('Menschenwürde in der Zulieferkette')
      ).toBeInTheDocument()
    );
    expect(
      screen.getByText(
        'A1.1 Arbeitsbedingungen und gesellschaftliche Auswirkungen in der Zulieferkette'
      )
    ).toBeInTheDocument();

    const positiveRating = screen.getByLabelText(`ratings.${1}.estimations`);
    fireEvent.click(within(positiveRating).getByLabelText('4 Stars'));

    await saveForm(user);
    expect(action).toHaveBeenCalledWith({
      ratings: [ratings[0], { ...ratings[1], estimations: 4 }],
    });
  });

  it('enables to configure rating appearance', async () => {
    const action = vi.fn().mockResolvedValue(null);
    const ratings: Rating[] = [
      {
        shortName: 'B1.1',
        name: 'Rating B1',
        type: RatingType.aspect,
        isPositive: true,
        estimations: 7,
        weight: 0,
        isWeightSelectedByUser: false,
        maxPoints: 0,
        points: 0,
      },
      {
        shortName: 'B1.2',
        name: 'Rating B2',
        estimations: 0,
        isPositive: true,
        type: RatingType.aspect,
        weight: 1,
        isWeightSelectedByUser: false,
        maxPoints: 0,
        points: 0,
      },
    ];
    const router = createMemoryRouter(
      [
        {
          path: '/balancesheet/1/finance',
          element: <RatingsPage Configurator={FinanceConfigurator} />,
          loader: () => ({
            ratings,
            balanceSheetVersion: BalanceSheetVersion.v5_1_0,
          }),
          action: async ({ request }) => action(await request.json()),
        },
      ],
      { initialEntries: ['/balancesheet/1/finance'] }
    );
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.click(
      await screen.findByText('Selection of topics and aspects')
    );
    await user.click(await screen.findByRole('radio', { name: 'B1.1' }));
    await user.click(screen.getAllByText('Save')[0]);
    expect(action).toHaveBeenCalledWith({
      ratings: [
        { ...ratings[0], weight: 1, isWeightSelectedByUser: false },
        { ...ratings[1], weight: 0, isWeightSelectedByUser: true },
      ],
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
    expect(result!.balanceSheetVersion).toEqual(response.version);
    expect(result!.ratings).toEqual(filteredRatings);
    expect(mockApi.getBalanceSheet).toHaveBeenCalledWith(3);
  });
});

describe('action', () => {
  it('updates ratings for balancesheet', async () => {
    mockApi.updateBalanceSheet.mockResolvedValue(
      new BalanceSheetMockBuilder().build()
    );
    const ratings = [
      {
        shortName: 'A1.1',
        name: 'Arbeitsbedingungen und gesellschaftliche Auswirkungen in der Zulieferkette',
        estimations: 9,
        isPositive: true,
        type: RatingType.aspect,
        weight: 2,
        isWeightSelectedByUser: true,
        maxPoints: 0,
        points: 0,
      },
      {
        shortName: 'E1.1',
        name: 'Rating E1',
        type: RatingType.aspect,
        isPositive: true,
        estimations: 7,
        weight: 1,
        isWeightSelectedByUser: false,
        maxPoints: 0,
        points: 0,
      },
    ];
    await action(
      {
        params: { balanceSheetId: '3' },
        request: new Request(new URL(`http://localhost`), {
          method: 'POST',
          body: JSON.stringify({ ratings }),
        }),
      },
      { userData: { access_token: 'token' } }
    );
    expect(mockApi.updateBalanceSheet).toHaveBeenCalledWith(3, {
      ratings: [
        { shortName: 'A1.1', estimations: 9, weight: 2 },
        { shortName: 'E1.1', estimations: 7, weight: undefined },
      ],
    });
  });
});
