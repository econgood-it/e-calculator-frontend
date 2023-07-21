import { createContext, ReactElement, useContext } from 'react';
import { API_URL } from '../configuration';
import { User } from '../authentication/User';
import { useLanguage } from '../i18n';
import { ApiClient, makeWretchInstanceWithAuth } from '../api/api.client';

const ApiContext = createContext<ApiClient | undefined>(undefined);

type ApiProviderProps = {
  user: User;
  children: ReactElement;
};

function ApiProvider({ user, children }: ApiProviderProps) {
  const language = useLanguage();

  return (
    <ApiContext.Provider
      value={new ApiClient(makeWretchInstanceWithAuth(API_URL, user, language))}
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
