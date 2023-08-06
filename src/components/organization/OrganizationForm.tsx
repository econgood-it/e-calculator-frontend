import { Typography } from '@mui/material';
import { Trans } from 'react-i18next';
import {
  Organization,
  OrganizationRequestBody,
  tmpRequestSchema,
  tmpSchema,
} from '../../models/Organization';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SaveButton } from '../balanceSheet/forms/SaveButton';
import { FormContainer } from '../layout/GridContainer';
import GridItem from '../layout/GridItem';
import { FormTextField } from '../balanceSheet/forms/FormTextField';

type OrganizationFormProps = {
  organization: Organization | undefined;
  onSave: (organization: OrganizationRequestBody) => Promise<void>;
};
const FormInputSchema = tmpRequestSchema;
type FormInput = z.infer<typeof FormInputSchema>;

export function OrganizationForm({
  organization,
  onSave,
}: OrganizationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(FormInputSchema),
    mode: 'onChange',
    defaultValues: organization,
  });

  async function onSaveClick(data: FieldValues) {
    await onSave(FormInputSchema.parse(data));
  }

  return (
    <FormContainer spacing={3}>
      <GridItem xs={12}>
        <Typography variant={'h1'}>
          <Trans>Your organization</Trans>
        </Typography>
      </GridItem>
      <GridItem xs={12}>
        <FormTextField
          label={<Trans>City</Trans>}
          errors={errors}
          register={register}
          registerKey={'address.city'}
        />
      </GridItem>
      <GridItem xs={12}>
        <SaveButton handleSubmit={handleSubmit} onSaveClick={onSaveClick} />
      </GridItem>
    </FormContainer>
  );
}
