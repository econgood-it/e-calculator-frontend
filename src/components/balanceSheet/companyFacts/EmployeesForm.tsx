import { CompanyFactsSchema } from '../../../dataTransferObjects/CompanyFacts';
import GridItem from '../../layout/GridItem';
import { Button, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { CurrencyInput, PositiveNumberInput } from './NumberInputs';
import GridContainer, { FormContainer } from '../../layout/GridContainer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';
import { useAlert } from '../../../contexts/AlertContext';

const EmployeesFormSchema = CompanyFactsSchema.pick({
  numberOfEmployees: true,
  totalStaffCosts: true,
  averageJourneyToWorkForStaffInKm: true,
});
type EmployeesFormInput = z.infer<typeof EmployeesFormSchema>;

type EmployeesFormProps = {
  formData: EmployeesFormInput;
};

export function EmployeesForm({ formData }: EmployeesFormProps) {
  const { t } = useTranslation();
  const { addErrorAlert } = useAlert();
  const { updateCompanyFacts } = useActiveBalanceSheet();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<EmployeesFormInput>({
    resolver: zodResolver(EmployeesFormSchema),
    mode: 'onChange',
    defaultValues: formData,
  });

  const onSaveClick = async (data: EmployeesFormInput) => {
    const newCompanyFacts = EmployeesFormSchema.parse(data);
    await updateCompanyFacts({
      ...newCompanyFacts,
    });
  };

  const fields: Map<
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
        <Typography variant={'h3'}>
          <Trans>Employees</Trans>
        </Typography>
      </GridItem>
      <GridItem xs={12}>
        <GridContainer spacing={3}>
          {[...fields.entries()].map(([key, { label, ComponentType }]) => (
            <GridItem key={key} xs={12} sm={4}>
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
          ))}
        </GridContainer>
      </GridItem>
      <GridItem xs={12}>
        <Button
          fullWidth={true}
          size={'large'}
          onClick={handleSubmit(onSaveClick, () =>
            addErrorAlert(t`Form data is invalid`)
          )}
          variant={'contained'}
          startIcon={<FontAwesomeIcon icon={faSave} />}
        >
          <Trans>Save</Trans>
        </Button>
      </GridItem>
    </FormContainer>
  );
}
