import '@testing-library/jest-dom';
import renderWithTheme from '../../testUtils/rendering';
import { screen, waitFor } from '@testing-library/react';
import { useAlert } from '../../contexts/AlertContext';

import { useBalanceSheetItems } from '../../contexts/BalanceSheetListProvider';
import { BalanceSheetSidebarSection } from './BalanceSheetSidebarSection';
import { BalanceSheetItemsMockBuilder } from '../../testUtils/balanceSheets';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

jest.mock('../../contexts/AlertContext');
jest.mock('../../contexts/BalanceSheetListProvider');
describe('BalanceSheetSidebarSection', () => {
  const createBalanceSheetMock = jest.fn();

  beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({ addErrorAlert: jest.fn() });
    (useBalanceSheetItems as jest.Mock).mockReturnValue({
      createBalanceSheet: createBalanceSheetMock,
      balanceSheetItems: new BalanceSheetItemsMockBuilder().build(),
    });
  });

  it('should open and close balance sheet creation dialog', async () => {
    const initialPath = '/sidebar-section';
    const router = createMemoryRouter(
      [{ path: initialPath, element: <BalanceSheetSidebarSection /> }],
      { initialEntries: [initialPath] }
    );
    const { user } = renderWithTheme(<RouterProvider router={router} />);

    await user.click(
      screen.getByRole('button', {
        name: /Create balance sheet/,
      })
    );
    expect(
      await screen.findByRole('dialog', { name: 'Create balance sheet' })
    ).toBeInTheDocument();
    await user.click(screen.getByLabelText('Close dialog'));
    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: 'Create balance sheet' })
      ).not.toBeInTheDocument()
    );
  });
});
