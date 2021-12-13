import { Button, Grid, TextField } from '@mui/material';
import { Dispatch, SetStateAction, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { User } from '../authentication/User';
import axios from 'axios';
import { API_URL } from '../configuration';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertContext } from '../alerts/AlertContext';

const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
`;
const LoginFormGrid = styled(Grid)`
  max-width: 400px;
`;

const DoorLogo = styled.img`
  width: 80px;
`;

type LoginPageProps = {
  setUser: Dispatch<SetStateAction<User | undefined>>;
};

const FormInputSchema = z.object({
  email: z.string().email('Email nicht valide'),
  password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein'),
});
type FormInput = z.infer<typeof FormInputSchema>;

export const LoginPage = ({ setUser }: LoginPageProps) => {
  const { addAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({ resolver: zodResolver(FormInputSchema) });

  const onSubmit = async (data: FormInput) => {
    try {
      const result = await axios.post(`${API_URL}/v1/users/token`, {
        email: data.email,
        password: data.password,
      });

      const user = result.data;
      window.localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      navigate('/');
    } catch (e) {
      addAlert({
        severity: 'error',
        msg: 'Login fehlgeschlagen',
      });
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
