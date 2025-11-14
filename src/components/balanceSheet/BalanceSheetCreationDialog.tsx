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
import { FormTextField } from './forms/FormTextField.tsx';
import ReactHookFormDatePicker from '../lib/ReactHookFormDatePicker.tsx';
import { UserInformation } from '../../models/User.ts';

type BalanceSheetCreationDialogProps = {
  user: UserInformation;
  organizationName: string;
  open: boolean;
  onClose: () => void;
  onSave: (balancesheet: BalanceSheetCreateRequestBody) => Promise<void>;
};

export function BalanceSheetCreationDialog({
  user,
  organizationName,
  open,
  onClose,
  onSave,
}: BalanceSheetCreationDialogProps) {
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
              <BalanceSheetCreationForm
                company={{ name: organizationName }}
                contactPerson={user}
                onSave={onSaveClicked}
              />
            </GridItem>
          </GridContainer>
        </DialogContent>
      </>
    </ClosableDialog>
  );
}

type BalanceSheetCreationFormProps = {
  contactPerson: { email: string; name: string };
  company: { name: string };
  onSave: (balancesheet: BalanceSheetCreateRequestBody) => Promise<void>;
};
const FormInputSchema = BalanceSheetCreateRequestBodySchema.pick({
  type: true,
  version: true,
  generalInformation: true,
});
type FormInput = z.infer<typeof FormInputSchema>;

export function BalanceSheetCreationForm({
  company,
  contactPerson,
  onSave,
}: BalanceSheetCreationFormProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(FormInputSchema),
    defaultValues: {
      type: BalanceSheetType.Full,
      version: BalanceSheetVersion.v5_1_0,
      generalInformation: { company, contactPerson },
    },
    mode: 'onChange',
  });

  async function onSaveClick(data: FieldValues) {
    await onSave(FormInputSchema.parse(data));
  }

  return (
    <FormContainer spacing={3} justifyContent="space-between">
      <GridItem xs={12} sm={6}>
        <FormTextField
          label={<Trans>Company name</Trans>}
          errors={errors}
          register={register}
          registerKey={'generalInformation.company.name'}
        />
      </GridItem>
      <GridItem xs={12} sm={6}>
        <FormTextField
          label={<Trans>Contact name</Trans>}
          errors={errors}
          register={register}
          registerKey={'generalInformation.contactPerson.name'}
        />
      </GridItem>
      <GridItem xs={12} sm={6}>
        <FormTextField
          label={<Trans>Contact email</Trans>}
          errors={errors}
          register={register}
          registerKey={'generalInformation.contactPerson.email'}
        />
      </GridItem>
      <GridItem xs={12} sm={6}>
        <ReactHookFormDatePicker
          label={<Trans>Start of reporting period</Trans>}
          control={control}
          name={'generalInformation.period.start'}
        />
      </GridItem>
      <GridItem xs={12} sm={6}>
        <ReactHookFormDatePicker
          label={<Trans>End of reporting period</Trans>}
          control={control}
          name={'generalInformation.period.end'}
        />
      </GridItem>
      <GridItem xs={12} sm={6}>
        <ReactHookFormSelect
          fullWidth
          control={control}
          size={'medium'}
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
          size={'medium'}
          defaultValue={BalanceSheetVersion.v5_1_0}
          label={t`Select version`}
          name={'version'}
        >
          <MenuItem value={BalanceSheetVersion.v5_1_0}>5.10</MenuItem>
        </ReactHookFormSelect>
      </GridItem>
      <GridItem xs={12}>
        <SaveButton handleSubmit={handleSubmit} onSaveClick={onSaveClick} />
      </GridItem>
    </FormContainer>
  );
}
