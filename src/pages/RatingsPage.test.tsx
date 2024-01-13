import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import { BalanceSheetMockBuilder } from '../testUtils/balanceSheets';
import RatingsPage from './RatingsPage';
import { useAlert } from '../contexts/AlertContext';
import { RatingType } from '@ecogood/e-calculator-schemas/dist/rating.dto';
import { Rating, StakholderShortNames } from '../models/Rating';

jest.mock('../contexts/ActiveBalanceSheetProvider');
jest.mock('../contexts/AlertContext');
describe('RatingsPage', () => {
  const updateRating = jest.fn();

  const balanceSheetMockBuilder = new BalanceSheetMockBuilder();

  beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({ addErrorAlert: jest.fn() });
    (useActiveBalanceSheet as jest.Mock).mockReturnValue({
      balanceSheet: balanceSheetMockBuilder.build(),
      updateRating: updateRating,
    });
  });

  it('renders ratings of given stakeholder', () => {
    renderWithTheme(
      <RatingsPage stakeholderToFilterBy={StakholderShortNames.Suppliers} />
    );
    const ratingsOfStakeholderSuppliers = balanceSheetMockBuilder
      .build()
      .ratings.filter((r: Rating) =>
        r.shortName.startsWith(StakholderShortNames.Suppliers)
      );

    ratingsOfStakeholderSuppliers
      .filter((r) => r.type === 'topic')
      .forEach((r: Rating) => {
        expect(screen.getByText(`${r.name}`)).toBeInTheDocument();
      });

    ratingsOfStakeholderSuppliers
      .filter((r) => r.type === 'aspect')
      .forEach((r: Rating) => {
        expect(
          screen.getByText(`${r.shortName} ${r.name}`)
        ).toBeInTheDocument();
      });
  });
});
