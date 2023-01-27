import { Trans, useTranslation } from 'react-i18next';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CurrencyInput from './CurrencyInput';
import GridContainer from '../../layout/GridContainer';
import GridItem from '../../layout/GridItem';
import styled from 'styled-components';
import { Button, IconButton, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { z } from 'zod';
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';
import {
  CompanyFacts,
  CompanyFactsSchema,
} from '../../../dataTransferObjects/CompanyFacts';
import { Region } from '../../../dataTransferObjects/Region';
import { IndustrySelect, RegionSelect } from './AutocompleteSelects';
import { Industry } from '../../../dataTransferObjects/Industry';
import { useEffect } from 'react';

const FormContainer = styled(GridContainer)`
  padding: 10px;
`;

type SuppliersFormProps = {
  companyFacts: CompanyFacts;
  regions: Region[];
  industries: Industry[];
};

const DEFAULT_CODE = 'DEFAULT_CODE';
const SuppliersFormInputSchema = CompanyFactsSchema.pick({
  totalPurchaseFromSuppliers: true,
  supplyFractions: true,
  mainOriginOfOtherSuppliers: true,
});
type SuppliersFormInput = z.infer<typeof SuppliersFormInputSchema>;

const SuppliersForm = ({
  companyFacts,
  regions,
  industries,
}: SuppliersFormProps) => {
  const { updateCompanyFacts } = useActiveBalanceSheet();
  const { t } = useTranslation();

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm<CompanyFacts>({
    resolver: zodResolver(SuppliersFormInputSchema),
    mode: 'onChange',
    defaultValues: companyFacts,
  });

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'supplyFractions', // unique name for your Field Array
  });

  const watchedTotalPurchaseFromSuppliers = useWatch({
    control,
    name: 'totalPurchaseFromSuppliers',
  });
  const watchedSupplyFractions = useWatch({ control, name: 'supplyFractions' });

  useEffect(() => {
    const sum: number =
      watchedTotalPurchaseFromSuppliers -
      watchedSupplyFractions.reduce((sum, current) => sum + current.costs, 0);
    setValue('mainOriginOfOtherSuppliers.costs', sum);
  }, [watchedTotalPurchaseFromSuppliers, watchedSupplyFractions]);

  const onSaveClick = async (data: SuppliersFormInput) => {
    const newCompanyFacts = SuppliersFormInputSchema.parse(data);
    await updateCompanyFacts({
      ...newCompanyFacts,
      supplyFractions: newCompanyFacts.supplyFractions.map((sf) => {
        const countryCode =
          sf.countryCode === DEFAULT_CODE ? undefined : sf.countryCode;
        const industryCode =
          sf.industryCode === DEFAULT_CODE ? undefined : sf.industryCode;
        return { ...sf, countryCode: countryCode, industryCode: industryCode };
      }),
      mainOriginOfOtherSuppliers:
        newCompanyFacts.mainOriginOfOtherSuppliers.countryCode,
    });
  };

  const addSupplierFraction = () => {
    append({ countryCode: undefined, industryCode: undefined, costs: 0 });
  };
  const removeSupplierFraction = (index: number) => {
    remove(index);
  };

  return (
    <FormContainer spacing={3}>
      <GridItem>
        <Typography variant={'h3'}>
          <Trans>Suppliers</Trans>
        </Typography>
      </GridItem>
      <GridItem xs={12}>
        <CurrencyInput<CompanyFacts>
          fullWidth
          label={<Trans>Total purchases from suppliers</Trans>}
          error={!!errors.totalPurchaseFromSuppliers}
          errorMessage={
            !!errors.totalPurchaseFromSuppliers &&
            t(`${errors.totalPurchaseFromSuppliers?.message}`)
          }
          register={register}
          registerKey={'totalPurchaseFromSuppliers'}
          required={true}
        />
      </GridItem>
      <GridItem xs={12}>
        <Typography variant={'h6'}>
          <Trans>
            Enter the 5 most important industry sectors whose products or
            services you use.
          </Trans>
        </Typography>
      </GridItem>
      <GridItem xs={12}>
        <Button
          variant={'contained'}
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => addSupplierFraction()}
        >
          <Trans>Add supplier</Trans>
        </Button>
      </GridItem>
      <GridItem xs={12}>
        <GridContainer spacing={3}>
          {fields.map((field, index) => (
            <GridItem key={index} xs={12}>
              <GridContainer spacing={3} alignItems="center">
                <GridItem xs={12} sm={5}>
                  <IndustrySelect
                    control={control}
                    industries={industries}
                    defaultValue={DEFAULT_CODE}
                    name={`supplyFractions.${index}.industryCode`}
                  />
                </GridItem>
                <GridItem xs={12} sm={5}>
                  <RegionSelect
                    control={control}
                    regions={regions}
                    defaultValue={DEFAULT_CODE}
                    name={`supplyFractions.${index}.countryCode`}
                  />
                </GridItem>
                <GridItem xs={12} sm={1}>
                  <CurrencyInput<CompanyFacts>
                    fullWidth
                    label={<Trans>Costs</Trans>}
                    error={!!errors.supplyFractions?.[index]?.costs}
                    errorMessage={
                      !!errors.supplyFractions?.[index]?.costs &&
                      t(`${errors.supplyFractions?.[index]?.costs?.message}`)
                    }
                    register={register}
                    registerKey={`supplyFractions.${index}.costs`}
                    required={true}
                  />
                </GridItem>
                <GridItem xs={12} sm={1}>
                  <IconButton
                    onClick={() => removeSupplierFraction(index)}
                    aria-label={`Remove supply fraction with ${index}`}
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
      <GridItem xs={12}>
        <GridContainer spacing={3} alignItems="center">
          <GridItem xs={12} sm={5}>
            <Typography variant="body1">
              <Trans>Main origin of the other suppliers</Trans>
            </Typography>
          </GridItem>
          <GridItem xs={12} sm={5}>
            <RegionSelect
              control={control}
              regions={regions}
              defaultValue={DEFAULT_CODE}
              name={`mainOriginOfOtherSuppliers.countryCode`}
            />
          </GridItem>
          <GridItem xs={12} sm={1}>
            <CurrencyInput
              fullWidth
              label={<Trans>Costs</Trans>}
              error={false}
              readOnly={true}
              register={register}
              registerKey={'mainOriginOfOtherSuppliers.costs'}
              required={true}
            />
          </GridItem>
        </GridContainer>
      </GridItem>
      <GridItem xs={12}>
        <Button
          fullWidth={true}
          size={'large'}
          onClick={handleSubmit(onSaveClick)}
          variant={'contained'}
          startIcon={<FontAwesomeIcon icon={faSave} />}
        >
          <Trans>Save</Trans>
        </Button>
      </GridItem>
    </FormContainer>
  );
};

export default SuppliersForm;
