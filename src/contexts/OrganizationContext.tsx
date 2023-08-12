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
  tmpSchema,
} from '../models/Organization';

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

function useActiveOrganization(): [
  Organization | undefined,
  Dispatch<SetStateAction<Organization | undefined>>
] {
  const localeStorageKey = 'activeOrganization';
  const activeOrganizationString =
    window.localStorage.getItem(localeStorageKey);

  const [activeOrganization, setActiveOrganization] = useState(() => {
    return activeOrganizationString
      ? tmpSchema.parse(JSON.parse(activeOrganizationString))
      : undefined;
  });

  useEffect(() => {
    if (activeOrganization !== undefined) {
      window.localStorage.setItem(
        localeStorageKey,
        JSON.stringify(activeOrganization)
      );
    } else {
      window.localStorage.removeItem(localeStorageKey);
    }
  }, [activeOrganization]);

  return [activeOrganization, setActiveOrganization];
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const api = useApi();
  const [organizationItems, setOrganizationItems] = useState<OrganizationItems>(
    []
  );

  const [activeOrganization, setActiveOrganization] = useActiveOrganization();

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
