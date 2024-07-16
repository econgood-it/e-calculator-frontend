import { loader } from './ProfilePage.tsx';
import { useAlert } from '../contexts/AlertContext';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { setupApiMock } from '../testUtils/api.ts';

vi.mock('../contexts/AlertContext');

describe('ProfilePage', () => {
  beforeEach(() => {
    (useAlert as Mock).mockReturnValue({
      addErrorAlert: vi.fn(),
    });
  });

  it('renders invitations of user', async () => {
    // const action = vi.fn().mockResolvedValue(null);
    // const router = createMemoryRouter(
    //   [
    //     {
    //       path: initialPathForRouting,
    //       element: <OrganizationOverviewPage />,
    //       loader: () => organizationMockBuilder.withId(3).build(),
    //       action: async ({ request }: ActionFunctionArgs) =>
    //         action(await request.json()),
    //     },
    //   ],
    //   { initialEntries: [initialPathForRouting] }
    // );
    //
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
