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
import { useApi } from './ApiProvider';
import {
  Organization,
  OrganizationItems,
  OrganizationRequestBody,
} from '../models/Organization';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingPage } from '../pages/LoadingPage';
import { useAuth } from 'oidc-react';

interface IOrganizationContext {
  organizationItems: OrganizationItems;
  activeOrganization: Organization | undefined;
  setActiveOrganizationById: (id: number) => void;
  createOrganization: (organization: OrganizationRequestBody) => Promise<void>;
  updateActiveOrganization: (
    organization: OrganizationRequestBody
  ) => Promise<void>;
}

const OrganizationContext = createContext<IOrganizationContext | undefined>(
  undefined
);

type OrganizationProviderProps = {
  children: ReactElement;
};

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const api = useApi();
  const { userData } = useAuth();
  const [organizationItems, setOrganizationItems] = useState<
    OrganizationItems | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      const response = await api.getOrganizations();
      setOrganizationItems(response);
    })();
  }, []);

  function addOrganizationItem(
    organizationId: number,
    organizationName: string
  ) {
    setOrganizationItems((prevState) =>
      prevState?.concat({ id: organizationId, name: organizationName })
    );
  }

  function renameOrganizationItem(id: number, newName: string) {
    setOrganizationItems((prevState) =>
      prevState?.map((item) =>
        item.id === id ? { ...item, name: newName } : item
      )
    );
  }

  if (!organizationItems) {
    return <LoadingPage />;
  }

  return (
    <WithActiveOrganization
      organizationItems={organizationItems}
      userId={userData!.profile!.sub}
      addOrganizationItem={addOrganizationItem}
      renameOrganizationItem={renameOrganizationItem}
    >
      {children}
    </WithActiveOrganization>
  );
}

function WithActiveOrganization({
  organizationItems,
  renameOrganizationItem,
  userId,
  addOrganizationItem,
  children,
}: {
  userId: string;
  organizationItems: OrganizationItems;
  renameOrganizationItem: (id: number, newName: string) => void;
  addOrganizationItem: (
    organizationId: number,
    organizationName: string
  ) => void;
  children: ReactElement;
}) {
  const api = useApi();
  const [
    activeOrganization,
    setActiveOrganizationById,
    updateActiveOrganization,
  ] = useActiveOrganization(userId, organizationItems);
  const navigate = useNavigate();

  async function createOrganization(organization: OrganizationRequestBody) {
    const newOrganization = await api.createOrganization(organization);
    addOrganizationItem(newOrganization.id, newOrganization.name);
    setActiveOrganizationById(newOrganization.id);
    navigate(`/organization/${newOrganization.id}`);
  }

  async function updateActiveOrganizationAndUpdateItems(
    organization: OrganizationRequestBody
  ) {
    await updateActiveOrganization(organization);
    renameOrganizationItem(activeOrganization!.id, organization.name);
  }

  return (
    <OrganizationContext.Provider
      value={{
        organizationItems,
        activeOrganization,
        setActiveOrganizationById,
        createOrganization,
        updateActiveOrganization: updateActiveOrganizationAndUpdateItems,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

function useOrganizationStorage(
  userId: string
): [number, (activeOrganizationId: number) => void] {
  const localeStorageKey = 'activeOrganizationId';

  const organizationIdFromStorage = Number(
    JSON.parse(window.localStorage.getItem(userId) || JSON.stringify({}))[
      localeStorageKey
    ]
  );

  const writeOrganizationIdToStorage = useCallback(
    (activeOrganizationId: number) => {
      window.localStorage.setItem(
        userId,
        JSON.stringify({ [localeStorageKey]: activeOrganizationId })
      );
    },
    [userId, localeStorageKey]
  );

  return [organizationIdFromStorage, writeOrganizationIdToStorage];
}

function useActiveOrganization(
  userId: string,
  organizationItems: OrganizationItems
): [
  Organization | undefined,
  Dispatch<SetStateAction<number | undefined>>,
  (organization: OrganizationRequestBody) => Promise<void>
] {
  const api = useApi();
  const { orgaId: organizationIdFromUrl } = useParams();
  const [localStorageId, setLocalStorageId] = useOrganizationStorage(userId);

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

  async function updateActiveOrganization(
    organization: OrganizationRequestBody
  ) {
    await api.updateOrganization(activeOrganizationId!, organization);
    setActiveOrganization({ id: activeOrganizationId!, ...organization });
  }

  useEffect(() => {
    if (activeOrganizationId) {
      (async () => {
        setActiveOrganization(await api.getOrganization(activeOrganizationId));
        setLocalStorageId(activeOrganizationId);
      })();
    }
  }, [activeOrganizationId]);

  return [
    activeOrganization,
    setActiveOrganizationById,
    updateActiveOrganization,
  ];
}

export function useOrganizations(): IOrganizationContext {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganizations must be within OrganizationProvider');
  }
  return context;
}
