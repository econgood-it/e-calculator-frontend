import {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useApi } from './ApiContext';
import {
  Organization,
  OrganizationItems,
  OrganizationRequestBody,
} from '../models/Organization';

interface IOrganizationContext {
  organizationItems: OrganizationItems;
  activeOrganization: Organization | undefined;
  setActiveOrganizationById: Dispatch<SetStateAction<number | undefined>>;
  createOrganization: (organization: OrganizationRequestBody) => Promise<void>;
  isLoading: boolean;
}

const OrganizationContext = createContext<IOrganizationContext | undefined>(
  undefined
);

type OrganizationProviderProps = {
  children: ReactElement;
};

function useActiveOrganization(): [
  Organization | undefined,
  Dispatch<SetStateAction<number | undefined>>
] {
  const api = useApi();
  const localeStorageKey = 'activeOrganizationId';
  const localStorageValue = window.localStorage.getItem(localeStorageKey);

  const [activeOrganizationId, setActiveOrganizationById] = useState<
    number | undefined
  >(localStorageValue ? Number(localStorageValue) : undefined);

  const [activeOrganization, setActiveOrganization] = useState<
    Organization | undefined
  >();

  useEffect(() => {
    if (activeOrganizationId) {
      (async () => {
        setActiveOrganization(await api.getOrganization(activeOrganizationId));
        window.localStorage.setItem(
          localeStorageKey,
          JSON.stringify(activeOrganizationId)
        );
      })();
    } else {
      setActiveOrganization(undefined);
      window.localStorage.removeItem(localeStorageKey);
    }
  }, [activeOrganizationId]);

  return [activeOrganization, setActiveOrganizationById];
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const api = useApi();
  const [organizationItems, setOrganizationItems] = useState<OrganizationItems>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [activeOrganization, setActiveOrganizationById] =
    useActiveOrganization();

  async function createOrganization(organization: OrganizationRequestBody) {
    const newOrganization = await api.createOrganization(organization);
    setOrganizationItems((prevState) =>
      prevState.concat({ id: newOrganization.id })
    );
    setActiveOrganizationById(newOrganization.id);
  }

  useEffect(() => {
    (async () => {
      setOrganizationItems(await api.getOrganizations());
      setIsLoading(false);
    })();
  }, []);

  return (
    <OrganizationContext.Provider
      value={{
        organizationItems,
        activeOrganization,
        setActiveOrganizationById,
        createOrganization,
        isLoading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizations(): IOrganizationContext {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganizations must be within OrganizationProvider');
  }
  return context;
}
