import '@testing-library/jest-dom';
import { screen, waitFor, within } from '@testing-library/react';
import renderWithTheme from '../../testUtils/rendering';

import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BalanceSheetSidebarSection } from './BalanceSheetSidebarSection';
import { userInformationFactory } from '../../testUtils/user.ts';

describe('BalanceSheetSidebarSection', () => {
  afterEach(() => {
    // Restore the real time after each test
    vi.useRealTimers();
  });

  const userInformation = userInformationFactory.build();
  const organizationName = 'orga1';
  it('should open and close balance sheet creation dialog', async () => {
    const initialPath = '/sidebar-section';
    const onCreateBalanceSheet = vi.fn();
    const router = createMemoryRouter(
      [
        {
          path: initialPath,
          element: (
            <BalanceSheetSidebarSection
              user={userInformation}
              organizationName={organizationName}
              balanceSheetItems={[]}
              onCreateBalanceSheet={onCreateBalanceSheet}
              isMemberOfCertificationAuthority={false}
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

  it(
    'should call onCreateBalanceSheet',
    async () => {
      const initialPath = '/sidebar-section';
      const onCreateBalanceSheet = vi.fn();

      const router = createMemoryRouter(
        [
          {
            path: initialPath,
            element: (
              <BalanceSheetSidebarSection
                user={userInformation}
                organizationName={organizationName}
                balanceSheetItems={[]}
                onCreateBalanceSheet={onCreateBalanceSheet}
                isMemberOfCertificationAuthority={false}
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

      const saveButton = await screen.findByRole('button', {
        name: 'Save',
      });
      //screen.debug(undefined, Infinity);

      vi.setSystemTime(new Date('2024-10-15T00:00:00.000Z'));
      const periodStartGroup = screen.getByRole('group', {
        name: /Start of reporting period/i,
      });
      const calendarPicker = within(periodStartGroup).getByRole('button', {
        name: 'Choose date',
      });
      await user.click(calendarPicker);
      const dateToSelect = await screen.findByRole('gridcell', { name: '1' });
      await user.click(dateToSelect);

      const periodEndGroup = screen.getByRole('group', {
        name: /End of reporting period/i,
      });
      const calendarPickerEndDate = within(periodEndGroup).getByRole('button', {
        name: 'Choose date',
      });
      await user.click(calendarPickerEndDate);

      const dateToSelectEndDate = await screen.findByRole('gridcell', {
        name: '14',
      });
      await user.click(dateToSelectEndDate);

      await user.click(saveButton);

      expect(onCreateBalanceSheet).toHaveBeenCalledWith({
        type: 'Full',
        version: '5.10',
        generalInformation: {
          company: { name: organizationName },
          contactPerson: userInformation,
          period: {
            start: '2024-09-30T22:00:00.000Z',
            end: '2024-10-13T22:00:00.000Z',
          },
        },
      });
    },
    { timeout: 50000 }
  );
});
