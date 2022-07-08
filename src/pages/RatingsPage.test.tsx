import '@testing-library/jest-dom';
import { screen, within } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import { useActiveBalanceSheet } from '../contexts/WithActiveBalanceSheet';
import { balanceSheetMock } from '../testUtils/balanceSheets';
import RatingsPage from './RatingsPage';
import userEvent from '@testing-library/user-event';

jest.mock('../contexts/WithActiveBalanceSheet');

describe('RatingsPage', () => {
  const setBalanceSheet = jest.fn();

  beforeEach(() => {
    (useActiveBalanceSheet as jest.Mock).mockReturnValue({
      balanceSheet: { ...balanceSheetMock },
      setBalanceSheet: setBalanceSheet,
    });
  });

  it('renders balance sheet items and navigates on click', () => {
    renderWithTheme(<RatingsPage />);
    balanceSheetMock.ratings.forEach((r, index) => {
      expect(screen.getByText(r.shortName)).toBeInTheDocument();
    });
  });

  it('calls onRatingChange if rating changes', async () => {
    const user = userEvent.setup();
    renderWithTheme(<RatingsPage />);
    const input = screen
      .getAllByLabelText('rating-card')
      .find((div) => div.innerHTML.includes('A1.1'));

    await user.click(within(input!).getByLabelText('9 Stars'));
    expect(setBalanceSheet).toHaveBeenCalled();
  });
});
