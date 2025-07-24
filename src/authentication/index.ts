import { useAuth } from 'oidc-react';
import { useMemo } from 'react';
import { User } from 'oidc-react';
import { SignoutRedirectArgs } from 'oidc-client-ts';

export type UserContext = {
  userData: User | null | undefined;
  isLoading: boolean;
  signOutRedirect: (args?: SignoutRedirectArgs) => Promise<void>;
  isMemberOfCertificationAuthority: boolean;
};

export function useUser(): UserContext {
  const { userData, isLoading, signOutRedirect } = useAuth();
  const isMemberOfCertificationAuthority = useMemo(() => {
    const zitadelRoleKey = 'urn:zitadel:iam:org:project:roles';
    if (
      userData &&
      userData.profile &&
      Object.prototype.hasOwnProperty.call(userData.profile, zitadelRoleKey)
    ) {
      const roles = userData.profile[zitadelRoleKey];

      return !!(
        roles &&
        (Object.prototype.hasOwnProperty.call(roles, 'auditor') ||
          Object.prototype.hasOwnProperty.call(roles, 'peer'))
      );
    }
    return false;
  }, [userData]);

  return {
    userData,
    isLoading,
    signOutRedirect,
    isMemberOfCertificationAuthority,
  };
}
