import { useEffect, useState } from 'react';
import { useApi } from '../contexts/ApiContext';
import { Organization, OrganizationItems } from '../models/Organization';

export function useOrganizations(): {
  organizationItems: OrganizationItems;
  activeOrganization: Organization | undefined;
  setActiveOrganizationById: (id: number) => Promise<void>;
} {
  const api = useApi();
  const [organizationItems, setOrganizationItems] = useState<OrganizationItems>(
    []
  );
  const [activeOrganization] = useState<Organization | undefined>();

  async function setActiveOrganizationById(id: number) {
    await api.getOrganization(id);
  }
  useEffect(() => {
    (async () => {
      setOrganizationItems(await api.getOrganizations());
    })();
  }, []);
  return {
    organizationItems,
    activeOrganization: activeOrganization,
    setActiveOrganizationById,
  };
}
