import { useEffect, useState } from 'react';
import { useApi } from '../contexts/ApiContext';
import { Organization } from '../models/Organization';

export function useOrganization(): { organization: Organization | undefined } {
  const api = useApi();
  const [organization, setOrganization] = useState<Organization | undefined>();
  useEffect(() => {
    (async () => {
      const organizationItem = (await api.getOrganizations()).at(0);
      if (organizationItem) {
        setOrganization(await api.getOrganization(organizationItem.id));
      }
    })();
  }, []);
  return { organization };
}
