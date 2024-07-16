import { act, screen, waitFor, within } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import {
  action,
  loader,
  OrganizationOverviewPage,
} from './OrganizationOverviewPage';
import {
  ActionFunctionArgs,
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListProvider';
import { OrganizationMockBuilder } from '../testUtils/organization';
import { useAlert } from '../contexts/AlertContext';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import {
  BalanceSheetType,
  BalanceSheetVersion,
} from '@ecogood/e-calculator-schemas/dist/shared.schemas';
import { setupApiMock } from '../testUtils/api.ts';

vi.mock('../contexts/AlertContext');
vi.mock('../contexts/BalanceSheetListProvider');
describe('OrganizationOverviewPage', () => {
  const initialPathForRouting = '/organization/3';
  const balanceSheetItems = [{ id: 1 }, { id: 2 }];
  const setBalanceSheetItems = vi.fn();
  const createBalanceSheetMock = vi.fn();

  const organizationMockBuilder = new OrganizationMockBuilder();

  const addSuccessAlertMock = vi.fn();

  beforeEach(() => {
    (useBalanceSheetItems as Mock).mockReturnValue({
      balanceSheetItems,
      setBalanceSheetItems,
      createBalanceSheet: createBalanceSheetMock,
    });
    (useAlert as Mock).mockReturnValue({
      addErrorAlert: vi.fn(),
      addSuccessAlert: addSuccessAlertMock,
    });
  });

  it('renders organization form and updates on save', async () => {
    const action = vi.fn().mockResolvedValue(null);
    const router = createMemoryRouter(
      [
        {
          path: initialPathForRouting,
          element: <OrganizationOverviewPage />,
          loader: () => organizationMockBuilder.withId(3).build(),
          action: async ({ request }: ActionFunctionArgs) =>
            action(await request.json()),
        },
      ],
      { initialEntries: [initialPathForRouting] }
    );
    const user = userEvent.setup();
    act(() => {
      renderWithTheme(<RouterProvider router={router} />);
    });
    const newName = 'My new orga name';
    const nameField = await screen.findByLabelText(/Organization name/);
    await user.clear(nameField);
    await user.type(nameField, newName);
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    await waitFor(() =>
      expect(action).toHaveBeenCalledWith({
        ...organizationMockBuilder.withId(3).buildRequestBody(),
        name: newName,
        intent: 'update',
      })
    );
  });

  it('renders invitations and updates on save', async () => {
    const action = vi.fn().mockResolvedValue(null);
    const path = '/organization/3/invitation';
    const invitations = ['invitation1@example.com', 'invitation2@example.com'];
    const organization = {
      ...organizationMockBuilder.withId(3).build(),
      invitations,
    };
    const router = createMemoryRouter(
      [
        {
          path: path,
          element: <OrganizationOverviewPage />,
          loader: () => organization,
          action: async ({ request }: ActionFunctionArgs) =>
            action(await request.json()),
        },
      ],
      { initialEntries: [path] }
    );
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    for (const invitation of invitations) {
      expect(await screen.findByText(invitation)).toBeInTheDocument();
    }
    const email = 'invite@example.com';
    const emailField = await screen.findByLabelText(/Email/);
    await user.type(emailField, email);
    const saveButton = screen.getByRole('button', { name: 'Invite' });
    await user.click(saveButton);

    await waitFor(() =>
      expect(action).toHaveBeenCalledWith({
        email,
        intent: 'invite',
      })
    );
  });

  it('adds balance sheet if create balance sheet button is clicked', async () => {
    const router = createMemoryRouter(
      [{ path: initialPathForRouting, element: <OrganizationOverviewPage /> }],
      { initialEntries: [initialPathForRouting] }
    );

    const { user } = renderWithTheme(<RouterProvider router={router} />);

    const createBalanceSheetButton = screen.getByRole('button', {
      name: 'Create balance sheet',
    });

    await user.click(createBalanceSheetButton);

    await user.click(
      within(
        screen.getByRole('dialog', { name: 'Create balance sheet' })
      ).getByRole('button', { name: 'Save' })
    );

    await waitFor(() =>
      expect(createBalanceSheetMock).toHaveBeenCalledWith({
        type: BalanceSheetType.Full,
        version: BalanceSheetVersion.v5_0_8,
      })
    );
  });

  it('renders balance sheet items and navigates on click', async () => {
    const router = createMemoryRouter(
      [
        {
          path: initialPathForRouting,
          element: <OrganizationOverviewPage />,
          loader: () => organizationMockBuilder.build(),
        },
        {
          path: `${initialPathForRouting}/balancesheet/2/overview`,
          element: <div>Page of Balance sheet 2</div>,
        },
      ],
      { initialEntries: [initialPathForRouting] }
    );

    const { user } = renderWithTheme(<RouterProvider router={router} />);

    const linkToBalanceSheet2 = await screen.findByLabelText('Balance sheet 2');

    await user.click(linkToBalanceSheet2);

    await waitFor(() =>
      expect(screen.getByText('Page of Balance sheet 2')).toBeInTheDocument()
    );
  });
});

const mockApi = setupApiMock();

vi.mock('../api/api.client.ts', async () => {
  const originalModule = await vi.importActual('../api/api.client.ts');
  return {
    ...originalModule,
    createApiClient: () => mockApi,
  };
});

describe('loader', () => {
  it('loads organization', async () => {
    const response = new OrganizationMockBuilder().withId(3).build();
    mockApi.getOrganization.mockResolvedValue(response);
    const result = await loader(
      {
        params: { orgaId: '3' },
        request: new Request(new URL('', 'http://localhost')),
      },
      { userData: { access_token: 'token' } }
    );
    expect(result).toEqual(response);
    expect(mockApi.getOrganization).toHaveBeenCalledWith(3);
  });
});

describe('actions', () => {
  it('updates organization', async () => {
    const organization = {
      ...new OrganizationMockBuilder().withId(3).build(),
      name: 'new name',
    };
    const request = new Request(new URL('', 'http://localhost'), {
      method: 'put',
      body: JSON.stringify({ ...organization, intent: 'update' }),
    });
    const response = new OrganizationMockBuilder().withId(3).build();
    mockApi.updateOrganization.mockResolvedValue(response);
    await action(
      { params: { orgaId: '3' }, request },
      { userData: { access_token: 'token' } }
    );
    expect(mockApi.updateOrganization).toHaveBeenCalledWith(3, organization);
  });
  it('invites user via email', async () => {
    const emailToInvite = 'invite@example.com';
    const request = new Request(new URL('http://localhost'), {
      method: 'put',
      body: JSON.stringify({ email: emailToInvite, intent: 'invite' }),
    });
    mockApi.inviteUserToOrganization.mockResolvedValue({ status: 200 });
    await action(
      { params: { orgaId: '3' }, request },
      { userData: { access_token: 'token' } }
    );
    expect(mockApi.inviteUserToOrganization).toHaveBeenCalledWith(
      3,
      emailToInvite
    );
  });
});
