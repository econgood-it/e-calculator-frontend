import { MockedRequest, rest } from 'msw';
import { mswServer } from './mswServer';
import { ApiClient, makeWretchInstance } from './api.client';
import axios from 'axios';
import { exampleUser } from '../testUtils/user';

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
  axios.create(),
  makeWretchInstance(URL, exampleUser, 'de')
);

describe('ApiClient', () => {
  beforeAll(() => mswServer.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => mswServer.resetHandlers());
  afterAll(() => mswServer.close());

  describe('Organization', () => {
    it('returns organizations of user', async () => {
      const organizations = [{ id: 1 }];
      mockResource(
        'get',
        `${URL}/v1/organization`,
        new Response(JSON.stringify(organizations))
      );
      const response = await apiClient.getOrganizations();
      expect(response).toEqual(organizations);
    });
  });
});
