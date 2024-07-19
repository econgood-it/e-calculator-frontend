import wretch, { Wretch, WretchOptions, WretchResponse } from 'wretch';

import {
  OrganizationItemsResponseSchema,
  OrganizationResponseSchema,
} from '@ecogood/e-calculator-schemas/dist/organization.dto';
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
  OrganizationRequestBody,
} from '../models/Organization';
import { MatrixBodySchema } from '@ecogood/e-calculator-schemas/dist/matrix.dto';
import { Matrix } from '../models/Matrix';
import { User } from 'oidc-react';
import { Invitation } from '../models/User.ts';
import { UserInvitationResponseSchema } from '@ecogood/e-calculator-schemas/dist/user.schema';

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
  accessToken: string,
  language: string
) {
  return makeWretchInstance(apiUrl, language)
    .headers({ Authorization: `Bearer ${accessToken}` })
    .resolve((r) =>
      r
        .unauthorized(() => {
          window.location.pathname = '/';
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

export function createApiClient(wretchInstance: WretchType): ApiClient {
  return new ApiClient(wretchInstance);
}

export class ApiClient {
  public constructor(private wretchInstance: WretchType) {}

  async getInvitations(): Promise<Invitation[]> {
    const response = await this.wretchInstance.get('/user/me/invitation');
    return UserInvitationResponseSchema.array().parse(await response.json());
  }

  async joinOrganization(organizationId: number): Promise<Organization> {
    const response = await this.wretchInstance.patch(
      {},
      `/user/me/invitation/${organizationId}`
    );
    return OrganizationResponseSchema.parse(await response.json());
  }

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

  async createOrganization(
    organization: OrganizationRequestBody
  ): Promise<Organization> {
    const response = await this.wretchInstance.post(
      organization,
      '/organization'
    );
    return OrganizationResponseSchema.parse(await response.json());
  }

  async updateOrganization(
    id: number,
    organization: OrganizationRequestBody
  ): Promise<Organization> {
    const response = await this.wretchInstance.put(
      organization,
      `/organization/${id}`
    );
    return OrganizationResponseSchema.parse(await response.json());
  }

  async getOrganizations(): Promise<OrganizationItems> {
    const response = await this.wretchInstance.get('/organization');
    return OrganizationItemsResponseSchema.parse(await response.json());
  }

  async getOrganization(id: number): Promise<Organization> {
    const response = await this.wretchInstance.get(`/organization/${id}`);
    return OrganizationResponseSchema.parse(await response.json());
  }

  async inviteUserToOrganization(organizationId: number, email: string) {
    return await this.wretchInstance.post(
      { email },
      `/organization/${organizationId}/invitation/${email}`
    );
  }

  async getBalanceSheets(organizationId: number): Promise<BalanceSheetItem[]> {
    const response = await this.wretchInstance.get(
      `/organization/${organizationId}/balancesheet`
    );

    return BalanceSheetItemsResponseSchema.parse(await response.json());
  }

  async getBalanceSheet(id: number): Promise<BalanceSheet> {
    const response = await this.wretchInstance.get(`/balancesheets/${id}`);
    return BalanceSheetResponseBodySchema.parse(await response.json());
  }

  async getBalanceSheetAsMatrix(id: number): Promise<Matrix> {
    const response = await this.wretchInstance.get(
      `/balancesheets/${id}/matrix`
    );
    return MatrixBodySchema.parse(await response.json());
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
