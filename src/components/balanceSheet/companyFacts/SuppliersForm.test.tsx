import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import SuppliersForm from './SuppliersForm';
import userEvent from '@testing-library/user-event';
import renderWithTheme from '../../../testUtils/rendering';
import { companyFactsMock } from '../../../testUtils/balanceSheets';

describe('SuppliersForm', () => {
  it('should set default value and validate all modifications for the field total purchase from suppliers', async () => {
    const user = userEvent.setup();
    renderWithTheme(<SuppliersForm companyFacts={{ ...companyFactsMock }} />);
    const input = screen.getByRole('textbox', {
      name: 'Total purchases from suppliers',
    });
    expect(input).toHaveValue(
      companyFactsMock.totalPurchaseFromSuppliers.toString()
    );

    await user.clear(input);
    await user.type(input, 'a7');
    expect(input).toHaveValue('a7');
    expect(screen.getByText('Number expected')).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, '-7');
    expect(input).toHaveValue('-7');
    await waitFor(() =>
      expect(screen.getByText('Number should be positive')).toBeInTheDocument()
    );

    await user.clear(input);
    await user.type(input, '7');
    expect(input).toHaveValue('7');
  });

  it('renders supply fractions', async () => {
    renderWithTheme(<SuppliersForm companyFacts={{ ...companyFactsMock }} />);

    for (const index in companyFactsMock.supplyFractions) {
      // expect(
      //   screen.getByLabelText(`supplyFractions.${index}.countryCode`)
      // ).toBeInTheDocument();
      expect(
        screen.getByLabelText(`supplyFractions.${index}.costs`)
      ).toBeInTheDocument();
    }
  });
});
