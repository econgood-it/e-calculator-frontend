import { FieldErrors, FieldValues } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export function useErrorHandling() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  return useCallback(
    (errors: FieldErrors<FieldValues>) => {
      let issueReported = false;
      Object.values(errors).forEach((error) => {
        const message = error?.root ? error.root.message : error?.message;
        if (message) {
          enqueueSnackbar(t(message.toString()), {
            variant: 'error',
          });
          issueReported = true;
        }
      });
      if (!issueReported) {
        enqueueSnackbar(t`Form contains errors`, {
          variant: 'error',
        });
      }
    },
    [enqueueSnackbar, t]
  );
}
