import { MockedRequest, rest } from 'msw';
import { mswServer } from './mswServer';
import { ApiClient, makeWretchInstance } from './api.client';
import { exampleUser } from '../testUtils/user';
import {
  BalanceSheetJsonMocks,
  BalanceSheetMocks,
} from '../testUtils/balanceSheets';
import { WorkbookResponseMocks } from '../testUtils/workbook';
import { regionsMocks } from '../testUtils/regions';
import { industriesMocks } from '../testUtils/industries';

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
const apiClient = new ApiClient(makeWretchInstance(URL, exampleUser, 'de'));

describe('ApiClient', () => {
  beforeAll(() => mswServer.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => mswServer.resetHandlers());
  afterAll(() => mswServer.close());

  describe('Organization', () => {
    it('returns organizations of user', async () => {
      const organizations = [{ id: 1 }, { id: 3 }];
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
    it('returns balancesheets of user', async () => {
      const balanceSheets = [{ id: 1 }, { id: 4 }];
      mockResource(
        'get',
        `${URL}/v1/balancesheets`,
        new Response(JSON.stringify(balanceSheets))
      );
      const response = await apiClient.getBalanceSheets();
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
