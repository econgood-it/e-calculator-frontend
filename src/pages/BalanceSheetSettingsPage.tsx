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
import GridContainer, {
  FormContainer,
} from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import { useState } from 'react';
import {
  ActionFunctionArgs,
  json,
  redirect,
  useSubmit,
} from 'react-router-dom';
import {
  createApiClient,
  makeWretchInstanceWithAuth,
} from '../api/api.client.ts';
import { API_URL } from '../configuration.ts';
import { HandlerContext } from './handlerContext.ts';

export function BalanceSheetSettingsPage() {
  const submit = useSubmit();

  async function deleteBalanceSheet() {
    submit(
      { intent: 'deleteBalanceSheet' },
      { method: 'post', encType: 'application/json' }
    );
  }

  const [open, setOpen] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <FormContainer>
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
          <Button onClick={deleteBalanceSheet} autoFocus>
            <Trans>Ok</Trans>
          </Button>
        </DialogActions>
      </Dialog>
    </FormContainer>
  );
}

export async function action(
  { params, request }: ActionFunctionArgs,
  handlerCtx: unknown
) {
  const { intent } = await request.json();
  const { userData, lng } = handlerCtx as HandlerContext;
  if (!userData || !params.orgaId || !params.balanceSheetId) {
    return null;
  }
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
  );

  if (intent === 'deleteBalanceSheet') {
    await apiClient.deleteBalanceSheet(Number.parseInt(params.balanceSheetId));
    return redirect(`/organization/${params.orgaId}/overview`);
  }

  throw json({ message: 'Invalid intent' }, { status: 400 });
}
