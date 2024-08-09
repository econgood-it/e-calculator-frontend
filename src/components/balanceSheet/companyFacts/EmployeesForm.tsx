import GridItem from '../../layout/GridItem';
import { Trans, useTranslation } from 'react-i18next';
import {
  CurrencyInput,
  NumberInput,
  PercentageInput,
} from '../forms/NumberInputs';
import GridContainer, { FormContainer } from '../../layout/GridContainer';
import { FieldValues, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SwitchLabel from '../forms/SwitchLabel';

import { DEFAULT_CODE, RegionSelect } from './AutocompleteSelects';
import { SaveButton } from '../../buttons/SaveButton.tsx';
import { FormTitle } from './FormTitle';
import { FieldArrayAppendButton } from '../forms/FieldArrayAppendButton';
import { FieldArrayRemoveButton } from '../forms/FieldArrayRemoveButton';
import { CompanyFactsResponseBodySchema } from '@ecogood/e-calculator-schemas/dist/company.facts.dto';
import { Region } from '../../../models/Region';
import { CompanyFactsPatchRequestBody } from '../../../models/CompanyFacts.ts';

const EmployeesFormSchema = CompanyFactsResponseBodySchema.pick({
  numberOfEmployees: true,
  totalStaffCosts: true,
  averageJourneyToWorkForStaffInKm: true,
  hasCanteen: true,
  employeesFractions: true,
});
type EmployeesFormInput = z.infer<typeof EmployeesFormSchema>;

type EmployeesFormProps = {
  formData: EmployeesFormInput;
  regions: Region[];
  updateCompanyFacts: (
    companyFacts: CompanyFactsPatchRequestBody
  ) => Promise<void>;
};

export function EmployeesForm({
  formData,
  regions,
  updateCompanyFacts,
}: EmployeesFormProps) {
  const { t } = useTranslation();
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<EmployeesFormInput>({
    resolver: zodResolver(EmployeesFormSchema),
    mode: 'onChange',
    defaultValues: formData,
  });

  const fieldArrayName = 'employeesFractions';
  const {
    fields: employeesFractions,
    append,
    remove,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: fieldArrayName, // unique name for your Field Array
  });

  const onSaveClick = async (data: FieldValues) => {
    await updateCompanyFacts(EmployeesFormSchema.parse(data));
  };

  return (
    <FormContainer spacing={3}>
      <GridItem>
        <FormTitle precedingCharacter={'C'} title={t`Employees`} />
      </GridItem>
      <GridItem xs={12}>
        <GridContainer spacing={3} alignItems="center">
          <GridItem xs={12} sm={3}>
            <NumberInput<EmployeesFormInput>
              register={register}
              errors={errors}
              registerKey={'numberOfEmployees'}
              label={t`Number of employees (full time equivalents)`}
            />
          </GridItem>
          <GridItem xs={12} sm={3}>
            <CurrencyInput<EmployeesFormInput>
              register={register}
              errors={errors}
              registerKey={'totalStaffCosts'}
              label={t`Staff costs (gross without employer contribution)`}
            />
          </GridItem>
          <GridItem xs={12} sm={3}>
            <NumberInput<EmployeesFormInput>
              register={register}
              errors={errors}
              registerKey={'averageJourneyToWorkForStaffInKm'}
              label={t`Average journey to work for staff (in km)`}
            />
          </GridItem>
          <GridItem key={'hasCanteen'} xs={12} sm={3}>
            <SwitchLabel<EmployeesFormInput>
              control={control}
              registerKey={'hasCanteen'}
              label={t`Is there a canteen for the majority of staff?`}
            />
          </GridItem>
        </GridContainer>
      </GridItem>
      <GridItem xs={12}>
        <FieldArrayAppendButton
          label={<Trans>Add employees origin</Trans>}
          onClick={() => append({ countryCode: undefined, percentage: 0 })}
        ></FieldArrayAppendButton>
      </GridItem>
      {employeesFractions.map((_, index) => (
        <GridItem key={index} xs={12}>
          <GridContainer spacing={3}>
            <GridItem xs={12} sm={6}>
              <RegionSelect
                control={control}
                regions={regions}
                defaultValue={DEFAULT_CODE}
                name={`${fieldArrayName}.${index}.countryCode`}
              />
            </GridItem>
            <GridItem xs={12} sm={5}>
              <PercentageInput<EmployeesFormInput>
                register={register}
                errors={errors}
                label={<Trans>Amount in %</Trans>}
                registerKey={`${fieldArrayName}.${index}.percentage`}
              />
            </GridItem>
            <GridItem xs={12} sm={1}>
              <FieldArrayRemoveButton
                onClick={() => remove(index)}
                ariaLabel={`Remove ${fieldArrayName} with ${index}`}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
      ))}
      <GridItem xs={12}>
        <SaveButton handleSubmit={handleSubmit} onSaveClick={onSaveClick} />
      </GridItem>
    </FormContainer>
  );
}
