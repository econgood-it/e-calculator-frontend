import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import {
  FieldValues,
  SubmitHandler,
  UseFormHandleSubmit,
} from 'react-hook-form';
import React from 'react';
import { useSnackbar } from 'notistack';

type SaveButtonProps = {
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  onSaveClick: SubmitHandler<FieldValues>;
  label?: React.ReactNode;
  disabled?: boolean;
};

export function SaveButton({
  onSaveClick,
  handleSubmit,
  label,
  disabled,
}: SaveButtonProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  return (
    <Button
      disabled={disabled}
      fullWidth={true}
      size={'large'}
      onClick={handleSubmit(onSaveClick, (errors) => {
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
      })}
      variant={'contained'}
      startIcon={<FontAwesomeIcon icon={faSave} />}
    >
      {label ? label : <Trans>Save</Trans>}
    </Button>
  );
}
