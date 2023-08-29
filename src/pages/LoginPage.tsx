import { Button, Grid, TextField } from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { API_URL } from '../configuration';
import { useAlert } from '../contexts/AlertContext';
import { useTranslation } from 'react-i18next';
import { AuthApiClient, makeWretchInstance } from '../api/api.client';
import { CenteredDiv } from '../components/layout/CenteredDiv';
import { useUser } from '../contexts/UserProvider';

const LoginFormGrid = styled(Grid)`
  max-width: 400px;
`;

const DoorLogo = styled.img`
  width: 80px;
`;

const FormInputSchema = z.object({
  email: z.string().email('Email nicht valide'),
  password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein'),
});
type FormInput = z.infer<typeof FormInputSchema>;

export const LoginPage = () => {
  const { t } = useTranslation();
  const { addErrorAlert } = useAlert();
  const { updateUser } = useUser();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({ resolver: zodResolver(FormInputSchema) });

  const onSubmit = async (data: FormInput) => {
    try {
      const result = new AuthApiClient(makeWretchInstance(API_URL, 'en'));
      const user = await result.login(data.email, data.password);
      window.localStorage.setItem('user', JSON.stringify(user));
      updateUser(user);
      navigate('/');
    } catch (e) {
      addErrorAlert(t`Login failed`);
    }
  };

  return (
    <CenteredDiv>
      <LoginFormGrid container spacing={2}>
        <Grid item xs={12}>
          <DoorLogo src={'icon_door_green.png'} alt="this is a door image" />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            {...register('email')}
            id="outlined-required"
            label="Email"
            name={'email'}
            placeholder="Email"
            error={!!errors.email}
            helperText={errors.email && errors.email.message}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            type={'password'}
            fullWidth
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password && errors.password.message}
            id="outlined-required"
            label="Passwort"
            name={'password'}
            placeholder="Passwort"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            onClick={handleSubmit(onSubmit)}
            variant="contained"
          >
            Login
          </Button>
        </Grid>
      </LoginFormGrid>
    </CenteredDiv>
  );
};
