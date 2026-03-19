import { MenuItem } from '@mui/material';
import { Control, FieldValues, Path, PathValue } from 'react-hook-form';
import { ReactHookFormSelect } from '../../lib/ReactHookFormSelect.tsx';
import { BalanceSheetCurrencies } from '../../../models/BalanceSheet.ts';
import { Trans } from 'react-i18next';

type CurrencySelectorProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  defaultValue: PathValue<T, Path<T>>;
};

export function CurrencySelector<T extends FieldValues>({
  control,
  name,
  defaultValue,
}: CurrencySelectorProps<T>) {
  return (
    <ReactHookFormSelect
      control={control}
      name={name}
      label={<Trans>Currency</Trans>}
      defaultValue={defaultValue}
    >
      {Object.entries(BalanceSheetCurrencies).map(([value, symbol]) => (
        <MenuItem key={value} value={value}>
          {symbol}
        </MenuItem>
      ))}
    </ReactHookFormSelect>
  );
}
