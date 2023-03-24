import '@testing-library/jest-dom';

import { useAlert } from '../../contexts/AlertContext';
import { useActiveBalanceSheet } from '../../contexts/ActiveBalanceSheetProvider';
import renderWithTheme from '../../testUtils/rendering';
import { RatingsForm } from './RatingsForm';
import { RatingsMocks } from '../../testUtils/balanceSheets';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { saveForm } from '../../testUtils/form';

import { Button } from '@mui/material';
import { useState } from 'react';
import { RatingType } from '@ecogood/e-calculator-schemas/dist/rating.dto';
import { Rating } from '../../models/Rating';

jest.mock('../../contexts/ActiveBalanceSheetProvider');
jest.mock('../../contexts/AlertContext');

describe('RatingsForm', () => {
  const updateRatings = jest.fn();

  beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({ addErrorAlert: jest.fn() });
    (useActiveBalanceSheet as jest.Mock).mockReturnValue({
      updateRatings: updateRatings,
    });
  });
  it('should render ratings', async () => {
    const ratings = RatingsMocks.ratings1();
    renderWithTheme(<RatingsForm ratings={ratings} />);
    for (const [index, rating] of ratings.entries()) {
      expect(
        screen.getByLabelText(`ratings.${index}.estimations`)
      ).toBeInTheDocument();
      expect(screen.getByText(`${rating.shortName}`)).toBeInTheDocument();
      expect(screen.getByText(`${rating.name}`)).toBeInTheDocument();
    }
  });

  it('should modify and save estimations of some ratings', async () => {
    const user = userEvent.setup();
    const ratings = RatingsMocks.ratings1();
    renderWithTheme(<RatingsForm ratings={ratings} />);
    const input = within(
      screen.getByLabelText(`ratings.${0}.estimations`)
    ).getByRole('textbox');
    await user.clear(input);
    await user.type(input, '4');
    await saveForm(user);

    expect(updateRatings).toHaveBeenCalledWith([
      { ...ratings[0], estimations: 4 },
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

    return (
      <>
        <Button onClick={() => setSwitchToB(true)}>Switch B</Button>
        <RatingsForm ratings={switchToB ? ratingsB : ratingsA} />
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
        maxPoints: 0,
        points: 0,
      },
    ];

    renderWithTheme(
      <TestSwitchRatingsComponent ratingsA={ratingsA} ratingsB={ratingsB} />
    );
    ratingsA.forEach((r) => {
      expect(screen.queryByText(r.name)).toBeInTheDocument();
    });
    ratingsB.forEach((r) => {
      expect(screen.queryByText(r.name)).not.toBeInTheDocument();
    });
    const switchToBButton = screen.getByRole('button', { name: 'Switch B' });
    await user.click(switchToBButton);

    ratingsA.forEach((r) => {
      expect(screen.queryByText(r.name)).not.toBeInTheDocument();
    });
    ratingsB.forEach((r) => {
      expect(screen.queryByText(r.name)).toBeInTheDocument();
    });
  });
});
