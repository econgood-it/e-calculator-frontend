import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import SuppliersForm from './SuppliersForm';
import userEvent from '@testing-library/user-event';
import renderWithTheme from '../../../testUtils/rendering';

describe('SuppliersForm', () => {
  it('should validate total purchase from suppliers field', async () => {
    const user = userEvent.setup();
    renderWithTheme(<SuppliersForm />);
    const input = screen.getByRole('textbox', {
      name: 'Total purchases from suppliers',
    });
    expect(input).toBeInTheDocument();
    await user.type(input, '-7');
    expect(input).toHaveValue('-7');
    expect(screen.getByText('Number should be positive')).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, 'a7');
    expect(input).toHaveValue('a7');
    expect(screen.getByText('Number expected')).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, '7');
    expect(input).toHaveValue('7');
  });
});
