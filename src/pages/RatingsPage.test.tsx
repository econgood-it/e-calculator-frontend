import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import { BalanceSheetMockBuilder } from '../testUtils/balanceSheets';
import { Rating, StakholderShortNames } from '../models/Rating';
import { afterEach, describe, expect, it, Mock, vi } from 'vitest';

import RatingsPage, { action, loader } from './RatingsPage.tsx';
import { setupApiMock } from '../testUtils/api.ts';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { RatingType } from '@ecogood/e-calculator-schemas/dist/rating.dto';
import { saveForm } from '../testUtils/form.tsx';
import { BalanceSheetVersion } from '@ecogood/e-calculator-schemas/dist/shared.schemas';

function createRouter(
  ratings: Rating[],
  actionMock: Mock,
  version: BalanceSheetVersion
) {
  return createMemoryRouter(
    [
      {
        path: '/balancesheet/1/suppliers',
        element: <RatingsPage />,
        loader: () => ({
          ratings,
          balanceSheetVersion: version,
        }),
        action: async ({ request }) => actionMock(await request.json()),
      },
    ],
    { initialEntries: ['/balancesheet/1/suppliers'] }
  );
}

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
      {
        shortName: 'A1.2',
        name: 'A1.2 name',
        estimations: 0,
        isPositive: false,
        type: RatingType.aspect,
        weight: 1,
        isWeightSelectedByUser: false,
        maxPoints: 0,
        points: 0,
      },
    ];
    const router = createRouter(ratings, action, BalanceSheetVersion.v5_1_0);
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

    const negativeRating = screen.getByLabelText(`ratings.${2}.estimations`);
    fireEvent.change(negativeRating, { target: { value: -15 } });

    await saveForm(user);
    expect(action).toHaveBeenCalledWith({
      ratings: [
        ratings[0],
        { ...ratings[1], estimations: 4 },
        { ...ratings[2], estimations: -15 },
      ],
    });
  });
});

