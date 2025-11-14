import '@testing-library/jest-dom';
import { screen, waitFor, within } from '@testing-library/react';
import renderWithTheme from '../../testUtils/rendering';

import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { BalanceSheetSidebarSection } from './BalanceSheetSidebarSection';
import { userInformationFactory } from '../../testUtils/user.ts';

describe('BalanceSheetSidebarSection', () => {
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

  it.skip('should call onCreateBalanceSheet', async () => {
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

    const periodStartGroup = screen.getByRole('group', {
      name: /period start/i,
    });
    await user.type(periodStartGroup, '2024-03-25');
    // const monthInput = within(periodStartGroup).getByRole('spinbutton', {
    //   name: /month/i,
    // });
    //
    // const dayInput = within(periodStartGroup).getByRole('spinbutton', {
    //   name: /day/i,
    // });
    // const yearInput = within(periodStartGroup).getByRole('spinbutton', {
    //   name: /year/i,
    // });
    // await user.type(monthInput, '11');
    // await user.type(dayInput, '25');
    // await user.type(yearInput, '2024');
    // await user.tab();

    // const textbox = await screen.findByLabelText('period start');
    await user.click(saveButton);

    expect(onCreateBalanceSheet).toHaveBeenCalledWith({
      type: 'Full',
      version: '5.10',
      generalInformation: {
        company: { name: organizationName },
        contactPerson: userInformation,
      },
    });
  });
});
