import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../testUtils/rendering';
import Sidebar from './Sidebar';

describe('Sidebar', () => {
  it('renders title', async () => {
    renderWithTheme(<Sidebar />);
    expect(screen.getByText('Persistent drawer')).toBeInTheDocument();
  });
});
