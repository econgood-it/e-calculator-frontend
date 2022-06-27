import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { themeOptions } from '../App';
import { FC, ReactElement, ReactNode } from 'react';

const theme = createTheme({ ...themeOptions });

const AllTheProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </MuiThemeProvider>
  );
};

const renderWithTheme = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export default renderWithTheme;
