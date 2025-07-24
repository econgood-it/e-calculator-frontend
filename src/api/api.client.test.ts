import { MockedRequest, rest } from 'msw';
import { mswServer } from './mswServer.ts';
import {
  ApiClient,
  AuthApiClient,
  makeWretchInstance,
  makeWretchInstanceWithAuth,
} from './api.client.ts';
import { UserMocks } from '../testUtils/user';
import {
  AuditMockBuilder,
  BalanceSheetMockBuilder,
} from '../testUtils/balanceSheets';
import { WorkbookResponseMocks } from '../testUtils/workbook';
import { regionsMocks } from '../testUtils/regions';
import { industriesMocks } from '../testUtils/industries';
import { OrganizationMockBuilder } from '../testUtils/organization';
import { MatrixMockBuilder } from '../testUtils/matrix';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { v4 as uuid4 } from 'uuid';
import {
  BalanceSheetType,
  BalanceSheetVersion,
} from '@ecogood/e-calculator-schemas/dist/shared.schemas';
import { makeWorkbook } from '../models/Workbook.ts';

vi.mock('react-router-dom');

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
        } catch (_) {} // eslint-disable-line no-empty
        return res(...transformers);
      })
    );
  });
}
const URL = 'https://calculator.test.ecogood.org';
const apiClient = new ApiClient(
  makeWretchInstanceWithAuth(URL, UserMocks.default().access_token, 'de')
);
const authApiClient = new AuthApiClient(
  makeWretchInstance(URL, 'en').resolve((r) => r.res())
);

