import wretch, {
  Wretch,
  WretchError,
  WretchOptions,
  WretchResponse,
} from 'wretch';

import {
  OrganizationItemsResponseSchema,
  OrganizationResponseSchema,
} from '@ecogood/e-calculator-schemas/dist/organization.dto';
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
import {
  BalanceSheetType,
  BalanceSheetVersion,
} from '@ecogood/e-calculator-schemas/dist/shared.schemas';
import { makeWorkbook, Workbook } from '../models/Workbook.ts';

import { Audit } from '../models/Audit.ts';
import {
  AuditFullResponseBodySchema,
  AuditSubmitResponseBodySchema,
  CertificationAuthorityNames,
} from '@ecogood/e-calculator-schemas/dist/audit.dto';
import QueryAddon, { QueryStringAddon } from 'wretch/addons/queryString';

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
): WretchType {
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
  return wretch(`${apiUrl}/v1`).addon(QueryAddon).query({ lng: language });
}

type WretchType = QueryStringAddon &
  Wretch<QueryStringAddon, unknown, Promise<WretchResponse>>;

export class AuthApiClient {
  public constructor(private wretchInstance: WretchType) {}

  async login(email: string, password: string): Promise<User> {
    const response = await this.wretchInstance.post(
      { email, password },
      '/users/token'
    );
    return await response.json();
  }
}

function isWretchError(error: unknown): error is WretchError {
  return (error as WretchError).status !== undefined;
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

  async getWorkbook(
    version: BalanceSheetVersion,
    type: BalanceSheetType
  ): Promise<Workbook> {
    const response = await this.wretchInstance
      .query({ version, type })
      .get('/workbook');
    return makeWorkbook(
      WorkbookResponseBodySchema.parse(await response.json())
    );
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

  async submitBalanceSheetToAudit(
    balanceSheetToBeSubmitted: number,
    certificationAuthority: CertificationAuthorityNames
  ): Promise<Audit> {
    const response = await this.wretchInstance.post(
      { balanceSheetToBeSubmitted, certificationAuthority },
      '/audit'
    );
    return AuditSubmitResponseBodySchema.parse(await response.json());
  }

  async findAuditByBalanceSheet(
    balanceSheetId: number,
    searchBy: 'submittedBalanceSheetId' | 'auditCopyId'
  ): Promise<Audit | undefined> {
    const query =
      searchBy === 'submittedBalanceSheetId'
        ? { submittedBalanceSheetId: balanceSheetId }
        : { auditCopyId: balanceSheetId };
    try {
      const response = await this.wretchInstance.query(query).get(`/audit`);
      return AuditSubmitResponseBodySchema.parse(await response.json());
    } catch (error: unknown) {
      if (isWretchError(error) && error.status === 404) {
        return undefined;
      }
      throw error;
    }
  }

  async getAudit(auditId: number): Promise<Audit | undefined> {
    try {
      const response = await this.wretchInstance.get(`/audit/${auditId}`);
      return AuditFullResponseBodySchema.parse(await response.json());
    } catch (error: unknown) {
      if (isWretchError(error) && error.status === 404) {
        return undefined;
      }
      throw error;
    }
  }
  async deleteAudit(id: number) {
    await this.wretchInstance.delete(`/audit/${id}`);
  }
}
