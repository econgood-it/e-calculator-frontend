import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useApi } from './ApiContext';
import { Organization, OrganizationItems } from '../models/Organization';

interface IOrganizationContext {
  organizationItems: OrganizationItems;
  activeOrganization: Organization | undefined;
  setActiveOrganizationById: (id: number | undefined) => Promise<void>;
}

const OrganizationContext = createContext<IOrganizationContext | undefined>(
  undefined
);

type OrganizationProviderProps = {
  children: ReactElement;
};

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const api = useApi();
  const [organizationItems, setOrganizationItems] = useState<OrganizationItems>(
    []
  );
  const [activeOrganization, setActiveOrganization] = useState<
    Organization | undefined
  >();

  async function setActiveOrganizationById(id: number | undefined) {
    if (id !== undefined) {
      setActiveOrganization(await api.getOrganization(id));
    } else {
      setActiveOrganization(undefined);
    }
  }
  useEffect(() => {
    (async () => {
      setOrganizationItems(await api.getOrganizations());
    })();
  }, []);

  return (
    <OrganizationContext.Provider
      value={{
        organizationItems,
        activeOrganization,
        setActiveOrganizationById,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizations(): {
  organizationItems: OrganizationItems;
  activeOrganization: Organization | undefined;
  setActiveOrganizationById: (id: number | undefined) => Promise<void>;
} {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganizations must be within OrganizationProvider');
  }
  return {
    organizationItems: context.organizationItems,
    activeOrganization: context.activeOrganization,
    setActiveOrganizationById: context.setActiveOrganizationById,
  };
}
