import renderWithTheme from '../../testUtils/rendering';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FinanceConfigurator } from './FinanceConfigurators.tsx';
import { screen } from '@testing-library/react';
import { RatingType } from '@ecogood/e-calculator-schemas/dist/rating.dto';

describe('RatingsConfigurator', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should apply selection of B1.2 or B1.1', async () => {
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
      <FinanceConfigurator
        initialRatings={ratings}
        onRatingsChange={onRatingsChange}
      />
    );
    await user.click(screen.getByText('Selection of topics and aspects'));
    const radioButtons = await screen.findAllByRole('radio');
    expect(radioButtons.map((rb) => rb.getAttribute('value'))).toEqual([
      'B1.1',
      'B1.2',
    ]);
    expect(radioButtons[0]).toBeChecked();
    expect(radioButtons[1]).not.toBeChecked();
    await user.click(radioButtons[1]);
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onRatingsChange).toHaveBeenCalledWith([
      { ...ratings[0] },
      { ...ratings[1], weight: 0, isWeightSelectedByUser: true },
      { ...ratings[2], weight: 1, isWeightSelectedByUser: false },
    ]);
  });
});
