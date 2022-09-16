import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import SuppliersForm from './SuppliersForm';
import userEvent from '@testing-library/user-event';
import renderWithTheme from '../../../testUtils/rendering';
import {
  BalanceSheetMocks,
  CompanyFactsMocks,
} from '../../../testUtils/balanceSheets';
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';
jest.mock('../../../contexts/ActiveBalanceSheetProvider');

describe('SuppliersForm', () => {
  const updateCompanyFacts = jest.fn();

  beforeEach(() => {
    (useActiveBalanceSheet as jest.Mock).mockReturnValue({
      balanceSheet: { ...BalanceSheetMocks.balanceSheet1() },
      updateCompanyFacts: updateCompanyFacts,
    });
  });

  it('should set default value and validate all modifications for the field total purchase from suppliers', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <SuppliersForm companyFacts={CompanyFactsMocks.companyFacts1()} />
    );
    const input = screen.getByLabelText('Total purchases from suppliers');
    expect(input).toHaveValue(
      CompanyFactsMocks.companyFacts1().totalPurchaseFromSuppliers.toString()
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

  it('saves changes on total purchase from suppliers field', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <SuppliersForm companyFacts={CompanyFactsMocks.companyFacts1()} />
    );
    const input = screen.getByLabelText('Total purchases from suppliers');
    await user.clear(input);
    await user.type(input, '20');
    expect(input).toHaveValue('20');
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    expect(updateCompanyFacts).toHaveBeenCalledWith({
      ...CompanyFactsMocks.companyFacts1(),
      totalPurchaseFromSuppliers: 20,
    });
  });

  it('renders supply fractions', async () => {
    renderWithTheme(
      <SuppliersForm companyFacts={{ ...CompanyFactsMocks.companyFacts1() }} />
    );

    for (const index in CompanyFactsMocks.companyFacts1().supplyFractions) {
      // expect(
      //   screen.getByLabelText(`supplyFractions.${index}.countryCode`)
      // ).toBeInTheDocument();
      expect(
        screen.getByLabelText(`supplyFractions.${index}.costs`)
      ).toBeInTheDocument();
    }
  });
});
