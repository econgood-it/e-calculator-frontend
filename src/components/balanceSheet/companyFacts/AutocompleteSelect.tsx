import { Controller } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';
import { Region } from '../../../dataTransferObjects/Region';
import { useTranslation } from 'react-i18next';

type AutocompleteSelectProps = {
  control: any;
  options: string[];
  getOptionLabel: (option: any) => string;
  name: string;
  label: string;
};
export default function AutocompleteSelect({
  control,
  options,
  getOptionLabel,
  name,
  label,
}: AutocompleteSelectProps) {
  return (
    <Controller
      render={({ field }) => (
        <Autocomplete
          {...field}
          options={options}
          getOptionLabel={getOptionLabel}
          aria-label={name}
          renderInput={(params) => (
            <TextField {...params} label={label} variant="outlined" />
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
};

export function RegionSelect({ control, regions, name }: RegionSelectProps) {
  const { t } = useTranslation();
  const getOptionLabel = (option: any) =>
    `${option} ${regions.find((r) => r.countryCode === option)?.countryName}`;

  return (
    <AutocompleteSelect
      control={control}
      options={regions.map((r) => r.countryCode)}
      getOptionLabel={getOptionLabel}
      name={name}
      label={t`Choose a region`}
    />
  );
}
