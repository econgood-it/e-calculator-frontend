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
import { useErrorHandling } from '../../errors/error.handling.ts';

type SaveButtonProps = {
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  onSaveClick: SubmitHandler<FieldValues>;
  label?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export function SaveButton({
  onSaveClick,
  handleSubmit,
  label,
  disabled,
  icon,
}: SaveButtonProps) {
  const handleErrors = useErrorHandling();
  return (
    <Button
      disabled={disabled}
      fullWidth={true}
      size={'large'}
      onClick={handleSubmit(onSaveClick, (errors) => {
        console.log(errors);
        handleErrors(errors);
      })}
      variant={'contained'}
      startIcon={icon ?? <FontAwesomeIcon icon={faSave} />}
    >
      {label ? label : <Trans>Save</Trans>}
    </Button>
  );
}
