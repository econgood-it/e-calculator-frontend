import { MockedRequest, rest } from 'msw';
import { mswServer } from './mswServer';
import {
  ApiClient,
  AuthApiClient,
  makeWretchInstance,
  makeWretchInstanceWithAuth,
} from './api.client';
import { exampleUser, UserMocks } from '../testUtils/user';
import {
  BalanceSheetJsonMocks,
  BalanceSheetMocks,
} from '../testUtils/balanceSheets';
import { WorkbookResponseMocks } from '../testUtils/workbook';
import { regionsMocks } from '../testUtils/regions';
import { industriesMocks } from '../testUtils/industries';
import { OrganizationMockBuilder } from '../testUtils/organization';

jest.mock('react-router-dom');

function mockResource(
  method: keyof typeof rest,
  path: string,
  response?: Response
) {
  return new Promise<MockedRequest>((resolve) => {
    mswServer.use(
      rest[method](path, async (req, res, ctx) => {
        resolve(req);

        if (!response) {
          response = new Response();
        }

        const transformers = [
          ctx.status(response.status),
          ctx.set(Object.fromEntries(response.headers.entries())),
        ];
        try {
          const body = await response.json();
          transformers.push(ctx.json(body));
        } catch (_) {}
        return res(...transformers);
      })
    );
  });
}
const URL = 'https://calculator.test.ecogood.org';
const apiClient = new ApiClient(
  makeWretchInstanceWithAuth(URL, exampleUser, 'de')
);
const authApiClient = new AuthApiClient(makeWretchInstance(URL, 'en'));

describe('ApiClient', () => {
  beforeAll(() => mswServer.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => mswServer.resetHandlers());
  afterAll(() => mswServer.close());

  describe('User', () => {
    it('should login with credentials', async () => {
      const user = UserMocks.default();
      const credentials = {
        email: 'user@example.com',
        password: 'fjdklsareuqjkdjfkl',
      };
      const requestPromise = mockResource(
        'post',
        `${URL}/v1/users/token`,
        new Response(JSON.stringify(user))
      );
      const response = await authApiClient.login(
        credentials.email,
        credentials.password
      );
      expect(response).toEqual(user);
      const request = await requestPromise;
      await expect(request.json()).resolves.toEqual(credentials);
    });
  });

  describe('Organization', () => {
    it('creates organization', async () => {
      const orgaBuilder = new OrganizationMockBuilder();
      const requestPromise = mockResource(
        'post',
        `${URL}/v1/organization`,
        new Response(JSON.stringify(orgaBuilder.buildResponseBody()))
      );
      const response = await apiClient.createOrganization(
        orgaBuilder.buildRequestBody()
      );
      expect(response).toEqual(orgaBuilder.build());

      const request = await requestPromise;
      await expect(request.json()).resolves.toEqual(
        orgaBuilder.buildRequestBody()
      );
    });
    it('returns organizations of user', async () => {
      const organizations = [
        { id: 1, name: 'Orga 1' },
        { id: 3, name: 'Orga 2' },
      ];
      const requestPromise = mockResource(
        'get',
        `${URL}/v1/organization`,
        new Response(JSON.stringify(organizations))
      );
      const response = await apiClient.getOrganizations();
      expect(response).toEqual(organizations);
      const request = await requestPromise;
      expect(request.url.toString()).toContain('?lng=de');
    });
    it('returns organization', async () => {
      const orgaBuilder = new OrganizationMockBuilder();
      const id = 1;
      mockResource(
        'get',
        `${URL}/v1/organization/${id}`,
        new Response(JSON.stringify(orgaBuilder.buildResponseBody()))
      );
      const response = await apiClient.getOrganization(id);
      expect(response).toEqual(orgaBuilder.build());
    });
  });

  describe('Workbook', () => {
    it('returns workbook', async () => {
      const workbook = WorkbookResponseMocks.default();
      mockResource(
        'get',
        `${URL}/v1/workbook`,
        new Response(JSON.stringify(workbook))
      );
      const response = await apiClient.getWorkbook();
      expect(response).toEqual(workbook);
    });
  });

  describe('Regions', () => {
    it('returns regions', async () => {
      const regions = regionsMocks.regions1();
      mockResource(
        'get',
        `${URL}/v1/regions`,
        new Response(JSON.stringify(regions))
      );
      const response = await apiClient.getRegions();
      expect(response).toEqual(regions);
    });
  });

  describe('Industries', () => {
    it('returns industries', async () => {
      const industries = industriesMocks.industries1();
      mockResource(
        'get',
        `${URL}/v1/industries`,
        new Response(JSON.stringify(industries))
      );
      const response = await apiClient.getIndustries();
      expect(response).toEqual(industries);
    });
  });

  describe('BalanceSheet', () => {
    it('returns balancesheets of organization', async () => {
      const balanceSheets = [{ id: 8 }, { id: 9 }];
      const organizationId = 2;
      mockResource(
        'get',
        `${URL}/v1/organization/${organizationId}/balancesheet`,
        new Response(JSON.stringify(balanceSheets))
      );
      const response = await apiClient.getBalanceSheets(organizationId);
      expect(response).toEqual(balanceSheets);
    });

    it('creates balancesheet', async () => {
      const balanceSheet = BalanceSheetJsonMocks.request();
      const requestPromise = mockResource(
        'post',
        `${URL}/v1/balancesheets`,
        new Response(JSON.stringify(BalanceSheetMocks.balanceSheet1()))
      );
      const response = await apiClient.createBalanceSheet(balanceSheet);
      expect(response).toEqual(BalanceSheetMocks.balanceSheet1());

      const request = await requestPromise;
      await expect(request.json()).resolves.toEqual(balanceSheet);
    });

    it('creates balance sheet belonging to organization', async () => {
      const balanceSheet = BalanceSheetJsonMocks.request();
      const organizationId = 2;
      const requestPromise = mockResource(
        'post',
        `${URL}/v1/organization/${organizationId}/balancesheet`,
        new Response(JSON.stringify(BalanceSheetMocks.balanceSheet1()))
      );
      const response = await apiClient.createBalanceSheet(
        balanceSheet,
        organizationId
      );
      expect(response).toEqual(BalanceSheetMocks.balanceSheet1());

      const request = await requestPromise;
      await expect(request.json()).resolves.toEqual(balanceSheet);
    });
    it('returns balance sheet', async () => {
      const balanceSheet = BalanceSheetMocks.balanceSheet1();
      mockResource(
        'get',
        `${URL}/v1/balancesheets/${balanceSheet.id}`,
        new Response(JSON.stringify(balanceSheet))
      );
      const response = await apiClient.getBalanceSheet(balanceSheet.id!);
      expect(response).toEqual(balanceSheet);
    });

    it('updates balance sheet', async () => {
      const balanceSheetJson = BalanceSheetJsonMocks.request();
      const balanceSheet = BalanceSheetMocks.balanceSheet1();
      const requestPromise = mockResource(
        'patch',
        `${URL}/v1/balancesheets/${balanceSheet.id}`,
        new Response(JSON.stringify(balanceSheet))
      );
      const response = await apiClient.updateBalanceSheet(
        balanceSheet.id!,
        balanceSheetJson
      );
      expect(response).toEqual(balanceSheet);
      const request = await requestPromise;
      await expect(request.json()).resolves.toEqual(balanceSheetJson);
    });

    it('deletes balance sheet', async () => {
      const balanceSheet = BalanceSheetMocks.balanceSheet1();
      mockResource('delete', `${URL}/v1/balancesheets/${balanceSheet.id}`);
      await apiClient.deleteBalanceSheet(balanceSheet.id!);
    });
  });
});
