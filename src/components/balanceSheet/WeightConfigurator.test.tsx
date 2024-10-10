import renderWithTheme from '../../testUtils/rendering';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WeightConfigurator } from './WeightConfigurators.tsx';
import { screen, within } from '@testing-library/react';
import { RatingType } from '@ecogood/e-calculator-schemas/dist/rating.dto';
import { BalanceSheetVersion } from '@ecogood/e-calculator-schemas/dist/shared.schemas';
import { saveForm } from '../../testUtils/form.tsx';

describe('WeightConfigurator', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should change weight of A1.1', async () => {
    const onRatingsChange = vi.fn();
    const ratings = [
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
        isPositive: false,
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
    const { user } = renderWithTheme(
      <WeightConfigurator
        ratings={ratings}
        onRatingsChange={onRatingsChange}
        version={BalanceSheetVersion.v5_1_0}
      />
    );
    await user.click(screen.getByText('Adapt selection and weighting'));
    let weightSwitches = await screen.findAllByText('Select weight manually');
    expect(weightSwitches).toHaveLength(3);
    await user.click(
      screen.getByLabelText(`ratings.${1}.isWeightSelectedByUser`)
    );
    weightSwitches = await screen.findAllByText('Select weight manually');
    expect(weightSwitches).toHaveLength(2);

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

    expect(onRatingsChange).toHaveBeenCalledWith([
      ratings[0],
      { ...ratings[1], weight: 2, isWeightSelectedByUser: true },
      ratings[2],
    ]);
  });

  it('should unselect B1.1 if B1.2 is selected', async () => {
    const onRatingsChange = vi.fn();
    const ratings = [
      {
        shortName: 'A1.1',
        name: 'A1.1 Name',
        estimations: 0,
        isPositive: false,
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
        isPositive: false,
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
        isPositive: false,
        type: RatingType.aspect,
        weight: 0,
        isWeightSelectedByUser: false,
        maxPoints: 0,
        points: 0,
      },
    ];
    const { user } = renderWithTheme(
      <WeightConfigurator
        ratings={ratings}
        onRatingsChange={onRatingsChange}
        version={BalanceSheetVersion.v5_1_0}
      />
    );
    await user.click(screen.getByText('Adapt selection and weighting'));
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

    expect(onRatingsChange).toHaveBeenCalledWith([
      ratings[0],
      { ...ratings[1], weight: 0, isWeightSelectedByUser: true },
      { ...ratings[2], weight: 1, isWeightSelectedByUser: false },
    ]);
  });

  it('should not unselect B1.1 if B1.2 is selected if version is smaller 5.10', async () => {
    const onRatingsChange = vi.fn();
    const ratings = [
      {
        shortName: 'A1.1',
        name: 'A1.1 Name',
        estimations: 0,
        isPositive: false,
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
        isPositive: false,
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
        isPositive: false,
        type: RatingType.aspect,
        weight: 0,
        isWeightSelectedByUser: false,
        maxPoints: 0,
        points: 0,
      },
    ];
    const { user } = renderWithTheme(
      <WeightConfigurator
        ratings={ratings}
        onRatingsChange={onRatingsChange}
        version={BalanceSheetVersion.v5_0_9}
      />
    );
    await user.click(screen.getByText('Adapt selection and weighting'));
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

    expect(onRatingsChange).toHaveBeenCalledWith([
      ratings[0],
      { ...ratings[1], weight: 1, isWeightSelectedByUser: false },
      { ...ratings[2], weight: 1, isWeightSelectedByUser: false },
    ]);
  });
});
