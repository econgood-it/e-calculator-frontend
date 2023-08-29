import { createContext, ReactElement, useContext } from 'react';
import { API_URL } from '../configuration';
import { useLanguage } from '../i18n';
import { ApiClient, makeWretchInstanceWithAuth } from '../api/api.client';
import { useUser } from './UserProvider';

const ApiContext = createContext<ApiClient | undefined>(undefined);

type ApiProviderProps = {
  children: ReactElement;
};

function ApiProvider({ children }: ApiProviderProps) {
  const language = useLanguage();
  const { user } = useUser();

  return (
    <ApiContext.Provider
      value={
        new ApiClient(makeWretchInstanceWithAuth(API_URL, user!, language))
      }
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
