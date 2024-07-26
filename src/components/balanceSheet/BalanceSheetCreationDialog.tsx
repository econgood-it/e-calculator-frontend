import { DialogContent, DialogTitle, MenuItem } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { ClosableDialog } from '../lib/ClosableDialog';
import GridContainer, { FormContainer } from '../layout/GridContainer';
import GridItem from '../layout/GridItem';
import { z } from 'zod';
import { FieldValues, useForm } from 'react-hook-form';
import { SaveButton } from '../buttons/SaveButton.tsx';
import { BalanceSheetCreateRequestBody } from '../../models/BalanceSheet';
import { BalanceSheetCreateRequestBodySchema } from '@ecogood/e-calculator-schemas/dist/balance.sheet.dto';
import { ReactHookFormSelect } from '../lib/ReactHookFormSelect';
import {
  BalanceSheetType,
  BalanceSheetVersion,
} from '@ecogood/e-calculator-schemas/dist/shared.schemas';
import { zodResolver } from '@hookform/resolvers/zod';

type OrganizationDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (balancesheet: BalanceSheetCreateRequestBody) => Promise<void>;
};

export function BalanceSheetCreationDialog({
  open,
  onClose,
  onSave,
}: OrganizationDialogProps) {
  async function onSaveClicked(balanceSheet: BalanceSheetCreateRequestBody) {
    await onSave(balanceSheet);
    onClose();
  }

  return (
    <ClosableDialog open={open} onCloseIconClicked={() => onClose()}>
      <>
        <DialogTitle variant={'h1'}>
          <Trans>Create balance sheet</Trans>
        </DialogTitle>
        <DialogContent>
          <GridContainer spacing={3}>
            <GridItem xs={12}>
              <BalanceSheetCreationForm onSave={onSaveClicked} />
            </GridItem>
          </GridContainer>
        </DialogContent>
      </>
    </ClosableDialog>
  );
}

type BalanceSheetCreationFormProps = {
  onSave: (balancesheet: BalanceSheetCreateRequestBody) => Promise<void>;
};
const FormInputSchema = BalanceSheetCreateRequestBodySchema.pick({
  type: true,
  version: true,
});
type FormInput = z.infer<typeof FormInputSchema>;

export function BalanceSheetCreationForm({
  onSave,
}: BalanceSheetCreationFormProps) {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<FormInput>({
    resolver: zodResolver(FormInputSchema),
    mode: 'onChange',
  });

  async function onSaveClick(data: FieldValues) {
    await onSave(FormInputSchema.parse(data));
  }

  return (
    <FormContainer spacing={3} justifyContent="space-between">
      <GridItem xs={12} sm={6}>
        <ReactHookFormSelect
          fullWidth
          control={control}
          defaultValue={BalanceSheetType.Full}
          label={t`Select type`}
          name={'type'}
        >
          <MenuItem value={BalanceSheetType.Compact}>
            <Trans>Compact</Trans>
          </MenuItem>
          <MenuItem value={BalanceSheetType.Full}>
            <Trans>Full</Trans>
          </MenuItem>
        </ReactHookFormSelect>
      </GridItem>
      <GridItem xs={12} sm={6}>
        <ReactHookFormSelect
          fullWidth
          control={control}
          defaultValue={BalanceSheetVersion.v5_0_8}
          label={t`Select version`}
          name={'version'}
        >
          <MenuItem value={BalanceSheetVersion.v5_0_8}>5.08</MenuItem>
          <MenuItem value={BalanceSheetVersion.v5_0_9}>5.09</MenuItem>
        </ReactHookFormSelect>
      </GridItem>
      <GridItem xs={12}>
        <SaveButton handleSubmit={handleSubmit} onSaveClick={onSaveClick} />
      </GridItem>
    </FormContainer>
  );
}
