import {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
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
import { useParams } from 'react-router-dom';
import { LoadingPage } from '../pages/LoadingPage';

interface IOrganizationContext {
  organizationItems: OrganizationItems;
  activeOrganization: Organization | undefined;
  setActiveOrganizationById: (id: number) => void;
  createOrganization: (organization: OrganizationRequestBody) => Promise<void>;
}

const OrganizationContext = createContext<IOrganizationContext | undefined>(
  undefined
);

type OrganizationProviderProps = {
  user: User;
  children: ReactElement;
};

export function OrganizationProvider({
  children,
  user,
}: OrganizationProviderProps) {
  const api = useApi();
  const [organizationItems, setOrganizationItems] = useState<
    OrganizationItems | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      const response = await api.getOrganizations();

      setOrganizationItems(response);
    })();
  }, []);

  function addOrganizationItem(organizationId: number) {
    setOrganizationItems((prevState) =>
      prevState?.concat({ id: organizationId })
    );
  }
  if (!organizationItems) {
    return <LoadingPage />;
  }

  return (
    <WithActiveOrganization
      organizationItems={organizationItems}
      user={user}
      addOrganizationItem={addOrganizationItem}
    >
      {children}
    </WithActiveOrganization>
  );
}

function WithActiveOrganization({
  organizationItems,
  user,
  addOrganizationItem,
  children,
}: {
  user: User;
  organizationItems: OrganizationItems;
  addOrganizationItem: (organizationId: number) => void;
  children: ReactElement;
}) {
  const api = useApi();
  const [activeOrganization, setActiveOrganizationById] = useActiveOrganization(
    user,
    organizationItems
  );

  async function createOrganization(organization: OrganizationRequestBody) {
    const newOrganization = await api.createOrganization(organization);
    addOrganizationItem(newOrganization.id);
    setActiveOrganizationById(newOrganization.id);
  }
  return (
    <OrganizationContext.Provider
      value={{
        organizationItems,
        activeOrganization,
        setActiveOrganizationById,
        createOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

function useOrganizationStorage(
  user: User
): [number, (activeOrganizationId: number) => void] {
  const localeStorageKey = 'activeOrganizationId';

  const organizationIdFromStorage = Number(
    JSON.parse(
      window.localStorage.getItem(user.user.toString()) || JSON.stringify({})
    )[localeStorageKey]
  );

  const writeOrganizationIdToStorage = useCallback(
    (activeOrganizationId: number) => {
      window.localStorage.setItem(
        user.user.toString(),
        JSON.stringify({ [localeStorageKey]: activeOrganizationId })
      );
    },
    [user, localeStorageKey]
  );

  return [organizationIdFromStorage, writeOrganizationIdToStorage];
}

function useActiveOrganization(
  user: User,
  organizationItems: OrganizationItems
): [Organization | undefined, Dispatch<SetStateAction<number | undefined>>] {
  const api = useApi();
  const { orgaId: organizationIdFromUrl } = useParams();
  const [localStorageId, setLocalStorageId] = useOrganizationStorage(user);

  const [activeOrganizationId, setActiveOrganizationById] = useState<
    number | undefined
  >(
    (organizationIdFromUrl &&
      organizationItems.find((o) => o.id === Number(organizationIdFromUrl))
        ?.id) ||
      localStorageId ||
      organizationItems.at(0)?.id
  );

  const [activeOrganization, setActiveOrganization] = useState<
    Organization | undefined
  >();

  useEffect(() => {
    if (activeOrganizationId) {
      (async () => {
        setActiveOrganization(await api.getOrganization(activeOrganizationId));
        setLocalStorageId(activeOrganizationId);
      })();
    }
  }, [activeOrganizationId]);

  return [activeOrganization, setActiveOrganizationById];
}

export function useOrganizations(): IOrganizationContext {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganizations must be within OrganizationProvider');
  }
  return context;
}
