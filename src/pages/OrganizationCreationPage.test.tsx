import { screen } from '@testing-library/react';
import { useAuth } from 'oidc-react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { setupApiMock } from '../testUtils/api';
import { OrganizationMockBuilder } from '../testUtils/organization';
import renderWithTheme from '../testUtils/rendering';
import { action, OrganizationCreationPage } from './OrganizationCreationPage';

vi.mock('oidc-react', () => ({
  useAuth: vi.fn(),
}));

describe('OrganizationCreationPage', () => {
  const logoutMock = vi.fn();

  beforeEach(() => {
    (useAuth as Mock).mockReturnValue({
      signOutRedirect: logoutMock,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('creates organization and calls action', async () => {
    const path = `/organization`;
    const action = vi.fn().mockResolvedValue(null);
    const router = createMemoryRouter(
      [
        {
          path,
          element: <OrganizationCreationPage />,
          action: async ({ request }) => action(await request.json()),
        },
      ],
      { initialEntries: [path] }
    );
    const { user } = renderWithTheme(<RouterProvider router={router} />);

    const newOrga = new OrganizationMockBuilder().buildRequestBody();

    await user.type(screen.getByLabelText(/Organization name/), newOrga.name);
    await user.type(screen.getByLabelText(/City/), newOrga.address.city);
    await user.type(screen.getByLabelText(/Zip/), newOrga.address.zip);
    await user.type(screen.getByLabelText(/Street/), newOrga.address.street);
    await user.type(
      screen.getByLabelText(/House number/),
      newOrga.address.houseNumber
    );
    await user.click(screen.getByText('Save'));
    expect(action).toHaveBeenCalledWith({
      organization: newOrga,
      intent: 'createOrganization',
    });
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

describe('actions', () => {
  it('create organization and navigates to it', async () => {
    const organization = new OrganizationMockBuilder().withId(3);
    mockApi.createOrganization.mockResolvedValue(organization.build());

    const request = new Request(new URL('http://localhost'), {
      method: 'post',
      body: JSON.stringify({
        organization: { ...organization.buildRequestBody() },
        intent: 'createOrganization',
      }),
    });

    const result = await action(
      { params: { orgaId: '1' }, request },
      { userData: { access_token: 'token' } }
    );
    expect(result!.status).toEqual(302);

    expect(result!.headers.get('Location')).toEqual(
      `/organization/${organization.build().id}/overview`
    );
    expect(mockApi.createOrganization).toHaveBeenCalledWith(
      organization.buildRequestBody()
    );
  });
});
