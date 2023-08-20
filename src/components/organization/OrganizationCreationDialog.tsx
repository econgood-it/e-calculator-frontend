import { DialogContent, DialogTitle } from '@mui/material';
import { OrganizationForm } from './OrganizationForm';
import { OrganizationRequestBody } from '../../models/Organization';
import { useOrganizations } from '../../contexts/OrganizationContext';
import { Trans } from 'react-i18next';
import { ClosableDialog } from '../lib/ClosableDialog';

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
    <ClosableDialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>
        <Trans>Your organization</Trans>
      </DialogTitle>
      <DialogContent>
        <OrganizationForm organization={undefined} onSave={onSave} />
      </DialogContent>
    </ClosableDialog>
  );
}
