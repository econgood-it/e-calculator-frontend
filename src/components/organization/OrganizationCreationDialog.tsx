import { DialogContent, DialogTitle } from '@mui/material';
import { ReactElement } from 'react';
import { Trans } from 'react-i18next';
import { OrganizationRequestBody } from '../../models/Organization';
import GridContainer from '../layout/GridContainer';
import GridItem from '../layout/GridItem';
import { ClosableDialog } from '../lib/ClosableDialog';
import { FullScreenDialog } from '../lib/FullScreenDialog';
import { OrganizationForm } from './OrganizationForm';

type OrganizationDialogProps = {
  open: boolean;
  onClose: () => void;
  fullScreen: boolean;
  onCreateClicked: (organization: OrganizationRequestBody) => Promise<void>;
};

export function OrganizationCreationDialog({
  open,
  onClose,
  onCreateClicked,
  fullScreen,
}: OrganizationDialogProps) {
  async function onSave(organization: OrganizationRequestBody) {
    await onCreateClicked(organization);
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

type DialogComponentProps = {
  open: boolean;
  onClose: () => void;
  fullScreen: boolean;
  children: ReactElement;
};

function DialogComponent({
  open,
  onClose,
  fullScreen,
  children,
}: DialogComponentProps) {
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