describe('ApiClient', () => {
  beforeAll(() => mswServer.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => mswServer.resetHandlers());
  afterAll(() => mswServer.close());

  describe('User', () => {
    it('should login with credentials', async () => {
      const user = UserMocks.defaultOld();
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
    it('should return invitations of user', async () => {
      const invitations = [
        { id: 1, name: 'Orga1' },
        { id: 2, name: 'Orga2' },
      ];
      const requestPromise = mockResource(
        'get',
        `${URL}/v1/user/me/invitation`,
        new Response(JSON.stringify(invitations))
      );
      const response = await apiClient.getInvitations();
      expect(response).toEqual(invitations);
      await requestPromise;
    });
    it('should let the user join the organization', async () => {
      const organizationId = 3;
      const organization = new OrganizationMockBuilder()
        .withId(organizationId)
        .build();
      const requestPromise = mockResource(
        'patch',
        `${URL}/v1/user/me/invitation/${organizationId}`,
        new Response(JSON.stringify(organization))
      );
      const response = await apiClient.joinOrganization(organizationId);
      expect(response).toEqual(response);
      await requestPromise;
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

    it('updates organization', async () => {
      const orgaBuilder = new OrganizationMockBuilder();
      const id = orgaBuilder.build().id;
      const requestPromise = mockResource(
        'put',
        `${URL}/v1/organization/${id}`,
        new Response(JSON.stringify(orgaBuilder.buildResponseBody()))
      );
      const response = await apiClient.updateOrganization(
        id,
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
    it('invites user to organization', async () => {
      const orgaBuilder = new OrganizationMockBuilder();
      const id = orgaBuilder.build().id;
      const email = `${uuid4()}/example.com`;
      const requestPromise = mockResource(
        'post',
        `${URL}/v1/organization/${id}/invitation/${email}`,
        new Response()
      );
      await apiClient.inviteUserToOrganization(id, email);
      const request = await requestPromise;
      expect(request.url.toString()).toContain(email);
    });
  });

  describe('Workbook', () => {
    it('returns workbook', async () => {
      const workbook = WorkbookResponseMocks.default();
      const requestPromise = mockResource(
        'get',
        `${URL}/v1/workbook`,
        new Response(JSON.stringify(workbook))
      );
      const response = await apiClient.getWorkbook(
        BalanceSheetVersion.v5_1_0,
        BalanceSheetType.Full
      );
      const request = await requestPromise;
      expect(request.url.toString()).toContain(
        '?lng=de&version=5.10&type=Full'
      );
      expect(response).toEqual(makeWorkbook(workbook));
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
      const balanceSheets = [
        {
          id: 8,
          version: BalanceSheetVersion.v5_1_0,
          type: BalanceSheetType.Full,
        },
        {
          id: 9,
          version: BalanceSheetVersion.v5_0_8,
          type: BalanceSheetType.Compact,
        },
      ];
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
      const balanceSheetMockBuilder = new BalanceSheetMockBuilder();
      const requestPromise = mockResource(
        'post',
        `${URL}/v1/balancesheets`,
        new Response(
          JSON.stringify(balanceSheetMockBuilder.buildResponseBody())
        )
      );
      const response = await apiClient.createBalanceSheet(
        balanceSheetMockBuilder.buildRequestBody()
      );
      expect(response).toEqual(balanceSheetMockBuilder.build());

      const request = await requestPromise;
      await expect(request.json()).resolves.toEqual(
        balanceSheetMockBuilder.buildRequestBody()
      );
    });

    it('creates balance sheet belonging to organization', async () => {
      const balanceSheetMockBuilder = new BalanceSheetMockBuilder();
      const organizationId = 2;
      const requestPromise = mockResource(
        'post',
        `${URL}/v1/organization/${organizationId}/balancesheet`,
        new Response(
          JSON.stringify(balanceSheetMockBuilder.buildResponseBody())
        )
      );
      const response = await apiClient.createBalanceSheet(
        balanceSheetMockBuilder.buildRequestBody(),
        organizationId
      );
      expect(response).toEqual(balanceSheetMockBuilder.build());

      const request = await requestPromise;
      await expect(request.json()).resolves.toEqual(
        balanceSheetMockBuilder.buildRequestBody()
      );
    });
    it('returns balance sheet', async () => {
      const balanceSheetMockBuilder = new BalanceSheetMockBuilder();
      mockResource(
        'get',
        `${URL}/v1/balancesheets/${balanceSheetMockBuilder.build().id}`,
        new Response(
          JSON.stringify(balanceSheetMockBuilder.buildResponseBody())
        )
      );
      const response = await apiClient.getBalanceSheet(
        balanceSheetMockBuilder.build().id!
      );
      expect(response).toEqual(balanceSheetMockBuilder.build());
    });

    it('returns balance sheet in matrix representation', async () => {
      const mockId = 6;
      const matrixMockBuilder = new MatrixMockBuilder();
      mockResource(
        'get',
        `${URL}/v1/balancesheets/${mockId}/matrix`,
        new Response(JSON.stringify(matrixMockBuilder.build()))
      );
      const response = await apiClient.getBalanceSheetAsMatrix(mockId);
      expect(response).toEqual(matrixMockBuilder.build());
    });

    it('updates balance sheet', async () => {
      const balanceSheetMockBuilder = new BalanceSheetMockBuilder();
      const requestPromise = mockResource(
        'patch',
        `${URL}/v1/balancesheets/${balanceSheetMockBuilder.build().id}`,
        new Response(
          JSON.stringify(balanceSheetMockBuilder.buildResponseBody())
        )
      );
      const response = await apiClient.updateBalanceSheet(
        balanceSheetMockBuilder.build().id!,
        balanceSheetMockBuilder.buildRequestBody()
      );
      expect(response).toEqual(balanceSheetMockBuilder.build());
      const request = await requestPromise;
      await expect(request.json()).resolves.toEqual(
        balanceSheetMockBuilder.buildRequestBody()
      );
    });

    it('deletes balance sheet', async () => {
      const balanceSheet = new BalanceSheetMockBuilder().build();
      mockResource('delete', `${URL}/v1/balancesheets/${balanceSheet.id}`);
      await apiClient.deleteBalanceSheet(balanceSheet.id!);
    });
  });

  describe('Audit', () => {
    it('creates audit', async () => {
      const auditMockBuilder = new AuditMockBuilder();
      const requestPromise = mockResource(
        'post',
        `${URL}/v1/audit`,
        new Response(JSON.stringify(auditMockBuilder.buildResponseBody()))
      );
      const requestBody = auditMockBuilder.buildRequestBody();
      const response = await apiClient.submitBalanceSheetToAudit(
        requestBody.balanceSheetToBeSubmitted,
        requestBody.certificationAuthority
      );
      expect(response).toEqual(auditMockBuilder.build());

      const request = await requestPromise;
      await expect(request.json()).resolves.toEqual(requestBody);
    });

    it('does not find audit and returns undefined', async () => {
      const balanceSheetId = 9;

      mockResource(
        'get',
        `${URL}/v1/audit?submittedBalanceSheetId=${balanceSheetId}`,
        new Response(JSON.stringify({ message: 'error' }), { status: 404 })
      );
      const response = await apiClient.findAuditByBalanceSheet(
        balanceSheetId,
        'submittedBalanceSheetId'
      );
      expect(response).toBeUndefined();
    });
  });
});
