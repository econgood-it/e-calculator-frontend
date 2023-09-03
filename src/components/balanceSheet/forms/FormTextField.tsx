import { TextField } from '@mui/material';
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import * as _ from 'lodash';

type FormTextFieldProps<T extends FieldValues> = {
  label: ReactElement | string;
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
  registerKey: Path<T>;
};

export function FormTextField<T extends FieldValues>({
  label,
  registerKey,
  register,
  errors,
}: FormTextFieldProps<T>) {
  const splitKey = registerKey.split('.');
  const error = _.get(errors, splitKey);

  const { t } = useTranslation();
  return (
    <TextField
      fullWidth
      required
      label={label}
      {...register(registerKey)}
      error={!!error}
      helperText={!!error && t(`${error?.message}`)}
      InputLabelProps={{ shrink: true }}
    />
  );
}