describe('WeightConfigurator', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const supplierRatings = [
    {
      shortName: 'A1',
      name: 'A1 Name',
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
      name: 'A1.1 Name',
      estimations: 0,
      isPositive: true,
      type: RatingType.aspect,
      weight: 1,
      isWeightSelectedByUser: false,
      maxPoints: 0,
      points: 0,
    },
    {
      shortName: 'A1.2',
      name: 'A1.2 Name',
      estimations: 0,
      isPositive: false,
      type: RatingType.aspect,
      weight: 1,
      isWeightSelectedByUser: false,
      maxPoints: 0,
      points: 0,
    },
  ];

  it('only shows topics and positive aspects for weight adaption', async () => {
    const action = vi.fn().mockResolvedValue(null);
    const router = createRouter(
      supplierRatings,
      action,
      BalanceSheetVersion.v5_1_0
    );
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.click(await screen.findByText('Adapt selection and weighting'));
    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('A1.1')).toBeInTheDocument();
    expect(screen.queryByText('A1.2')).not.toBeInTheDocument();
  });

  it('save weighting adaption', async () => {
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
    const router = createRouter(ratings, action, BalanceSheetVersion.v5_1_0);

    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.click(await screen.findByText('Adapt selection and weighting'));
    await user.click(
      within(screen.getByLabelText('Select B1.1')).getByRole('checkbox')
    );
    await user.click(
      screen.getByLabelText(`ratings.${0}.isWeightSelectedByUser`)
    );
    await user.click(
      screen.getByRole('combobox', {
        name: /Weight/,
      })
    );

    const weightOptions = await screen.findAllByRole('option');
    await user.click(weightOptions.find((o) => o.textContent === '2')!);
    await saveForm(user);
    expect(action).toHaveBeenCalledWith({
      ratings: [
        { ...ratings[0], weight: 2, isWeightSelectedByUser: true },
        { ...ratings[1], weight: 0, isWeightSelectedByUser: true },
      ],
    });
  });

  it('should change weight of A1.1', async () => {
    const action = vi.fn().mockResolvedValue(null);

    const router = createRouter(
      supplierRatings,
      action,
      BalanceSheetVersion.v5_1_0
    );
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.click(await screen.findByText('Adapt selection and weighting'));
    let weightSwitches = screen.getAllByText('Select weight manually');
    expect(weightSwitches).toHaveLength(2);
    await user.click(
      screen.getByLabelText(`ratings.${1}.isWeightSelectedByUser`)
    );
    weightSwitches = screen.getAllByText('Select weight manually');
    expect(weightSwitches).toHaveLength(1);

    await user.click(
      screen.getByRole('combobox', {
        name: /Weight/,
      })
    );

    const weightOptions = await screen.findAllByRole('option');
    expect(weightOptions.map((o) => o.textContent)).toEqual([
      '0.5',
      '1',
      '1.5',
      '2',
    ]);

    await user.click(weightOptions.find((o) => o.textContent === '2')!);

    await saveForm(user);

    expect(action).toHaveBeenCalledWith({
      ratings: [
        supplierRatings[0],
        { ...supplierRatings[1], weight: 2, isWeightSelectedByUser: true },
        supplierRatings[2],
      ],
    });
  });

  it('should unselect B1.1 if B1.2 is selected', async () => {
    const action = vi.fn().mockResolvedValue(null);
    const ratings = [
      {
        shortName: 'A1.1',
        name: 'A1.1 Name',
        estimations: 0,
        isPositive: true,
        type: RatingType.aspect,
        weight: 1,
        isWeightSelectedByUser: false,
        maxPoints: 0,
        points: 0,
      },
      {
        shortName: 'B1.1',
        name: 'B1.1 Name',
        estimations: 0,
        isPositive: true,
        type: RatingType.aspect,
        weight: 1,
        isWeightSelectedByUser: false,
        maxPoints: 0,
        points: 0,
      },
      {
        shortName: 'B1.2',
        name: 'B1.2 Name',
        estimations: 0,
        isPositive: true,
        type: RatingType.aspect,
        weight: 0,
        isWeightSelectedByUser: false,
        maxPoints: 0,
        points: 0,
      },
    ];
    const router = createRouter(ratings, action, BalanceSheetVersion.v5_1_0);
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.click(await screen.findByText('Adapt selection and weighting'));
    const b11Checkbox = within(screen.getByLabelText('Select B1.1')).getByRole(
      'checkbox'
    );
    const b12Checkbox = within(screen.getByLabelText('Select B1.2')).getByRole(
      'checkbox'
    );
    let weightSwitches = screen.getAllByText('Select weight manually');
    expect(b11Checkbox).toBeChecked();
    expect(b12Checkbox).not.toBeChecked();
    expect(weightSwitches).toHaveLength(2);
    await user.click(b12Checkbox);
    expect(b11Checkbox).not.toBeChecked();
    expect(b12Checkbox).toBeChecked();
    weightSwitches = screen.getAllByText('Select weight manually');
    expect(weightSwitches).toHaveLength(2);

    await saveForm(user);

    expect(action).toHaveBeenCalledWith({
      ratings: [
        ratings[0],
        { ...ratings[1], weight: 0, isWeightSelectedByUser: true },
        { ...ratings[2], weight: 1, isWeightSelectedByUser: false },
      ],
    });
  });

  it('should not unselect B1.1 if B1.2 is selected if version is smaller 5.10', async () => {
    const action = vi.fn().mockResolvedValue(null);
    const ratings = [
      {
        shortName: 'A1.1',
        name: 'A1.1 Name',
        estimations: 0,
        isPositive: true,
        type: RatingType.aspect,
        weight: 1,
        isWeightSelectedByUser: false,
        maxPoints: 0,
        points: 0,
      },
      {
        shortName: 'B1.1',
        name: 'B1.1 Name',
        estimations: 0,
        isPositive: true,
        type: RatingType.aspect,
        weight: 1,
        isWeightSelectedByUser: false,
        maxPoints: 0,
        points: 0,
      },
      {
        shortName: 'B1.2',
        name: 'B1.2 Name',
        estimations: 0,
        isPositive: true,
        type: RatingType.aspect,
        weight: 0,
        isWeightSelectedByUser: false,
        maxPoints: 0,
        points: 0,
      },
    ];
    const router = createRouter(ratings, action, BalanceSheetVersion.v5_0_9);
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.click(await screen.findByText('Adapt selection and weighting'));
    const b11Checkbox = within(screen.getByLabelText('Select B1.1')).getByRole(
      'checkbox'
    );
    const b12Checkbox = within(screen.getByLabelText('Select B1.2')).getByRole(
      'checkbox'
    );
    let weightSwitches = screen.getAllByText('Select weight manually');
    expect(b11Checkbox).toBeChecked();
    expect(b12Checkbox).not.toBeChecked();
    expect(weightSwitches).toHaveLength(2);
    await user.click(b12Checkbox);
    expect(b11Checkbox).toBeChecked();
    expect(b12Checkbox).toBeChecked();
    weightSwitches = screen.getAllByText('Select weight manually');
    expect(weightSwitches).toHaveLength(3);

    await saveForm(user);

    expect(action).toHaveBeenCalledWith({
      ratings: [
        ratings[0],
        { ...ratings[1], weight: 1, isWeightSelectedByUser: false },
        { ...ratings[2], weight: 1, isWeightSelectedByUser: false },
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
