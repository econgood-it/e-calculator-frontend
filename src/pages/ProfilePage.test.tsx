import { action, loader, ProfilePage } from './ProfilePage.tsx';
import { describe, expect, it, vi } from 'vitest';
import { setupApiMock } from '../testUtils/api.ts';
import {
  ActionFunctionArgs,
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom';
import renderWithTheme from '../testUtils/rendering.tsx';
import { screen } from '@testing-library/react';
import { OrganizationMockBuilder } from '../testUtils/organization.ts';

describe('ProfilePage', () => {
  it('renders invitations of user and joins user on click', async () => {
    const action = vi.fn().mockResolvedValue(null);
    const invitations = [
      { id: 1, name: 'Test Organization' },
      { id: 2, name: 'Another Organization' },
    ];
    const router = createMemoryRouter(
      [
        {
          path: 'profile',
          element: <ProfilePage />,
          loader: () => invitations,
          action: async ({ request }: ActionFunctionArgs) =>
            action(await request.json()),
        },
      ],
      { initialEntries: ['/profile'] }
    );
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await screen.findByText('You were invited to the following organizations');
    for (const invitation of invitations) {
      screen.getByText(invitation.name);
    }
    await user.click(screen.getAllByRole('button', { name: 'Join' })[0]);
    expect(action).toHaveBeenCalledWith({ id: 1 });
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
  it('loads profile information of user', async () => {
    const response = [
      { id: 1, name: 'Test Organization' },
      { id: 2, name: 'Another Organization' },
    ];
    mockApi.getInvitations.mockResolvedValue(response);
    const result = await loader(
      {
        params: {},
        request: new Request(new URL('http://localhost')),
      },
      { userData: { access_token: 'token' } }
    );
    expect(result).toEqual(response);
    expect(mockApi.getInvitations).toHaveBeenCalledWith();
  });
});

describe('actions', () => {
  it('joins organization', async () => {
    const organization = {
      id: 3,
    };
    const request = new Request(new URL('http://localhost'), {
      method: 'POST',
      body: JSON.stringify(organization),
    });
    const response = new OrganizationMockBuilder().build();
    mockApi.joinOrganization.mockResolvedValue(response);
    const result = await action(
      {
        params: {},
        request,
      },
      { userData: { access_token: 'token' } }
    );
    expect(result).toEqual(response);
    expect(mockApi.joinOrganization).toHaveBeenCalledWith(organization.id);
  });
});
