import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
} from 'react-hook-form';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import * as _ from 'lodash';
import { NumericFormat } from 'react-number-format';
import { useLanguage } from '../../../i18n.ts';

type PositiveNumberInputProps<T extends FieldValues> = {
  label: ReactElement | string;
  errors: FieldErrors<T>;
  control: Control<T>;
  registerKey: Path<T>;
  readOnly?: boolean;
  startAdornment?: ReactElement;
};

export function NumberInput<T extends FieldValues>({
  label,
  registerKey,
  control,
  errors,
  readOnly,
  startAdornment,
}: PositiveNumberInputProps<T>) {
  const splitKey = registerKey.split('.');
  const error = _.get(errors, splitKey);

  const { t } = useTranslation();
  const id = `outlined-adornment-amount_${registerKey}`;
  const { lng } = useLanguage();

  return (
    <FormControl fullWidth={true}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Controller
        render={({ field }) => (
          <NumericFormat
            id={id}
            customInput={OutlinedInput}
            value={field.value}
            onValueChange={(e) => field.onChange(e.floatValue ?? null)}
            thousandSeparator={lng === 'de' ? '.' : ','}
            decimalSeparator={lng === 'de' ? ',' : '.'}
            readOnly={readOnly}
            startAdornment={startAdornment}
            aria-label={registerKey}
            error={!!error}
            label={label}
          />
        )}
        name={registerKey}
        control={control}
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
