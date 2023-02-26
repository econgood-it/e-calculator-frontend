import { CompanyFactsSchema } from '../../../dataTransferObjects/CompanyFacts';
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
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';
import SwitchLabel from '../forms/SwitchLabel';
import { Region } from '../../../dataTransferObjects/Region';
import { DEFAULT_CODE, RegionSelect } from './AutocompleteSelects';
import { SaveButton } from '../forms/SaveButton';
import { FormTitle } from './FormTitle';
import { FieldArrayAppendButton } from '../forms/FieldArrayAppendButton';
import { FieldArrayRemoveButton } from '../forms/FieldArrayRemoveButton';

const EmployeesFormSchema = CompanyFactsSchema.pick({
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
};

export function EmployeesForm({ formData, regions }: EmployeesFormProps) {
  const { t } = useTranslation();
  const { updateCompanyFacts } = useActiveBalanceSheet();
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<EmployeesFormInput>({
    resolver: zodResolver(EmployeesFormSchema),
    mode: 'onChange',
    defaultValues: {
      ...formData,
      employeesFractions: formData.employeesFractions.map((ef) => ({
        ...ef,
        percentage: ef.percentage * 100,
      })),
    },
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
    const newCompanyFacts = EmployeesFormSchema.parse(data);
    await updateCompanyFacts({
      ...newCompanyFacts,
      employeesFractions: newCompanyFacts.employeesFractions.map((ef) => ({
        ...ef,
        percentage: ef.percentage / 100,
      })),
    });
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
          onClick={() => append({ countryCode: undefined, percentage: 0 })}
        ></FieldArrayAppendButton>
      </GridItem>
      {employeesFractions.map((ef, index) => (
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
