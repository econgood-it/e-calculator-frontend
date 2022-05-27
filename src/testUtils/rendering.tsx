import { render, RenderResult } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { themeOptions } from '../App';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

const theme = createTheme(themeOptions);

const renderWithRouter = (ui: ReactElement, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return render(ui, { wrapper: BrowserRouter });
};

export const renderWithTheme = (
  ui: ReactElement,
  route: string = '/'
): RenderResult => {
  return renderWithRouter(
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MuiThemeProvider>,
    { route: route }
  );
};
