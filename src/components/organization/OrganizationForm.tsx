import { Trans } from 'react-i18next';
import { OrganizationRequestBody } from '../../models/Organization';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SaveButton } from '../balanceSheet/forms/SaveButton';
import { FormContainer } from '../layout/GridContainer';
import GridItem from '../layout/GridItem';
import { FormTextField } from '../balanceSheet/forms/FormTextField';
import { OrganizationRequestSchema } from '@ecogood/e-calculator-schemas/dist/organization.dto';

type OrganizationFormProps = {
  organization: OrganizationRequestBody | undefined;
  onSave: (organization: OrganizationRequestBody) => Promise<void>;
};
const FormInputSchema = OrganizationRequestSchema;
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
    <FormContainer spacing={3} justifyContent="space-between">
      <GridItem xs={12}>
        <FormTextField
          label={<Trans>Name</Trans>}
          errors={errors}
          register={register}
          registerKey={'name'}
        />
      </GridItem>
      <GridItem xs={12} sm={6}>
        <FormTextField
          label={<Trans>Street</Trans>}
          errors={errors}
          register={register}
          registerKey={'address.street'}
        />
      </GridItem>
      <GridItem xs={12} sm={6}>
        <FormTextField
          label={<Trans>House number</Trans>}
          errors={errors}
          register={register}
          registerKey={'address.houseNumber'}
        />
      </GridItem>
      <GridItem xs={12} sm={6}>
        <FormTextField
          label={<Trans>City</Trans>}
          errors={errors}
          register={register}
          registerKey={'address.city'}
        />
      </GridItem>
      <GridItem xs={12} sm={6}>
        <FormTextField
          label={<Trans>Zip</Trans>}
          errors={errors}
          register={register}
          registerKey={'address.zip'}
        />
      </GridItem>
      <GridItem xs={12}>
        <SaveButton handleSubmit={handleSubmit} onSaveClick={onSaveClick} />
      </GridItem>
    </FormContainer>
  );
}
