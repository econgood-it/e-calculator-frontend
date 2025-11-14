import {
  render,
  renderHook,
  RenderHookOptions,
  RenderOptions,
} from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { themeOptions } from '../App';
import { FC, ReactElement, ReactNode } from 'react';
import userEvent from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';

const theme = createTheme({ ...themeOptions });

export const AllTheProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en'}>
            {children}
          </LocalizationProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

const renderWithTheme = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const user = userEvent.setup();
  return { result: render(ui, { wrapper: AllTheProviders, ...options }), user };
};

export function renderHookWithTheme<TProps, TResult>(
  callback: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps>
) {
  function DefaultWrapper({ children }: { children: ReactNode }) {
    return <>{children}</>;
  }
  function Wrapper({ children }: { children: ReactElement }) {
    const GivenWrapper = options?.wrapper || DefaultWrapper;
    return (
      <AllTheProviders>
        <GivenWrapper>{children}</GivenWrapper>
      </AllTheProviders>
    );
  }

  return renderHook(callback, { ...options, wrapper: Wrapper });
}

export default renderWithTheme;
