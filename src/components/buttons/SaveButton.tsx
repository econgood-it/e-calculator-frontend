import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Trans } from 'react-i18next';
import { Button } from '@mui/material';

import {
  FieldValues,
  SubmitHandler,
  UseFormHandleSubmit,
} from 'react-hook-form';
import React from 'react';

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
  return (
    <Button
      disabled={disabled}
      fullWidth={true}
      size={'large'}
      onClick={handleSubmit(onSaveClick)}
      variant={'contained'}
      startIcon={<FontAwesomeIcon icon={faSave} />}
    >
      {label ? label : <Trans>Save</Trans>}
    </Button>
  );
}
