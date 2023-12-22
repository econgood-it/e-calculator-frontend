import '@testing-library/jest-dom';

import { useAlert } from '../../contexts/AlertContext';
import { useActiveBalanceSheet } from '../../contexts/ActiveBalanceSheetProvider';
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

jest.mock('../../contexts/ActiveBalanceSheetProvider');
jest.mock('../../contexts/AlertContext');
jest.mock('../../contexts/WorkbookProvider');

describe('RatingsForm', () => {
  const updateRatings = jest.fn();
  beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({ addErrorAlert: jest.fn() });
    (useWorkbook as jest.Mock).mockReturnValue(
      new Workbook(WorkbookResponseMocks.default())
    );
    (useActiveBalanceSheet as jest.Mock).mockReturnValue({
      updateRatings: updateRatings,
    });
  });
  it('should render aspects', async () => {
    const ratings = new RatingsMockBuilder().build();
    renderWithTheme(<RatingsForm stakeholderName={''} ratings={ratings} />);
    for (const [index, rating] of ratings.entries()) {
      if (rating.type === RatingType.aspect) {
        expect(
          screen.getByLabelText(`ratings.${index}.estimations`)
        ).toBeInTheDocument();
        expect(screen.getByText(`${rating.shortName}`)).toBeInTheDocument();
        expect(screen.getByText(`${rating.name}`)).toBeInTheDocument();
      }
    }
  });

  it('should show workbook tooltip', async () => {
    const user = userEvent.setup();
    const ratings = new RatingsMockBuilder().build();
    renderWithTheme(<RatingsForm stakeholderName={''} ratings={ratings} />);
    const infoIcons = screen.getAllByLabelText('info');
    const workbook = new Workbook(WorkbookResponseMocks.default());
    expect(infoIcons).toHaveLength(2);
    await user.hover(infoIcons[0]);
    expect(
      await screen.findByText(`Title: ${workbook.getSections()[0]!.title}`)
    );
  });

  it('should update weights of topic', async () => {
    const ratings = new RatingsMockBuilder().build();
    const { user } = renderWithTheme(
      <RatingsForm stakeholderName={''} ratings={ratings} />
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
    renderWithTheme(<RatingsForm stakeholderName={''} ratings={ratings} />);
    const positiveRating = screen.getByLabelText(`ratings.${1}.estimations`);
    fireEvent.click(within(positiveRating).getByLabelText('4 Stars'));

    const negativeRating = screen.getByLabelText(`ratings.${3}.estimations`);
    fireEvent.change(negativeRating, { target: { value: -15 } });

    await saveForm(user);

    expect(updateRatings).toHaveBeenCalledWith([
      ratings[0],
      { ...ratings[1], estimations: 4 },
      ratings[2],
      { ...ratings[3], estimations: -15 },
      ...ratings.slice(4),
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
        <RatingsForm
          stakeholderName={switchToB ? 'B' : 'A'}
          ratings={switchToB ? ratingsB : ratingsA}
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
