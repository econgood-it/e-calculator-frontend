import '@testing-library/jest-dom';
import { screen, within } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import { BalanceSheetMocks } from '../testUtils/balanceSheets';
import RatingsPage from './RatingsPage';
import userEvent from '@testing-library/user-event';
import {
  RatingType,
  StakholderShortNames,
} from '../dataTransferObjects/Rating';
import { useAlert } from '../contexts/AlertContext';

jest.mock('../contexts/ActiveBalanceSheetProvider');
jest.mock('../contexts/AlertContext');
describe('RatingsPage', () => {
  const updateRating = jest.fn();

  beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({ addErrorAlert: jest.fn() });
    (useActiveBalanceSheet as jest.Mock).mockReturnValue({
      balanceSheet: BalanceSheetMocks.balanceSheet1(),
      updateRating: updateRating,
    });
  });

  it('renders ratings of given stakeholder', () => {
    renderWithTheme(
      <RatingsPage stakeholderToFilterBy={StakholderShortNames.Suppliers} />
    );
    const aspectsOfStakeholderSuppliers = BalanceSheetMocks.balanceSheet1()
      .ratings.filter((r) =>
        r.shortName.startsWith(StakholderShortNames.Suppliers)
      )
      .filter((r) => r.type === RatingType.aspect);
    aspectsOfStakeholderSuppliers.forEach((r, index) => {
      expect(screen.getByText(r.shortName)).toBeInTheDocument();
    });
    BalanceSheetMocks.balanceSheet1()
      .ratings.filter((r) => r.type === RatingType.topic)
      .forEach((r, index) => {
        expect(screen.queryByText(r.shortName)).not.toBeInTheDocument();
      });
  });
});
