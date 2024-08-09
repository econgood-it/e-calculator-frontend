import renderWithTheme from '../../testUtils/rendering';
import { RatingsForm } from './RatingsForm';
import { RatingsMockBuilder } from '../../testUtils/balanceSheets';
import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { saveForm } from '../../testUtils/form';

import { Button } from '@mui/material';
import { useState } from 'react';
import { RatingType } from '@ecogood/e-calculator-schemas/dist/rating.dto';
import { Rating } from '../../models/Rating';
import { useWorkbook } from '../../contexts/WorkbookProvider';
import { WorkbookResponseMocks } from '../../testUtils/workbook';
import { Workbook } from '../../models/Workbook';
import { WEIGHT_VALUES } from '@ecogood/e-calculator-schemas/dist/shared.schemas';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

vi.mock('../../contexts/WorkbookProvider');

describe('RatingsForm', () => {
  beforeEach(() => {
    (useWorkbook as Mock).mockReturnValue(
      new Workbook(WorkbookResponseMocks.default())
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render aspects', async () => {
    const ratings = new RatingsMockBuilder().build();
    const onRatingsChange = vi.fn();
    renderWithTheme(
      <RatingsForm ratings={ratings} onRatingsChange={onRatingsChange} />
    );
    for (const [index, rating] of ratings.entries()) {
      if (rating.type === RatingType.aspect) {
        expect(
          screen.getByLabelText(`ratings.${index}.estimations`)
        ).toBeInTheDocument();
        expect(
          screen.getByText(`${rating.shortName} ${rating.name}`)
        ).toBeInTheDocument();
      }
    }
  });

  it.skip('should show workbook tooltip', async () => {
    const ratings = new RatingsMockBuilder().build();
    const onRatingsChange = vi.fn();
    const { user } = renderWithTheme(
      <RatingsForm ratings={ratings} onRatingsChange={onRatingsChange} />
    );
    const infoIcons = screen.getAllByLabelText('info');
    const workbook = new Workbook(WorkbookResponseMocks.default());
    expect(infoIcons).toHaveLength(2);
    await user.hover(infoIcons[0]);
    expect(
      await screen.findByText(`Title: ${workbook.getSections()[0]!.title}`)
    );
  });

  it('should modify and save estimations of some ratings', async () => {
    const user = userEvent.setup();
    const ratings = new RatingsMockBuilder().build();
    const onRatingsChange = vi.fn();
    renderWithTheme(
      <RatingsForm ratings={ratings} onRatingsChange={onRatingsChange} />
    );
    const positiveRating = screen.getByLabelText(`ratings.${1}.estimations`);
    fireEvent.click(within(positiveRating).getByLabelText('4 Stars'));

    const negativeRating = screen.getByLabelText(`ratings.${3}.estimations`);
    fireEvent.change(negativeRating, { target: { value: -15 } });

    await saveForm(user);

    expect(onRatingsChange).toHaveBeenCalledWith([
      ratings[0],
      { ...ratings[1], estimations: 4 },
      ratings[2],
      { ...ratings[3], estimations: -15 },
      ...ratings.slice(4),
    ]);
  });

  it('should modify and save isWeightSelectedByUser of some ratings', async () => {
    const ratings = new RatingsMockBuilder().build();
    const onRatingsChange = vi.fn();
    const { user } = renderWithTheme(
      <RatingsForm ratings={ratings} onRatingsChange={onRatingsChange} />
    );
    await user.click(
      screen.getByLabelText(`ratings.${0}.isWeightSelectedByUser`)
    );

    await saveForm(user);

    expect(onRatingsChange).toHaveBeenCalledWith([
      { ...ratings[0], isWeightSelectedByUser: true },
      ...ratings.slice(1),
    ]);
  });

  it('should modify weight of some ratings', async () => {
    const ratings = new RatingsMockBuilder().build();
    const onRatingsChange = vi.fn();

    const { user } = renderWithTheme(
      <RatingsForm ratings={ratings} onRatingsChange={onRatingsChange} />
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
    expect(weightOptions.map((o) => o.textContent)).toEqual(
      WEIGHT_VALUES.map((w) => w.toString())
    );

    await user.click(weightOptions.find((o) => o.textContent === '2')!);

    await saveForm(user);

    expect(onRatingsChange).toHaveBeenCalledWith([
      { ...ratings[0], weight: 2, isWeightSelectedByUser: true },
      ...ratings.slice(1),
    ]);
  });

  function TestSwitchRatingsComponent({
    ratingsA,
    ratingsB,
  }: {
    ratingsA: Rating[];
    ratingsB: Rating[];
  }) {
    const [switchToB, setSwitchToB] = useState<boolean>(false);
    const onRatingsChange = vi.fn();

    return (
      <>
        <Button onClick={() => setSwitchToB(true)}>Switch B</Button>
        <RatingsForm
          ratings={switchToB ? ratingsB : ratingsA}
          onRatingsChange={onRatingsChange}
        />
      </>
    );
  }

  it('should update ratings form entries if provided ratings are changed', async () => {
    const user = userEvent.setup();

    const ratingsA = [
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
    const ratingsB = [
      {
        shortName: 'B1',
        name: 'Ethical position in relation to financial resources',
        estimations: 0,
        isPositive: true,
        type: RatingType.topic,
        weight: 0,
        isWeightSelectedByUser: false,
        maxPoints: 0,
        points: 0,
      },
      {
        shortName: 'B1.1',
        name: 'Financial independence through equity financing',
        estimations: 0,
        isPositive: true,
        type: RatingType.aspect,
        weight: 0,
        isWeightSelectedByUser: false,
        maxPoints: 0,
        points: 0,
      },
    ];

    renderWithTheme(
      <TestSwitchRatingsComponent ratingsA={ratingsA} ratingsB={ratingsB} />
    );

    ratingsA.forEach((r) => {
      expect(screen.queryByText(new RegExp(r.name, 'i'))).toBeInTheDocument();
    });
    ratingsB.forEach((r) => {
      expect(
        screen.queryByText(new RegExp(r.name, 'i'))
      ).not.toBeInTheDocument();
    });
    const switchToBButton = screen.getByRole('button', { name: 'Switch B' });
    await user.click(switchToBButton);

    ratingsA.forEach((r) => {
      expect(
        screen.queryByText(new RegExp(r.name, 'i'))
      ).not.toBeInTheDocument();
    });
    ratingsB.forEach((r) => {
      expect(screen.queryByText(new RegExp(r.name, 'i'))).toBeInTheDocument();
    });
  });
});
