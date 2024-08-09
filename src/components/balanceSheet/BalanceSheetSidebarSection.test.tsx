import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import { useAlert } from '../../contexts/AlertContext';
import renderWithTheme from '../../testUtils/rendering';

import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { BalanceSheetSidebarSection } from './BalanceSheetSidebarSection';

vi.mock('../../contexts/AlertContext');
describe('BalanceSheetSidebarSection', () => {
  beforeEach(() => {
    (useAlert as Mock).mockReturnValue({ addErrorAlert: vi.fn() });
  });

  it('should open and close balance sheet creation dialog', async () => {
    const initialPath = '/sidebar-section';
    const onCreateBalanceSheet = vi.fn();
    const router = createMemoryRouter(
      [
        {
          path: initialPath,
          element: (
            <BalanceSheetSidebarSection
              balanceSheetItems={[]}
              onCreateBalanceSheet={onCreateBalanceSheet}
            />
          ),
        },
      ],
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

  it('should call onCreateBalanceSheet', async () => {
    const initialPath = '/sidebar-section';
    const onCreateBalanceSheet = vi.fn();
    const router = createMemoryRouter(
      [
        {
          path: initialPath,
          element: (
            <BalanceSheetSidebarSection
              balanceSheetItems={[]}
              onCreateBalanceSheet={onCreateBalanceSheet}
            />
          ),
        },
      ],
      { initialEntries: [initialPath] }
    );
    const { user } = renderWithTheme(<RouterProvider router={router} />);

    await user.click(
      screen.getByRole('button', {
        name: /Create balance sheet/,
      })
    );
    await user.click(
      await screen.findByRole('button', {
        name: 'Save',
      })
    );
    expect(onCreateBalanceSheet).toHaveBeenCalledWith({
      type: 'Full',
      version: '5.08',
    });
  });
});
