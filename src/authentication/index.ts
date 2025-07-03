import { useAuth } from 'oidc-react';
import { useCallback } from 'react';

export function useUser() {
  const { userData, isLoading, signOutRedirect } = useAuth();
  const isMemberOfCertificationAuthority = useCallback(() => {
    const zitadelRoleKey = 'urn:zitadel:iam:org:project:roles';
    if (userData?.profile?.hasOwnProperty( zitadelRoleKey ) ) {
      const roles = userData.profile[zitadelRoleKey];
      return roles?.hasOwnProperty('auditor') || roles?.hasOwnProperty('peer');
    }
    return false;
  }, [userData?.profile]);
  return { userData, isLoading, signOutRedirect, isMemberOfCertificationAuthority };
}
