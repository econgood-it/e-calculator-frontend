import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../testUtils/rendering';
import MiniDrawer from './MiniDrawer';
import userEvent from '@testing-library/user-event';

describe('MiniDrawer', () => {
  it('renders title', async () => {
    renderWithTheme(<MiniDrawer />);
    expect(screen.getByText('Mini variant drawer')).toBeInTheDocument();
  });

  it('opens drawer if user clicks on bars icon', async () => {
    renderWithTheme(<MiniDrawer />);
    const listItem = screen.getByText('Balance sheets').closest('div');
    expect(listItem).toHaveStyle(`opacity: 0`);
    userEvent.click(screen.getByRole('button', { name: 'open drawer' }));
    expect(listItem).toHaveStyle(`opacity: 1`);

    // expect(screen.getByText('Balance sheets')).toBeInTheDocument();
  });
});
