import '@testing-library/jest-dom';

import { useAlert } from '../../contexts/AlertContext';
import { useActiveBalanceSheet } from '../../contexts/ActiveBalanceSheetProvider';
import renderWithTheme from '../../testUtils/rendering';
import { RatingsForm } from './RatingsForm';
import { RatingsMocks } from '../../testUtils/balanceSheets';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { saveForm } from '../../testUtils/form';

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
});
