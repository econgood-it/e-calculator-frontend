import { screen, waitFor } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import {
  action,
  InvitationOverviewPage,
  loader,
} from './InvitationOverviewPage.tsx';
import {
  ActionFunctionArgs,
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom';
import { OrganizationMockBuilder } from '../testUtils/organization';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { setupApiMock } from '../testUtils/api.ts';
import { useAlert } from '../contexts/AlertContext.tsx';

vi.mock('../contexts/AlertContext');

describe('InvitationOverviewPage', () => {
  beforeEach(() => {
    (useAlert as Mock).mockReturnValue({
      addErrorAlert: vi.fn(),
    });
  });

  it('renders invitations and updates on save', async () => {
    const action = vi.fn().mockResolvedValue(null);
    const path = '/organization/3/invitation';
    const invitations = ['invitation1@example.com', 'invitation2@example.com'];
    const router = createMemoryRouter(
      [
        {
          path: path,
          element: <InvitationOverviewPage />,
          loader: () => ['invitation1@example.com', 'invitation2@example.com'],
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
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    await waitFor(() =>
      expect(action).toHaveBeenCalledWith({
        email,
      })
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
  it('loads invitations', async () => {
    const invitations = ['invitation1@example.com', 'invitation2@example.com'];
    const response = {
      ...new OrganizationMockBuilder().withId(3).build(),
      invitations,
    };
    mockApi.getOrganization.mockResolvedValue(response);
    const result = await loader(
      {
        params: { orgaId: '3' },
        request: new Request(new URL('http://localhost')),
      },
      { userData: { access_token: 'token' } }
    );
    expect(result).toEqual(invitations);
    expect(mockApi.getOrganization).toHaveBeenCalledWith(3);
  });
});

describe('action', () => {
  it('invites user via email', async () => {
    const emailToInvite = 'invite@example.com';
    const request = new Request(new URL('http://localhost'), {
      method: 'put',
      body: JSON.stringify({ email: emailToInvite }),
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
