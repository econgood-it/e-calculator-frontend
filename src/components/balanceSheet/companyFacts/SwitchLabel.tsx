import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { Controller, FieldValues, Path } from 'react-hook-form';
import { Control } from 'react-hook-form/dist/types/form';

type SwitchLabelProps<T> = {
  registerKey: Path<T>;
  label: string;
  control: Control<T>;
};

export default function SwitchLabel<T extends FieldValues>({
  registerKey,
  label,
  control,
}: SwitchLabelProps<T>) {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Controller
            control={control}
            name={registerKey}
            render={({ field }) => {
              return (
                <Switch
                  onChange={(e) => field.onChange(e.target.checked)}
                  checked={field.value}
                />
              );
            }}
          />
        }
        label={label}
      />
    </FormGroup>
  );
}
