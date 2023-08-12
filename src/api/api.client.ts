import wretch, { Wretch, WretchOptions, WretchResponse } from 'wretch';
import { User } from '../authentication/User';
import { OrganizationItemsResponseSchema } from '@ecogood/e-calculator-schemas/dist/organization.dto';
import { z } from 'zod';
import {
  BalanceSheet,
  BalanceSheetCreateRequestBody,
  BalanceSheetItem,
  BalanceSheetPatchRequestBody,
} from '../models/BalanceSheet';
import {
  BalanceSheetItemsResponseSchema,
  BalanceSheetResponseBodySchema,
} from '@ecogood/e-calculator-schemas/dist/balance.sheet.dto';
import { WorkbookResponseBodySchema } from '@ecogood/e-calculator-schemas/dist/workbook.dto';
import { RegionResponseBodySchema } from '@ecogood/e-calculator-schemas/dist/region.dto';
import { Region } from '../models/Region';
import { Industry } from '../models/Industry';
import { IndustryResponseBodySchema } from '@ecogood/e-calculator-schemas/dist/industry.dto';
import {
  Organization,
  OrganizationItems,
  tmpSchema,
} from '../models/Organization';

function language(language: string) {
  return function (
    next: (url: string, opts: WretchOptions) => Promise<WretchResponse>
  ) {
    return async function (url: string, opts: WretchOptions) {
      return Promise.resolve(
        next(url, {
          ...opts,
          params: {
            ...opts.params,
            lng: language,
          },
        })
      );
    };
  };
}

export const Middlewares = {
  language: language,
};

export function makeWretchInstanceWithAuth(
  apiUrl: string,
  user: User,
  language: string
) {
  return makeWretchInstance(apiUrl, language)
    .headers({ Authorization: `Bearer ${user.token}` })
    .resolve((r) =>
      r
        .unauthorized(() => {
          window.location.pathname = '/login';
        })
        .res()
    );
}

export function makeWretchInstance(apiUrl: string, language: string) {
  return wretch(`${apiUrl}/v1?lng=${language}`);
}

type WretchType = Wretch<unknown, unknown, Promise<WretchResponse>>;

export class AuthApiClient {
  public constructor(
    private wretchInstance: Wretch<unknown, unknown, undefined>
  ) {}

  async login(email: string, password: string): Promise<User> {
    const response = await this.wretchInstance.post(
      { email, password },
      '/users/token'
    );
    return await response.json();
  }
}

export class ApiClient {
  public constructor(private wretchInstance: WretchType) {}

  async getRegions(): Promise<Region[]> {
    const response = await this.wretchInstance.get('/regions');
    return RegionResponseBodySchema.array().parse(await response.json());
  }

  async getIndustries(): Promise<Industry[]> {
    const response = await this.wretchInstance.get('/industries');
    return IndustryResponseBodySchema.array().parse(await response.json());
  }

  async getWorkbook(): Promise<z.infer<typeof WorkbookResponseBodySchema>> {
    const response = await this.wretchInstance.get('/workbook');
    return WorkbookResponseBodySchema.parse(await response.json());
  }

  async getOrganizations(): Promise<OrganizationItems> {
    const response = await this.wretchInstance.get('/organization');
    return OrganizationItemsResponseSchema.parse(await response.json());
  }

  async getOrganization(id: number): Promise<Organization> {
    const response = await this.wretchInstance.get(`/organization/${id}`);
    return tmpSchema.parse(await response.json());
  }

  async getBalanceSheets(organizationId?: number): Promise<BalanceSheetItem[]> {
    const response = organizationId
      ? await this.wretchInstance.get(
          `/organization/${organizationId}/balancesheet`
        )
      : await this.wretchInstance.get('/balancesheets');
    return BalanceSheetItemsResponseSchema.parse(await response.json());
  }

  async getBalanceSheet(id: number): Promise<BalanceSheet> {
    const response = await this.wretchInstance.get(`/balancesheets/${id}`);
    return BalanceSheetResponseBodySchema.parse(await response.json());
  }

  async updateBalanceSheet(
    id: number,
    balanceSheet: BalanceSheetPatchRequestBody
  ): Promise<BalanceSheet> {
    const response = await this.wretchInstance.patch(
      balanceSheet,
      `/balancesheets/${id}`
    );
    return BalanceSheetResponseBodySchema.parse(await response.json());
  }

  async deleteBalanceSheet(id: number) {
    await this.wretchInstance.delete(`/balancesheets/${id}`);
  }

  async createBalanceSheet(
    balanceSheet: BalanceSheetCreateRequestBody,
    organizationId?: number
  ): Promise<BalanceSheet> {
    const response = organizationId
      ? await this.wretchInstance.post(
          balanceSheet,
          `/organization/${organizationId}/balancesheet`
        )
      : await this.wretchInstance.post(balanceSheet, '/balancesheets');
    return BalanceSheetResponseBodySchema.parse(await response.json());
  }
}
