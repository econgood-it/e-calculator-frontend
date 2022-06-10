import { render, RenderResult } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { themeOptions } from '../App';
import { ReactElement } from 'react';

const theme = createTheme(themeOptions);

export const renderWithTheme = (ui: ReactElement): RenderResult => {
  return render(
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MuiThemeProvider>
  );
};
