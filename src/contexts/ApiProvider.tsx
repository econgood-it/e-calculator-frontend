import { createContext, ReactElement, useContext, useMemo } from 'react';
import { API_URL } from '../configuration';
import { useLanguage } from '../i18n';
import { ApiClient, makeWretchInstanceWithAuth } from '../api/api.client';
import { useAuth } from 'oidc-react';

const ApiContext = createContext<ApiClient | undefined>(undefined);

type ApiProviderProps = {
  children: ReactElement;
};

function ApiProvider({ children }: ApiProviderProps) {
  const language = useLanguage();
  const { userData } = useAuth();

  const apiClient = useMemo(() => {
    return new ApiClient(
      makeWretchInstanceWithAuth(API_URL, userData!.access_token, language)
    );
  }, [language, userData]);

  return (
    <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>
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
