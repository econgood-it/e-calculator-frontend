import GridItem from '../layout/GridItem.tsx';
import { Card, CardContent, Typography } from '@mui/material';
import { Trans } from 'react-i18next';
import GridContainer from '../layout/GridContainer.tsx';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormTextField } from '../balanceSheet/forms/FormTextField.tsx';
import { SaveButton } from '../buttons/SaveButton.tsx';

const FormInputSchema = z.object({
  email: z.string().email(),
});
type FormInput = z.infer<typeof FormInputSchema>;

type OrganizationInvitationsProps = {
  invitations: string[];
  onInvitation: (email: string) => void;
};

export function OrganizationInvitations({
  invitations,
  onInvitation,
}: OrganizationInvitationsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(FormInputSchema),
    mode: 'onChange',
  });

  function onInvite(data: FieldValues) {
    const email = FormInputSchema.parse(data).email;
    onInvitation(email);
  }

  return (
    <GridContainer spacing={3}>
      <GridItem xs={12}>
        <Typography variant={'h1'}>
          <Trans>Invitations</Trans>
        </Typography>
      </GridItem>
      <GridItem xs={12}>
        <GridContainer spacing={3} alignItems={'center'}>
          <GridItem xs={6}>
            <FormTextField
              label={<Trans>Email</Trans>}
              errors={errors}
              register={register}
              registerKey={'email'}
            />
          </GridItem>
          <GridItem xs={6}>
            <SaveButton
              label={<Trans>Invite</Trans>}
              handleSubmit={handleSubmit}
              onSaveClick={onInvite}
            />
          </GridItem>
        </GridContainer>
      </GridItem>
      {invitations.map((invitation) => (
        <GridItem key={invitation} xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {invitation}
              </Typography>
            </CardContent>
          </Card>
        </GridItem>
      ))}
    </GridContainer>
  );
}
