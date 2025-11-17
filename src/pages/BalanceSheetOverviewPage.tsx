import { MatrixView } from '../components/matrix/MatrixView';
import GridContainer, {
  FormContainer,
} from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  useTheme,
} from '@mui/material';
import { Trans } from 'react-i18next';
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
import { redirect, useLoaderData } from 'react-router-typesafe';
import { HandlerContext } from './handlerContext.ts';
import { BigNumber } from '../components/lib/BigNumber.tsx';
import { CertificationAuthorityNames } from '../../../e-calculator-schemas/src/audit.dto.ts';
import { CertificationAuthoritySplitButton } from './CertificationAuthoritySplitButton.tsx';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ReactHookFormDatePicker from '../components/lib/ReactHookFormDatePicker.tsx';
import { FormTextField } from '../components/balanceSheet/forms/FormTextField.tsx';
import { BalanceSheetCreateRequestBodySchema } from '@ecogood/e-calculator-schemas/dist/balance.sheet.dto';
import { GeneralInformationSchema } from '@ecogood/e-calculator-schemas/dist/general.information.dto';
import { SaveButton } from '../components/buttons/SaveButton.tsx';

const FormInputSchema = BalanceSheetCreateRequestBodySchema.pick({
  generalInformation: true,
});

type FormInput = z.infer<typeof FormInputSchema>;

export function BalanceSheetOverviewPage() {
  const theme = useTheme();
  const data = useLoaderData<typeof loader>();
  const [open, setOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(FormInputSchema),
    mode: 'onChange',
    values: data?.generalInformation
      ? {
          generalInformation: data.generalInformation,
        }
      : undefined,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submit = useSubmit();
  function onBalanceSheetSubmit(
    authority: CertificationAuthorityNames,
    formData: FieldValues
  ) {
    const body = {
      authority,
      generalInformation: GeneralInformationSchema.parse(
        formData.generalInformation
      ),
    };
    submit(
      {
        intent: 'submitBalanceSheet',
        ...body,
      },
      {
        method: 'post',
        encType: 'application/json',
      }
    );
  }

  function onSaveClick(data: FieldValues) {
    const body = {
      generalInformation: GeneralInformationSchema.parse(
        data.generalInformation
      ),
    };
    submit(
      {
        intent: 'updateBalanceSheet',
        ...body,
      },
      {
        method: 'post',
        encType: 'application/json',
      }
    );
  }

  function onResetAudit() {
    submit(
      {
        intent: 'deleteAudit',
        auditId: data!.audit!.id,
      },
      {
        method: 'delete',
        encType: 'application/json',
      }
    );
  }

  return (
    <FormContainer spacing={2}>
      <GridItem xs={12}>
        <Typography variant="h1">
          <Trans>General information</Trans>
        </Typography>
      </GridItem>
      <GridItem xs={12}>
        <GridContainer spacing={2}>
          <GridItem xs={12} sm={4}>
            <FormTextField
              label={<Trans>Organization name</Trans>}
              errors={errors}
              register={register}
              registerKey={'generalInformation.company.name'}
            />
          </GridItem>
          <GridItem xs={12} sm={4}>
            <FormTextField
              label={<Trans>Contact name</Trans>}
              errors={errors}
              register={register}
              registerKey={'generalInformation.contactPerson.name'}
            />
          </GridItem>
          <GridItem xs={12} sm={4}>
            <FormTextField
              label={<Trans>Contact email</Trans>}
              errors={errors}
              register={register}
              registerKey={'generalInformation.contactPerson.email'}
            />
          </GridItem>
          <GridItem xs={12}>
            <GridContainer spacing={2}>
              <GridItem xs={12} sm={4}>
                <ReactHookFormDatePicker
                  label={<Trans>Start of reporting period</Trans>}
                  control={control}
                  name={'generalInformation.period.start'}
                />
              </GridItem>
              <GridItem xs={12} sm={4}>
                <ReactHookFormDatePicker
                  label={<Trans>End of reporting period</Trans>}
                  control={control}
                  name={'generalInformation.period.end'}
                />
              </GridItem>
            </GridContainer>
          </GridItem>
          {!data?.audit && !data?.isMemberOfCertificationAuthority && (
            <GridItem xs={12}>
              <CertificationAuthoritySplitButton
                handleSubmit={handleSubmit}
                onClick={onBalanceSheetSubmit}
              />
            </GridItem>
          )}
          {data?.audit && data?.isMemberOfCertificationAuthority && (
            <GridItem xs={3}>
              <SaveButton
                handleSubmit={handleSubmit}
                onSaveClick={onSaveClick}
              />
            </GridItem>
          )}
        </GridContainer>
      </GridItem>
      <GridItem xs={12}>
        <Typography variant="h1">
          <Trans>Matrix representation</Trans>
        </Typography>
      </GridItem>
      <GridItem>
        {data?.matrix && (
          <GridContainer spacing={2}>
            <GridItem>
              <Card>
                <CardContent>
                  <GridContainer
                    alignItems={'center'}
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <GridItem>
                      <Avatar src="/icon_ECG_seeds.png" />
                    </GridItem>
                    <GridItem>
                      <Typography variant={'h1'}>
                        <Trans>Total points:</Trans>
                      </Typography>
                    </GridItem>
                    <GridItem>
                      <BigNumber
                        $color={theme.palette.primary.main}
                      >{`${data.matrix.totalPoints.toFixed(0)} / 1000`}</BigNumber>
                    </GridItem>
                    {data.audit ? (
                      <>
                        <GridItem>
                          <Typography variant={'h1'}>
                            {data.audit.certificationAuthority ===
                            CertificationAuthorityNames.AUDIT ? (
                              <Trans>Audit process number</Trans>
                            ) : (
                              <Trans>Peer-Group process number</Trans>
                            )}
                          </Typography>
                        </GridItem>
                        <GridItem>
                          <BigNumber
                            aria-label={`Audit process number`}
                            $color={theme.palette.primary.main}
                          >{`${data.audit.id.toFixed(0)}`}</BigNumber>
                        </GridItem>
                        {data.isMemberOfCertificationAuthority && (
                          <GridItem>
                            <Button
                              variant={'outlined'}
                              color={'error'}
                              onClick={handleClickOpen}
                            >
                              <Trans>Reset audit process</Trans>
                            </Button>
                          </GridItem>
                        )}
                      </>
                    ) : null}
                  </GridContainer>
                </CardContent>
              </Card>
            </GridItem>
            <GridItem xs={12}>
              <MatrixView matrix={data.matrix} />
            </GridItem>
          </GridContainer>
        )}
      </GridItem>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          <Trans>Reset audit process</Trans>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Trans>
              Once you reset a audit process, there is no going back. Please be
              certain.
            </Trans>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <Trans>Cancel</Trans>
          </Button>
          <Button onClick={onResetAudit} autoFocus>
            <Trans>Ok</Trans>
          </Button>
        </DialogActions>
      </Dialog>
    </FormContainer>
  );
}

export async function loader(
  { params }: LoaderFunctionArgs,
  handlerCtx: unknown
) {
  const { userData, isMemberOfCertificationAuthority, lng } =
    handlerCtx as HandlerContext;
  if (!userData) {
    return null;
  }

  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
  );
  const balanceSheetId = Number(params.balanceSheetId);
  return {
    matrix: await apiClient.getBalanceSheetAsMatrix(balanceSheetId),
    audit: isMemberOfCertificationAuthority
      ? await apiClient.findAuditByBalanceSheet(balanceSheetId, 'auditCopyId')
      : await apiClient.findAuditByBalanceSheet(
          balanceSheetId,
          'submittedBalanceSheetId'
        ),
    isMemberOfCertificationAuthority: isMemberOfCertificationAuthority,
    generalInformation:
      await apiClient.getBalanceSheetGeneralInformation(balanceSheetId),
  };
}

