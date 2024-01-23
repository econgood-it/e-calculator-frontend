import { DialogContent, DialogTitle } from '@mui/material';
import { OrganizationForm } from './OrganizationForm';
import { OrganizationRequestBody } from '../../models/Organization';
import { useOrganizations } from '../../contexts/OrganizationProvider';
import { Trans } from 'react-i18next';
import { ClosableDialog } from '../lib/ClosableDialog';
import GridContainer from '../layout/GridContainer';
import GridItem from '../layout/GridItem';
import { ReactElement } from 'react';
import { FullScreenDialog } from '../lib/FullScreenDialog';

type OrganizationDialogProps = {
  open: boolean;
  onClose: () => void;
  fullScreen: boolean;
};

export function OrganizationCreationDialog({
  open,
  onClose,
  fullScreen,
}: OrganizationDialogProps) {
  const { createOrganization } = useOrganizations();
  async function onSave(organization: OrganizationRequestBody) {
    await createOrganization(organization);
    onClose();
  }

  return (
    <DialogComponent open={open} onClose={onClose} fullScreen={fullScreen}>
      <>
        <DialogTitle variant={'h1'}>
          <Trans>Create organization</Trans>
        </DialogTitle>
        <DialogContent>
          <GridContainer spacing={3}>
            <GridItem xs={12}>
              <Trans>
                Please create an organization to be able to create balance
                sheets for it later.
              </Trans>
            </GridItem>
            <GridItem xs={12}>
              <OrganizationForm organization={undefined} onSave={onSave} />
            </GridItem>
          </GridContainer>
        </DialogContent>
      </>
    </DialogComponent>
  );
}

function DialogComponent({
  open,
  onClose,
  fullScreen,
  children,
}: OrganizationDialogProps & { children: ReactElement }) {
  if (!fullScreen) {
    return (
      <ClosableDialog
        fullWidth
        maxWidth={'md'}
        onCloseIconClicked={() => onClose()}
        open={open}
        onClose={() => onClose()}
      >
        {children}
      </ClosableDialog>
    );
  } else {
    return <FullScreenDialog open={open}>{children}</FullScreenDialog>;
  }
}
