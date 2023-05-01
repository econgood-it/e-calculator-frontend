import {
  render,
  RenderHookOptions,
  RenderOptions,
} from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { themeOptions } from '../App';
import { FC, PropsWithChildren, ReactElement, ReactNode } from 'react';
import { renderHook } from '@testing-library/react';

const theme = createTheme({ ...themeOptions });

export const AllTheProviders: FC<{ children: ReactNode }> = ({ children }) => {
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
