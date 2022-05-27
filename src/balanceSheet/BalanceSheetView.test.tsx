import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import BalanceSheetView from './BalanceSheetView';
import { renderWithTheme } from '../testUtils/rendering';
import { ratingsMock } from '../testUtils/balanceSheets';
import HTMLElement from 'react';
import { useApi } from '../api/ApiContext';

jest.mock('../api/ApiContext');
const apiMock = {
  get: jest.fn(),
  patch: jest.fn(),
};

describe('BalanceSheetView', () => {
  const balanceSheetId = 1;

  beforeEach(() => {
    apiMock.get.mockImplementation((path: string) => {
      if (path === `v1/balancesheets/${balanceSheetId}/`) {
        return Promise.resolve({
          data: {
            ratings: [...ratingsMock.ratings],
          },
        });
      }
    });
    apiMock.patch.mockImplementation((path: string) => {
      if (path === `v1/balancesheets/${balanceSheetId}/`) {
        return Promise.resolve({ data: {} });
      }
    });
    (useApi as jest.Mock).mockImplementation(() => apiMock);
  });

  it('renders text Company Facts', async () => {
    renderWithTheme(<BalanceSheetView balanceSheetId={balanceSheetId} />);
    const el = await waitFor(() => screen.getAllByText('Company Facts'));
    expect(el).toHaveLength(2);
  });

  it('should update positive rating and send changes to the backend', async () => {
    renderWithTheme(<BalanceSheetView balanceSheetId={balanceSheetId} />);
    const suppliersNavItem = await waitFor(() => screen.getByText('Suppliers'));
    // Update positive rating
    fireEvent.click(suppliersNavItem);
    const star3 = within(
      screen.getByText('A1.1').parentElement as HTMLElement
    ).getByRole('radio', {
      name: '3 Stars',
    });
    expect(star3).not.toBeChecked();
    fireEvent.click(star3);
    expect(star3).toBeChecked();
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    // Check if changes are sent to backend
    expect(apiMock.patch).toHaveBeenCalledWith(
      `v1/balancesheets/${balanceSheetId}`,
      {
        ratings: [
          {
            shortName: 'A1.1',
            estimations: 3,
          },
          {
            shortName: 'A1.2',
            estimations: 0,
          },
        ],
      },
      expect.anything()
    );
  });

  it('should update negative rating and send changes to the backend', async () => {
    renderWithTheme(<BalanceSheetView balanceSheetId={balanceSheetId} />);
    const suppliersNavItem = await waitFor(() => screen.getByText('Suppliers'));
    // Update positive rating
    fireEvent.click(suppliersNavItem);
    const inputField = within(
      screen.getByText('A1.2').parentElement as HTMLElement
    ).getByRole('spinbutton', { name: 'negative-rating-input' });
    fireEvent.change(inputField, { target: { value: '-102' } });
    fireEvent.focusOut(inputField);
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    // Check if changes are sent to backend
    expect(apiMock.patch).toHaveBeenCalledWith(
      `v1/balancesheets/${balanceSheetId}`,
      {
        ratings: [
          {
            shortName: 'A1.1',
            estimations: 0,
          },
          {
            shortName: 'A1.2',
            estimations: -102,
          },
        ],
      },
      expect.anything()
    );
  });
});
