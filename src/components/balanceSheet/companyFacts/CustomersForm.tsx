import { CompanyFactsSchema } from '../../../dataTransferObjects/CompanyFacts';
import GridItem from '../../layout/GridItem';
import { Button, IconButton, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { CurrencyInput, PercentageInput } from './NumberInputs';
import GridContainer, { FormContainer } from '../../layout/GridContainer';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';
import { SaveButton } from './SaveButton';
import { Industry } from '../../../dataTransferObjects/Industry';
import { DEFAULT_CODE, IndustrySelect } from './AutocompleteSelects';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import SwitchLabel from './SwitchLabel';

const CustomersFormSchema = CompanyFactsSchema.pick({
  turnover: true,
  industrySectors: true,
  isB2B: true,
});
type CustomersFormInput = z.infer<typeof CustomersFormSchema>;

type CustomersFormProps = {
  formData: CustomersFormInput;
  industries: Industry[];
};

export function CustomersForm({ formData, industries }: CustomersFormProps) {
  const { t } = useTranslation();
  const { updateCompanyFacts } = useActiveBalanceSheet();
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<CustomersFormInput>({
    resolver: zodResolver(CustomersFormSchema),
    mode: 'onChange',
    defaultValues: {
      ...formData,
      industrySectors: formData.industrySectors.map((is) => ({
        ...is,
        amountOfTotalTurnover: is.amountOfTotalTurnover * 100,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'industrySectors', // unique name for your Field Array
  });

  const addIndustrySector = () => {
    append({
      industryCode: undefined,
      amountOfTotalTurnover: 0,
      description: '',
    });
  };

  const removeIndustrySector = (index: number) => {
    remove(index);
  };

  const onSaveClick = async (data: CustomersFormInput) => {
    const newCompanyFacts = CustomersFormSchema.parse(data);
    await updateCompanyFacts({
      ...newCompanyFacts,
      industrySectors: newCompanyFacts.industrySectors.map((is) => ({
        ...is,
        amountOfTotalTurnover: is.amountOfTotalTurnover / 100,
      })),
    });
  };

  return (
    <FormContainer spacing={3}>
      <GridItem>
        <Typography variant={'h3'}>
          <Trans>Customers</Trans>
        </Typography>
      </GridItem>
      <GridItem xs={12}>
        <GridContainer spacing={3} alignItems="center">
          <GridItem xs={12} sm={6}>
            <CurrencyInput<CustomersFormInput>
              fullWidth
              error={!!errors.turnover}
              errorMessage={
                !!errors.turnover && t(`${errors.turnover?.message}`)
              }
              register={register}
              registerKey={'turnover'}
              label={<Trans>Turnover</Trans>}
              required={true}
            />
          </GridItem>
          <GridItem xs={12} sm={6}>
            <SwitchLabel<CustomersFormInput>
              control={control}
              registerKey={'isB2B'}
              label={t`Are your customers mainly other companies?`}
            />
          </GridItem>
          <GridItem xs={12}>
            <Typography variant={'h6'}>
              <Trans>
                Enter the 3 most important industry sectors which your company
                is active in, including a rough share of turnover
              </Trans>
            </Typography>
          </GridItem>
          <GridItem xs={12}>
            <Button
              variant={'contained'}
              startIcon={<FontAwesomeIcon icon={faPlus} />}
              onClick={() => addIndustrySector()}
            >
              <Trans>Add industry sector</Trans>
            </Button>
          </GridItem>
          <GridItem xs={12}>
            <GridContainer spacing={3}>
              {fields.map((field, index) => (
                <GridItem key={index} xs={12}>
                  <GridContainer spacing={3} alignItems="center">
                    <GridItem xs={12} sm={6}>
                      <IndustrySelect
                        control={control}
                        industries={industries}
                        defaultValue={DEFAULT_CODE}
                        name={`industrySectors.${index}.industryCode`}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={5}>
                      <PercentageInput<CustomersFormInput>
                        fullWidth
                        label={<Trans>Amount in %</Trans>}
                        error={
                          !!errors.industrySectors?.[index]
                            ?.amountOfTotalTurnover
                        }
                        errorMessage={
                          !!errors.industrySectors?.[index]
                            ?.amountOfTotalTurnover &&
                          t(
                            `${errors.industrySectors?.[index]?.amountOfTotalTurnover?.message}`
                          )
                        }
                        register={register}
                        registerKey={`industrySectors.${index}.amountOfTotalTurnover`}
                        required={true}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={1}>
                      <IconButton
                        onClick={() => removeIndustrySector(index)}
                        aria-label={`Remove industry sector with ${index}`}
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
        <SaveButton<CustomersFormInput>
          handleSubmit={handleSubmit}
          onSaveClick={onSaveClick}
        />
      </GridItem>
    </FormContainer>
  );
}
