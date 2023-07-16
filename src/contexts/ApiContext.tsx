import axios from 'axios';
import { createContext, ReactElement, useContext } from 'react';
import { API_URL } from '../configuration';
import { User } from '../authentication/User';
import { useLanguage } from '../i18n';
import { ApiClient, makeWretchInstance } from '../api/api.client';

const ApiContext = createContext<ApiClient | undefined>(undefined);

type ApiProviderProps = {
  user: User;
  children: ReactElement;
};

function ApiProvider({ user, children }: ApiProviderProps) {
  const language = useLanguage();
  const api = axios.create({ baseURL: `${API_URL}/` });

  api.interceptors.request.use(async (config) => {
    config.headers = {
      ...config?.headers,
      Authorization: `Bearer ${user.token}`,
    };
    config.params = { ...config?.params, lng: language };
    return config;
  });

  api.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    function (error) {
      if (error?.response?.status === 401) {
        window.location.pathname = '/login';
      }
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    }
  );
  return (
    <ApiContext.Provider
      value={new ApiClient(api, makeWretchInstance(API_URL, user, language))}
    >
      {children}
    </ApiContext.Provider>
  );
}

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be within ApiProvider');
  }

  return context;
};
export { ApiProvider };
