import { useOrganizations } from '../contexts/OrganizationProvider';
import { useState } from 'react';
import { OrganizationCreationDialog } from '../components/organization/OrganizationCreationDialog';
import { Outlet } from 'react-router-dom';

export function RequireActiveOrganization() {
  const { organizationItems } = useOrganizations();
  const noOrganizationYet = organizationItems.length === 0;

  const [organizationDialogOpen, setOrganizationDialogOpen] =
    useState<boolean>(true);

  if (noOrganizationYet) {
    return (
      <>
        <OrganizationCreationDialog
          fullScreen={true}
          open={organizationDialogOpen}
          onClose={() => setOrganizationDialogOpen(false)}
        />
      </>
    );
  } else {
    return <Outlet />;
  }
}
