import { Dialog } from '@mui/material';
import { OrganizationForm } from './OrganizationForm';
import { OrganizationRequestBody } from '../../models/Organization';
import { useOrganizations } from '../../contexts/OrganizationContext';

type OrganizationDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function OrganizationCreationDialog({
  open,
  setOpen,
}: OrganizationDialogProps) {
  const { createOrganization } = useOrganizations();
  async function onSave(organization: OrganizationRequestBody) {
    await createOrganization(organization);
    setOpen(false);
  }
  return (
    <Dialog open={open}>
      <OrganizationForm organization={undefined} onSave={onSave} />
    </Dialog>
  );
}
