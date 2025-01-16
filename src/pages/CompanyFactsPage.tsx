import SuppliersForm from '../components/balanceSheet/companyFacts/SuppliersForm';
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  useSubmit,
} from 'react-router-dom';
import {
  createApiClient,
  makeWretchInstanceWithAuth,
} from '../api/api.client.ts';
import { API_URL } from '../configuration.ts';
import { useLoaderData } from 'react-router-typesafe';
import {
  CompanyFacts,
  CompanyFactsFormSchema,
} from '../models/CompanyFacts.ts';
import { HandlerContext } from './handlerContext.ts';
import GridContainer, {
  FormContainer,
} from '../components/layout/GridContainer.tsx';
import GridItem from '../components/layout/GridItem.tsx';
import { FixedBarItemWithContainer } from '../components/layout/FixedBarItemWithContainer.tsx';
import { Button, MobileStepper, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans, useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { SaveButton } from '../components/buttons/SaveButton.tsx';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CompanyFactsPatchRequestBodySchema } from '@ecogood/e-calculator-schemas/dist/company.facts.dto';
import { DEFAULT_CODE } from '../components/balanceSheet/companyFacts/AutocompleteSelects.tsx';
import { OwnersAndFinancialServicesForm } from '../components/balanceSheet/companyFacts/OwnersAndFinancialServicesForm.tsx';
import { EmployeesForm } from '../components/balanceSheet/companyFacts/EmployeesForm.tsx';
import { CustomersForm } from '../components/balanceSheet/companyFacts/CustomersForm.tsx';
import { useSnackbar } from 'notistack';

const CompanyFactsPage = () => {
  const data = useLoaderData<typeof loader>();
  const [activeStep, setActiveStep] = useState<number>(0);
  const { t } = useTranslation();

  const { formState, register, handleSubmit, setValue, control } =
    useForm<CompanyFacts>({
      resolver: zodResolver(CompanyFactsFormSchema),
      mode: 'onChange',
      defaultValues: data?.companyFacts,
      values: data?.companyFacts,
    });

  const Steps = useMemo(() => {
    const dataIsLoaded = data && formState.defaultValues;
    return [
      {
        label: <Trans>A: Suppliers</Trans>,
        element: dataIsLoaded && (
          <SuppliersForm
            control={control}
            register={register}
            setValue={setValue}
            formState={formState}
            regions={data.regions}
            industries={data.industries}
          />
        ),
      },
      {
        label: (
          <Trans>B: Owners, equity- and financial service providers</Trans>
        ),
        element: dataIsLoaded && (
          <OwnersAndFinancialServicesForm
            formState={formState}
            register={register}
          />
        ),
      },
      {
        label: <Trans>C: Employees</Trans>,
        element: dataIsLoaded && (
          <EmployeesForm
            control={control}
            register={register}
            formState={formState}
            regions={data?.regions}
          />
        ),
      },
      {
        label: 'D: Customers and other companies',
        element: dataIsLoaded && (
          <CustomersForm
            control={control}
            register={register}
            formState={formState}
            industries={data?.industries}
          />
        ),
      },
    ];
  }, [data, control, register, formState, setValue]);

  const maxSteps = Steps.length;

  const submit = useSubmit();
  const { enqueueSnackbar } = useSnackbar();

  const onSaveClick = async (data: FieldValues) => {
    const newCompanyFacts = CompanyFactsFormSchema.parse(data);
    const companyFacts = CompanyFactsPatchRequestBodySchema.parse({
      ...newCompanyFacts,
      supplyFractions: newCompanyFacts.supplyFractions.map((sf) => {
        const countryCode =
          sf.countryCode === DEFAULT_CODE ? undefined : sf.countryCode;
        const industryCode =
          sf.industryCode === DEFAULT_CODE ? undefined : sf.industryCode;
        return {
          ...sf,
          countryCode: countryCode,
          industryCode: industryCode,
        };
      }),
      mainOriginOfOtherSuppliers:
        newCompanyFacts.mainOriginOfOtherSuppliers.countryCode,
    });
    submit(
      { companyFacts, intent: 'updateCompanyFacts' },
      { method: 'patch', encType: 'application/json' }
    );
    enqueueSnackbar(t`Form successfully submitted`, { variant: 'success' });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <GridContainer>
      <FixedBarItemWithContainer>
        <GridItem sm={12} md="auto">
          <MobileStepper
            variant="text"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            sx={{ maxWidth: 400, flexGrow: 1 }}
            nextButton={
              <Button
                onClick={handleNext}
                endIcon={<FontAwesomeIcon icon={faChevronRight} />}
                disabled={activeStep === maxSteps - 1}
              >
                <Trans>Next</Trans>
              </Button>
            }
            backButton={
              <Button
                onClick={handleBack}
                startIcon={<FontAwesomeIcon icon={faChevronLeft} size="sm" />}
                disabled={activeStep === 0}
              >
                <Trans>Back</Trans>
              </Button>
            }
          />
        </GridItem>
        <GridItem>
          <Typography variant="h2">{Steps[activeStep].label}</Typography>
        </GridItem>
        <GridItem>
          <SaveButton
            handleSubmit={handleSubmit}
            onSaveClick={onSaveClick}
            disabled={!formState.isDirty}
          />
        </GridItem>
      </FixedBarItemWithContainer>
      <GridItem marginTop={10}>
        <FormContainer>{Steps[activeStep].element}</FormContainer>
      </GridItem>
    </GridContainer>
  );
};

export default CompanyFactsPage;

export async function loader(
  { params }: LoaderFunctionArgs,
  handlerCtx: unknown
) {
  const { userData, lng } = handlerCtx as HandlerContext;

  if (!userData || !params.balanceSheetId) {
    return null;
  }
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
  );

  const balanceSheet = await apiClient.getBalanceSheet(
    Number.parseInt(params.balanceSheetId)
  );
  const regions = await apiClient.getRegions();
  const industries = await apiClient.getIndustries();
  return { companyFacts: balanceSheet.companyFacts, regions, industries };
}

export async function action(
  { params, request }: ActionFunctionArgs,
  handlerCtx: unknown
) {
  const { intent, ...data } = await request.json();
  const { userData, lng } = handlerCtx as HandlerContext;

  if (!userData || !params.balanceSheetId) {
    return null;
  }
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
  );

  if (intent === 'updateCompanyFacts') {
    return await apiClient.updateBalanceSheet(parseInt(params.balanceSheetId), {
      companyFacts: data.companyFacts,
    });
  }

  throw json({ message: 'Invalid intent' }, { status: 400 });
}
