import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../testUtils/rendering';
import AppRoutes from './AppRoutes';

describe('AppRoutes', () => {
  it('renders login if user unauthenticated', () => {
    renderWithTheme(<AppRoutes />, '/');
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders Home if user is authenticated', () => {
    window.localStorage.setItem('user', JSON.stringify({ token: 'testToken' }));
    renderWithTheme(<AppRoutes />, '/');
    expect(screen.getByRole('button', { name: 'home' })).toBeInTheDocument();
  });
});
