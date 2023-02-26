import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import * as _ from 'lodash';

type PositiveNumberInputProps<T> = {
  label: ReactElement | string;
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
  registerKey: Path<T>;
  readOnly?: boolean;
  startAdornment?: ReactElement;
};

export function NumberInput<T extends FieldValues>({
  label,
  registerKey,
  register,
  errors,
  readOnly,
  startAdornment,
}: PositiveNumberInputProps<T>) {
  const splitKey = registerKey.split('.');
  const error = _.get(errors, splitKey);

  const { t } = useTranslation();
  const id = `outlined-adornment-amount_${registerKey}`;
  return (
    <FormControl fullWidth={true}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        readOnly={readOnly}
        id={id}
        {...register(registerKey, {
          valueAsNumber: true,
          required: true,
        })}
        aria-label={registerKey}
        startAdornment={startAdornment}
        error={!!error}
        label={label}
      />
      <FormHelperText>{!!error && t(`${error?.message}`)}</FormHelperText>
    </FormControl>
  );
}

export function CurrencyInput<T extends FieldValues>(
  props: PositiveNumberInputProps<T>
) {
  return (
    <NumberInput
      {...props}
      startAdornment={<InputAdornment position="start">€</InputAdornment>}
    />
  );
}

export function PercentageInput<T extends FieldValues>(
  props: PositiveNumberInputProps<T>
) {
  return (
    <NumberInput
      {...props}
      startAdornment={<InputAdornment position="start">%</InputAdornment>}
    />
  );
}
