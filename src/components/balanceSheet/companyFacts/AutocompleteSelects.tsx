import { Controller } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';
import { Region } from '../../../dataTransferObjects/Region';
import { useTranslation } from 'react-i18next';
import { Industry } from '../../../dataTransferObjects/Industry';

export const DEFAULT_CODE = 'DEFAULT_CODE';

type AutocompleteSelectProps = {
  control: any;
  options: string[];
  getOptionLabel: (option: any) => string;
  name: string;
  label: string;
  defaultValue: string;
};

function AutocompleteSelect({
  control,
  options,
  getOptionLabel,
  defaultValue,
  name,
  label,
}: AutocompleteSelectProps) {
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

type RegionSelectProps = {
  control: any;
  regions: Region[];
  name: string;
  defaultValue: string;
};

export function RegionSelect({
  control,
  regions,
  name,
  defaultValue,
}: RegionSelectProps) {
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
      defaultValue={defaultValue}
      control={control}
      options={regions.map((r) => r.countryCode)}
      getOptionLabel={getOptionLabel}
      name={name}
      label={defaultLabel}
    />
  );
}

type IndustrySelectProps = {
  control: any;
  industries: Industry[];
  name: string;
  defaultValue: string;
};

export function IndustrySelect({
  control,
  industries,
  name,
  defaultValue,
}: IndustrySelectProps) {
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
      defaultValue={defaultValue}
      control={control}
      options={industries.map((i) => i.industryCode)}
      getOptionLabel={getOptionLabel}
      name={name}
      label={defaultLabel}
    />
  );
}
