import '@testing-library/jest-dom';
import { act, screen, waitFor } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import BalanceSheetListPage from './BalanceSheetListPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListContext';
import { useActiveBalanceSheet } from '../contexts/WithActiveBalanceSheet';
import { balanceSheetMock } from '../testUtils/balanceSheets';
import RatingsPage from './RatingsPage';

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
      expect(
        screen.getByRole('textbox', { name: `ratings.${index}.shortName` })
      ).toBeInTheDocument();
    });
  });
});