export async function action(
  { params, request }: ActionFunctionArgs,
  handlerCtx: unknown
) {
  const { intent, ...rest } = await request.json();
  const { userData, isMemberOfCertificationAuthority, lng } =
    handlerCtx as HandlerContext;

  if (!userData || !params.balanceSheetId) {
    return null;
  }
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
  );

  if (intent === 'submitBalanceSheet') {
    const id = parseInt(params.balanceSheetId);
    await apiClient.updateBalanceSheet(id, {
      generalInformation: rest.generalInformation,
    });
    return await apiClient.submitBalanceSheetToAudit(id, rest.authority);
  }

  if (intent === 'updateBalanceSheet') {
    const id = parseInt(params.balanceSheetId);
    const message =
      lng === 'en' ? `Saved succesfully` : `Speichern erfolgreich`;
    enqueueSnackbar(message, {
      variant: 'success',
    });
    return await apiClient.updateBalanceSheet(id, {
      generalInformation: rest.generalInformation,
    });
  }

  if (intent === 'deleteAudit') {
    if (isMemberOfCertificationAuthority) {
      await apiClient.deleteAudit(parseInt(rest.auditId));
      const message =
        lng === 'en'
          ? `Successfully reset audit with id ${rest.auditId}`
          : `Audit mit ID ${rest.auditId} erfolgreich zurückgesetzt.`;
      enqueueSnackbar(message, {
        variant: 'success',
      });
      return redirect(`/`);
    } else {
      throw json(
        { message: 'You are not allowed to delete audits' },
        { status: 403 }
      );
    }
  }

  throw json({ message: 'Invalid intent' }, { status: 400 });
}
