import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

type SwitchLabelProps<T extends FieldValues> = {
  registerKey: Path<T>;
  control: Control<T>;
  label: string;
};

export default function SwitchLabel<T extends FieldValues>({
  control,
  registerKey,
  label,
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
