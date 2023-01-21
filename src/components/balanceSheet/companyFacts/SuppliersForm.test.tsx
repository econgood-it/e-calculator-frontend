import '@testing-library/jest-dom';
import { screen, waitFor, within } from '@testing-library/react';
import SuppliersForm from './SuppliersForm';
import userEvent from '@testing-library/user-event';
import renderWithTheme from '../../../testUtils/rendering';
import {
  BalanceSheetMocks,
  CompanyFactsMocks,
} from '../../../testUtils/balanceSheets';
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';
import { regionsMocks } from '../../../testUtils/regions';
import { industriesMocks } from '../../../testUtils/industries';
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
      <SuppliersForm
        companyFacts={CompanyFactsMocks.companyFacts1()}
        regions={regionsMocks.regions1()}
        industries={industriesMocks.industries1()}
      />
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
      <SuppliersForm
        companyFacts={CompanyFactsMocks.companyFacts1()}
        regions={regionsMocks.regions1()}
        industries={industriesMocks.industries1()}
      />
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
      <SuppliersForm
        companyFacts={{ ...CompanyFactsMocks.companyFacts1() }}
        regions={regionsMocks.regions1()}
        industries={industriesMocks.industries1()}
      />
    );

    for (const index in CompanyFactsMocks.companyFacts1().supplyFractions) {
      expect(
        screen.getByLabelText(`supplyFractions.${index}.costs`)
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(`supplyFractions.${index}.countryCode`)
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(`supplyFractions.${index}.industryCode`)
      ).toBeInTheDocument();
    }
  });

  it('saves changes of the supply fractions costs', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <SuppliersForm
        companyFacts={{ ...CompanyFactsMocks.companyFacts1() }}
        regions={regionsMocks.regions1()}
        industries={industriesMocks.industries1()}
      />
    );
    for (const index in CompanyFactsMocks.companyFacts1().supplyFractions) {
      const costsInputField = within(
        screen.getByLabelText(`supplyFractions.${index}.costs`)
      ).getByRole('textbox');
      await user.clear(costsInputField);
      await user.type(costsInputField, '20');
    }
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    expect(updateCompanyFacts).toHaveBeenCalledWith({
      ...CompanyFactsMocks.companyFacts1(),
      supplyFractions: CompanyFactsMocks.companyFacts1().supplyFractions.map(
        (s) => ({ ...s, costs: 20 })
      ),
    });
  });

  it('adds supply fraction and saves changes', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <SuppliersForm
        companyFacts={{ ...CompanyFactsMocks.companyFacts1() }}
        regions={regionsMocks.regions1()}
        industries={industriesMocks.industries1()}
      />
    );
    const addSupplierButton = screen.getByRole('button', {
      name: 'Add supplier',
    });
    await user.click(addSupplierButton);
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    expect(updateCompanyFacts).toHaveBeenCalledWith({
      ...CompanyFactsMocks.companyFacts1(),
      supplyFractions: [
        ...CompanyFactsMocks.companyFacts1().supplyFractions,
        { countryCode: undefined, industryCode: undefined, costs: 0 },
      ],
    });
  });

  it('removes supply fraction and saves changes', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <SuppliersForm
        companyFacts={{ ...CompanyFactsMocks.companyFacts1() }}
        regions={regionsMocks.regions1()}
        industries={industriesMocks.industries1()}
      />
    );
    const removeSupplierButton = screen.getByRole('button', {
      name: `Remove supply fraction with 0`,
    });
    await user.click(removeSupplierButton);
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    expect(updateCompanyFacts).toHaveBeenCalledWith({
      ...CompanyFactsMocks.companyFacts1(),
      supplyFractions: [
        ...CompanyFactsMocks.companyFacts1().supplyFractions.slice(1),
      ],
    });
  });
});
