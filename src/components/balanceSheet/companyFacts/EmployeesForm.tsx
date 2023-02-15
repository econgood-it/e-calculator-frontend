import { CompanyFactsSchema } from '../../../dataTransferObjects/CompanyFacts';
import GridItem from '../../layout/GridItem';
import { Button, IconButton } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import {
  CurrencyInput,
  PercentageInput,
  PositiveNumberInput,
} from './NumberInputs';
import GridContainer, { FormContainer } from '../../layout/GridContainer';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';
import SwitchLabel from './SwitchLabel';
import { Region } from '../../../dataTransferObjects/Region';
import { DEFAULT_CODE, RegionSelect } from './AutocompleteSelects';
import { SaveButton } from './SaveButton';
import { FormTitle } from './FormTitle';

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
    register,
    formState: { errors },
    handleSubmit,
    control,
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

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'employeesFractions', // unique name for your Field Array
  });

  const addSupplierFraction = () => {
    append({ countryCode: undefined, percentage: 0 });
  };

  const removeEmployeesFraction = (index: number) => {
    remove(index);
  };

  const onSaveClick = async (data: EmployeesFormInput) => {
    const newCompanyFacts = EmployeesFormSchema.parse(data);
    await updateCompanyFacts({
      ...newCompanyFacts,
      employeesFractions: newCompanyFacts.employeesFractions.map((ef) => ({
        ...ef,
        percentage: ef.percentage / 100,
      })),
    });
  };

  const numberFields: Map<
    keyof EmployeesFormInput,
    {
      label: string;
      ComponentType: typeof PositiveNumberInput | typeof CurrencyInput;
    }
  > = new Map([
    [
      'numberOfEmployees',
      {
        label: t`Number of employees (full time equivalents)`,
        ComponentType: PositiveNumberInput,
      },
    ],
    [
      'totalStaffCosts',
      {
        label: t`Staff costs (gross without employer contribution)`,
        ComponentType: CurrencyInput,
      },
    ],
    [
      'averageJourneyToWorkForStaffInKm',
      {
        label: t`Average journey to work for staff (in km)`,
        ComponentType: PositiveNumberInput,
      },
    ],
  ]);

  return (
    <FormContainer spacing={3}>
      <GridItem>
        <FormTitle precedingCharacter={'C'} title={t`Employees`} />
      </GridItem>
      <GridItem xs={12}>
        <GridContainer spacing={3} alignItems="center">
          {[...numberFields.entries()].map(
            ([key, { label, ComponentType }]) => (
              <GridItem key={key} xs={12} sm={3}>
                <ComponentType<EmployeesFormInput>
                  fullWidth
                  error={!!errors[key]}
                  errorMessage={!!errors[key] && t(`${errors[key]?.message}`)}
                  register={register}
                  registerKey={key}
                  label={label}
                  required={true}
                />
              </GridItem>
            )
          )}
          <GridItem key={'hasCanteen'} xs={12} sm={3}>
            <SwitchLabel<EmployeesFormInput>
              control={control}
              registerKey={'hasCanteen'}
              label={t`Is there a canteen for the majority of staff?`}
            />
          </GridItem>
          <GridItem xs={12}>
            <Button
              variant={'contained'}
              startIcon={<FontAwesomeIcon icon={faPlus} />}
              onClick={() => addSupplierFraction()}
            >
              <Trans>Add employees origin</Trans>
            </Button>
          </GridItem>
          <GridItem xs={12}>
            <GridContainer spacing={3}>
              {fields.map((field, index) => (
                <GridItem key={index} xs={12}>
                  <GridContainer spacing={3} alignItems="center">
                    <GridItem xs={12} sm={6}>
                      <RegionSelect
                        control={control}
                        regions={regions}
                        defaultValue={DEFAULT_CODE}
                        name={`employeesFractions.${index}.countryCode`}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={5}>
                      <PercentageInput<EmployeesFormInput>
                        fullWidth
                        label={<Trans>Amount in %</Trans>}
                        error={!!errors.employeesFractions?.[index]?.percentage}
                        errorMessage={
                          !!errors.employeesFractions?.[index]?.percentage &&
                          t(
                            `${errors.employeesFractions?.[index]?.percentage?.message}`
                          )
                        }
                        register={register}
                        registerKey={`employeesFractions.${index}.percentage`}
                        required={true}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={1}>
                      <IconButton
                        onClick={() => removeEmployeesFraction(index)}
                        aria-label={`Remove employees origin with ${index}`}
                        color="error"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </GridItem>
                  </GridContainer>
                </GridItem>
              ))}
            </GridContainer>
          </GridItem>
        </GridContainer>
      </GridItem>
      <GridItem xs={12}>
        <SaveButton<EmployeesFormInput>
          handleSubmit={handleSubmit}
          onSaveClick={onSaveClick}
        />
      </GridItem>
    </FormContainer>
  );
}
