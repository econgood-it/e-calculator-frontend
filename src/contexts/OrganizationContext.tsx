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
import { User } from '../authentication/User';
import _ from 'lodash';

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
  user: User;
  children: ReactElement;
};

function useActiveOrganization(
  user: User
): [Organization | undefined, Dispatch<SetStateAction<number | undefined>>] {
  const api = useApi();
  const localeStorageKey = 'activeOrganizationId';
  const localStorageValue = getCurrentStorageValue()[localeStorageKey];

  const [activeOrganizationId, setActiveOrganizationById] = useState<
    number | undefined
  >(localStorageValue ? Number(localStorageValue) : undefined);

  const [activeOrganization, setActiveOrganization] = useState<
    Organization | undefined
  >();

  function getCurrentStorageValue() {
    return JSON.parse(
      window.localStorage.getItem(user.user.toString()) || JSON.stringify({})
    );
  }

  useEffect(() => {
    if (activeOrganizationId) {
      (async () => {
        setActiveOrganization(await api.getOrganization(activeOrganizationId));
        window.localStorage.setItem(
          user.user.toString(),
          JSON.stringify({ [localeStorageKey]: activeOrganizationId })
        );
      })();
    } else {
      setActiveOrganization(undefined);
      window.localStorage.setItem(
        user.user.toString(),
        JSON.stringify(_.omit(getCurrentStorageValue(), localeStorageKey))
      );
    }
  }, [activeOrganizationId]);

  return [activeOrganization, setActiveOrganizationById];
}

export function OrganizationProvider({
  children,
  user,
}: OrganizationProviderProps) {
  const api = useApi();
  const [organizationItems, setOrganizationItems] = useState<OrganizationItems>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [activeOrganization, setActiveOrganizationById] =
    useActiveOrganization(user);

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
