import '@testing-library/jest-dom';
import { screen, within } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import { balanceSheetMock } from '../testUtils/balanceSheets';
import RatingsPage from './RatingsPage';
import userEvent from '@testing-library/user-event';
import {
  RatingType,
  StakholderShortNames,
} from '../dataTransferObjects/Rating';

jest.mock('../contexts/ActiveBalanceSheetProvider');

describe('RatingsPage', () => {
  const updateRating = jest.fn();

  beforeEach(() => {
    (useActiveBalanceSheet as jest.Mock).mockReturnValue({
      balanceSheet: { ...balanceSheetMock },
      updateRating: updateRating,
    });
  });

  it('renders ratings of given stakeholder', () => {
    renderWithTheme(
      <RatingsPage stakeholderToFilterBy={StakholderShortNames.Suppliers} />
    );
    const aspectsOfStakeholderSuppliers = balanceSheetMock.ratings
      .filter((r) => r.shortName.startsWith(StakholderShortNames.Suppliers))
      .filter((r) => r.type === RatingType.aspect);
    aspectsOfStakeholderSuppliers.forEach((r, index) => {
      screen.debug(screen.getByText(r.shortName));
      expect(screen.getByText(r.shortName)).toBeInTheDocument();
    });
    balanceSheetMock.ratings
      .filter((r) => r.type === RatingType.topic)
      .forEach((r, index) => {
        expect(screen.queryByText(r.shortName)).not.toBeInTheDocument();
      });
  });

  it('calls onRatingChange if rating changes', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <RatingsPage stakeholderToFilterBy={StakholderShortNames.Suppliers} />
    );
    const input = screen
      .getAllByLabelText('rating-card')
      .find((div) => div.innerHTML.includes('A1.1'));

    await user.click(within(input!).getByLabelText('edit rating'));
    await user.click(within(input!).getByLabelText('9 Stars'));
    await user.click(within(input!).getByLabelText('save rating'));
    expect(updateRating).toHaveBeenCalled();
  });
});
