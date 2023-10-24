import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListProvider';
import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { Trans } from 'react-i18next';
import GridContainer from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import { useState } from 'react';

export function BalanceSheetSettingsPage() {
  const { balanceSheet } = useActiveBalanceSheet();
  const { deleteBalanceSheet } = useBalanceSheetItems();

  const [open, setOpen] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <GridContainer spacing={2}>
        <GridItem xs={12}>
          <Typography variant="h5">
            <Trans>Danger Zone</Trans>
          </Typography>
        </GridItem>
        <GridItem xs={12}>
          <Alert
            variant="outlined"
            severity={'error'}
            action={
              <Button
                variant="outlined"
                color="error"
                onClick={handleClickOpen}
              >
                <Trans>Delete this balance sheet</Trans>
              </Button>
            }
          >
            <AlertTitle>
              <Trans>Delete this balance sheet</Trans>
            </AlertTitle>
            <Typography variant="body1">
              <Trans>
                Once you delete a balance sheet, there is no going back. Please
                be certain.
              </Trans>
            </Typography>
          </Alert>
        </GridItem>
      </GridContainer>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          <Trans>Delete this balance sheet</Trans>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Trans>
              Once you delete a balance sheet, there is no going back. Please be
              certain.
            </Trans>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <Trans>Cancel</Trans>
          </Button>
          <Button
            onClick={() => deleteBalanceSheet(balanceSheet!.id!)}
            autoFocus
          >
            <Trans>Ok</Trans>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
