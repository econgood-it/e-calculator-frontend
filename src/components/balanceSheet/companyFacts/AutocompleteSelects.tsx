import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';
import { Region } from '../../../dataTransferObjects/Region';
import { useTranslation } from 'react-i18next';
import { Industry } from '../../../dataTransferObjects/Industry';

export const DEFAULT_CODE = 'DEFAULT_CODE';

type AutocompleteSelectProps<T> = {
  options: string[];
  control: Control<T>;
  getOptionLabel: (option: any) => string;
  name: Path<T>;
  label: string;
  defaultValue: PathValue<T, Path<T>>;
};

function AutocompleteSelect<T extends FieldValues>({
  options,
  getOptionLabel,
  control,
  defaultValue,
  name,
  label,
}: AutocompleteSelectProps<T>) {
  return (
    <Controller
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <Autocomplete
          {...field}
          options={options}
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={(option, value) =>
            value === defaultValue ? true : option === value
          }
          aria-label={name}
          renderInput={(params) => (
            <TextField
              error={!!fieldState.error}
              {...params}
              label={label}
              variant="outlined"
            />
          )}
          onChange={(_, data) => field.onChange(data)}
        />
      )}
      name={name}
      control={control}
    />
  );
}

type RegionSelectProps<T> = {
  regions: Region[];
  name: Path<T>;
  defaultValue: PathValue<T, Path<T>>;
  control: Control<T>;
};

export function RegionSelect<T extends FieldValues>({
  regions,
  name,
  defaultValue,
  control,
}: RegionSelectProps<T>) {
  const { t } = useTranslation();
  const defaultLabel = t`Choose a region`;
  const getOptionLabel = (option: string) =>
    option === defaultValue
      ? defaultLabel.toString()
      : `${option} ${
          regions.find((r) => r.countryCode === option)?.countryName
        }`;

  return (
    <AutocompleteSelect
      control={control}
      defaultValue={defaultValue}
      options={regions.map((r) => r.countryCode)}
      getOptionLabel={getOptionLabel}
      name={name}
      label={defaultLabel}
    />
  );
}

type IndustrySelectProps<T> = {
  industries: Industry[];
  name: Path<T>;
  defaultValue: PathValue<T, Path<T>>;
  control: Control<T>;
};

export function IndustrySelect<T extends FieldValues>({
  industries,
  name,
  defaultValue,
  control,
}: IndustrySelectProps<T>) {
  const { t } = useTranslation();
  const defaultLabel = t`Choose an industry sector`;
  const getOptionLabel = (option: string) =>
    option === defaultValue
      ? defaultLabel.toString()
      : `${option} - ${
          industries.find((i) => i.industryCode === option)?.industryName
        }`;

  return (
    <AutocompleteSelect
      control={control}
      defaultValue={defaultValue}
      options={industries.map((i) => i.industryCode)}
      getOptionLabel={getOptionLabel}
      name={name}
      label={defaultLabel}
    />
  );
}
