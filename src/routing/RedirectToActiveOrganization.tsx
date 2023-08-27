import { useOrganizations } from '../contexts/OrganizationContext';

import { Navigate } from 'react-router-dom';
import { LoadingPage } from '../pages/LoadingPage';

export function RedirectToActiveOrganization() {
  const { activeOrganization } = useOrganizations();

  if (activeOrganization?.id === undefined) {
    return <LoadingPage />;
  }

  return <Navigate to={`/organization/${activeOrganization.id}`} />;
}
