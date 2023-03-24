import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import { BalanceSheetMocks } from '../testUtils/balanceSheets';
import RatingsPage from './RatingsPage';
import { useAlert } from '../contexts/AlertContext';
import { RatingType } from '@ecogood/e-calculator-schemas/dist/rating.dto';
import { Rating, StakholderShortNames } from '../models/Rating';
import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@mui/material';
import { RatingsForm } from '../components/balanceSheet/RatingsForm';
import userEvent from '@testing-library/user-event';

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
      .ratings.filter((r: Rating) =>
        r.shortName.startsWith(StakholderShortNames.Suppliers)
      )
      .filter((r: Rating) => r.type === RatingType.aspect);
    aspectsOfStakeholderSuppliers.forEach((r: Rating) => {
      expect(screen.getByText(r.shortName)).toBeInTheDocument();
    });
    BalanceSheetMocks.balanceSheet1()
      .ratings.filter((r: Rating) => r.type === RatingType.topic)
      .forEach((r: Rating) => {
        expect(screen.queryByText(r.shortName)).not.toBeInTheDocument();
      });
  });
});
