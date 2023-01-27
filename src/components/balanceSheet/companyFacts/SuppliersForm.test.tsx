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
    expect(input).toHaveValue('900');
    await user.clear(input);
    await user.type(input, '800');
    expect(input).toHaveValue('800');
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    expect(updateCompanyFacts).toHaveBeenCalledWith({
      ...CompanyFactsMocks.companyFacts1(),
      totalPurchaseFromSuppliers: 800,
      mainOriginOfOtherSuppliers:
        CompanyFactsMocks.companyFacts1().mainOriginOfOtherSuppliers
          .countryCode,
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
      mainOriginOfOtherSuppliers:
        CompanyFactsMocks.companyFacts1().mainOriginOfOtherSuppliers
          .countryCode,
    });
  });

  it('adding supply fraction without region selected leads to form error', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <SuppliersForm
        companyFacts={{
          ...CompanyFactsMocks.companyFacts1(),
          supplyFractions: [],
        }}
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

    expect(updateCompanyFacts).not.toHaveBeenCalled();
  });

  it('saves changes of main origin region', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <SuppliersForm
        companyFacts={{ ...CompanyFactsMocks.companyFacts1() }}
        regions={regionsMocks.regions1()}
        industries={industriesMocks.industries1()}
      />
    );
    const searchField = screen.getByLabelText(
      'mainOriginOfOtherSuppliers.countryCode'
    );
    const region = regionsMocks.regions1()[3];
    await user.type(searchField, region.countryCode);

    const foundRegion = screen.getByRole('option', {
      name: `${region.countryCode} ${region.countryName}`,
    });
    await user.click(foundRegion);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(updateCompanyFacts).toHaveBeenCalledWith({
      ...CompanyFactsMocks.companyFacts1(),
      mainOriginOfOtherSuppliers: region.countryCode,
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
    const expectedSupplyFractions = [
      ...CompanyFactsMocks.companyFacts1().supplyFractions.slice(1),
    ];
    expect(updateCompanyFacts).toHaveBeenCalledWith({
      ...CompanyFactsMocks.companyFacts1(),
      supplyFractions: expectedSupplyFractions,
      mainOriginOfOtherSuppliers:
        CompanyFactsMocks.companyFacts1().mainOriginOfOtherSuppliers
          .countryCode,
    });
  });

  it('main origin of other suppliers field is readonly', async () => {
    renderWithTheme(
      <SuppliersForm
        companyFacts={{ ...CompanyFactsMocks.companyFacts1() }}
        regions={regionsMocks.regions1()}
        industries={industriesMocks.industries1()}
      />
    );
    const mainOriginOfOtherSuppliersFieldBeforeUpdate = screen.getByLabelText(
      `mainOriginOfOtherSuppliers.costs`
    );

    expect(
      within(mainOriginOfOtherSuppliersFieldBeforeUpdate).getByRole('textbox')
    ).toHaveAttribute('readonly');
  });

  it('main origin of other suppliers updates if costs of supply fraction change', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <SuppliersForm
        companyFacts={{ ...CompanyFactsMocks.companyFacts1() }}
        regions={regionsMocks.regions1()}
        industries={industriesMocks.industries1()}
      />
    );
    const mainOriginOfOtherSuppliersFieldBeforeUpdate = screen.getByLabelText(
      `mainOriginOfOtherSuppliers.costs`
    );

    expect(
      within(mainOriginOfOtherSuppliersFieldBeforeUpdate).getByRole('textbox')
    ).toHaveValue((900 - 388 - 54).toString());

    for (const index in CompanyFactsMocks.companyFacts1().supplyFractions) {
      const costsInputField = within(
        screen.getByLabelText(`supplyFractions.${index}.costs`)
      ).getByRole('textbox');
      await user.clear(costsInputField);
      await user.type(costsInputField, '20');
    }
    const mainOriginOfOtherSuppliersField = screen.getByLabelText(
      `mainOriginOfOtherSuppliers.costs`
    );

    expect(
      within(mainOriginOfOtherSuppliersField).getByRole('textbox')
    ).toHaveValue((900 - 20 - 20).toString());
  });
});
