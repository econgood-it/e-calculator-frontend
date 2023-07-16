import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import wretch, { Wretch, WretchOptions, WretchResponse } from 'wretch';
import { User } from '../authentication/User';
import { OrganizationItemsResponseSchema } from '@ecogood/e-calculator-schemas/dist/organization.dto';
import { z } from 'zod';

function language(language: string) {
  return function (
    next: (url: string, opts: WretchOptions) => Promise<WretchResponse>
  ) {
    return async function (url: string, opts: WretchOptions) {
      console.log(opts);
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

export function makeWretchInstance(
  apiUrl: string,
  user: User,
  language: string
) {
  return wretch(`${apiUrl}?lng=${language}`)
    .headers({ Authorization: `Bearer ${user.token}` })
    .resolve((r) =>
      r
        .unauthorized(() => {
          window.location.pathname = '/login';
        })
        .res()
    );
}

type WretchType = Wretch<unknown, unknown, Promise<WretchResponse>>;

export class ApiClient {
  public constructor(
    private axiosInstance: AxiosInstance,
    private wretchInstance: WretchType
  ) {}

  patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.patch(url, data, config);
  }

  post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.post(url, data, config);
  }

  put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.put(url, data, config);
  }

  get<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.get(url, config);
  }

  delete<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.delete(url, config);
  }

  async getOrganizations(): Promise<
    z.infer<typeof OrganizationItemsResponseSchema>
  > {
    const response = await this.wretchInstance.get('/v1/organization');
    return OrganizationItemsResponseSchema.parse(await response.json());
  }
}
