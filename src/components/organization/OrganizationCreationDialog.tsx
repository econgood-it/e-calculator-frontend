import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { OrganizationForm } from './OrganizationForm';
import { OrganizationRequestBody } from '../../models/Organization';
import { useOrganizations } from '../../contexts/OrganizationContext';
import { Trans } from 'react-i18next';
import { ClosableDialog } from '../lib/ClosableDialog';
import GridContainer from '../layout/GridContainer';
import GridItem from '../layout/GridItem';
import React, { ReactElement } from 'react';

type OrganizationDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  closable: boolean;
};

export function OrganizationCreationDialog({
  open,
  setOpen,
  closable,
}: OrganizationDialogProps) {
  const { createOrganization } = useOrganizations();
  async function onSave(organization: OrganizationRequestBody) {
    await createOrganization(organization);
    setOpen(false);
  }

  return (
    <DialogComponent open={open} setOpen={setOpen} closable={closable}>
      <>
        <DialogTitle variant={'h2'}>
          <Trans>Create organization</Trans>
        </DialogTitle>
        <DialogContent>
          <GridContainer spacing={3}>
            <GridItem xs={12}>
              <Trans>
                Please fill out the form to create an organization. For this
                organization you can then later create balance sheets.
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
  setOpen,
  closable,
  children,
}: OrganizationDialogProps & { children: ReactElement }) {
  if (closable) {
    return (
      <ClosableDialog
        fullWidth
        maxWidth={'md'}
        onCloseIconClicked={() => setOpen(false)}
        open={open}
        onClose={() => setOpen(false)}
      >
        {children}
      </ClosableDialog>
    );
  } else {
    return (
      <Dialog fullWidth maxWidth={'md'} onClose={() => {}} open={open}>
        {children}
      </Dialog>
    );
  }
}
