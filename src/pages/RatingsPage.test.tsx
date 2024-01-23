
import {screen} from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import {useActiveBalanceSheet} from '../contexts/ActiveBalanceSheetProvider';
import {BalanceSheetMockBuilder} from '../testUtils/balanceSheets';
import RatingsPage from './RatingsPage';
import {useAlert} from '../contexts/AlertContext';
import {Rating, StakholderShortNames} from '../models/Rating';
import {beforeEach, describe, expect, it, Mock, vi} from "vitest";


vi.mock('../contexts/ActiveBalanceSheetProvider');
vi.mock('../contexts/AlertContext');
describe('RatingsPage', () => {
  const updateRating = vi.fn();

  const balanceSheetMockBuilder = new BalanceSheetMockBuilder();

  beforeEach(() => {
    (useAlert as Mock).mockReturnValue({ addErrorAlert: vi.fn() });
    (useActiveBalanceSheet as Mock).mockReturnValue({
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
