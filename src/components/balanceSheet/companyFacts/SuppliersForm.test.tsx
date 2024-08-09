import { screen, waitFor, within } from '@testing-library/react';
import SuppliersForm from './SuppliersForm';
import userEvent from '@testing-library/user-event';
import renderWithTheme from '../../../testUtils/rendering';
import {
  CompanyFactsMockBuilder,
  SuppliersMocks,
} from '../../../testUtils/balanceSheets';
import { regionsMocks } from '../../../testUtils/regions';
import { industriesMocks } from '../../../testUtils/industries';
import { useAlert } from '../../../contexts/AlertContext';
import {
  fillNumberField,
  saveForm,
  selectRegion,
} from '../../../testUtils/form';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

vi.mock('../../../contexts/AlertContext');

describe('SuppliersForm', () => {
  const updateCompanyFacts = vi.fn();

  beforeEach(() => {
    (useAlert as Mock).mockReturnValue({ addErrorAlert: vi.fn() });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should set default value and validate all modifications for the field total purchase from suppliers', async () => {
    const user = userEvent.setup();
    const companyFactsMockBuilder = new CompanyFactsMockBuilder();
    renderWithTheme(
      <SuppliersForm
        formData={companyFactsMockBuilder.build()}
        regions={regionsMocks.regions1()}
        industries={industriesMocks.industries1()}
        updateCompanyFacts={updateCompanyFacts}
      />
    );
    const input = screen.getByLabelText('Total purchases from suppliers');
    expect(input).toHaveValue(
      companyFactsMockBuilder.build().totalPurchaseFromSuppliers.toString()
    );

    await user.clear(input);
    await user.type(input, 'a7');
    expect(input).toHaveValue('a7');
    expect(screen.getByText('Number expected')).not.toBeNull();

    await user.clear(input);
    await user.type(input, '-7');
    expect(input).toHaveValue('-7');
    await waitFor(() =>
      expect(screen.getByText('Number should be positive')).toBeInTheDocument()
    );

    await user.clear(input);
    await user.type(input, '8');
    expect(input).toHaveValue('8');
  });

  it('saves changes on total purchase from suppliers field', async () => {
    const user = userEvent.setup();
    const formData = SuppliersMocks.suppliers1();
    renderWithTheme(
      <SuppliersForm
        formData={formData}
        regions={regionsMocks.regions1()}
        industries={industriesMocks.industries1()}
        updateCompanyFacts={updateCompanyFacts}
      />
    );
    const input = screen.getByLabelText('Total purchases from suppliers');
    expect(input).toHaveValue('900');
    await user.clear(input);
    await user.type(input, '800');
    expect(input).toHaveValue('800');
    await saveForm(user);
    expect(updateCompanyFacts).toHaveBeenCalledWith({
      ...formData,
      totalPurchaseFromSuppliers: 800,
      mainOriginOfOtherSuppliers:
        formData.mainOriginOfOtherSuppliers.countryCode,
    });
  });

  it('renders supply fractions', async () => {
    const formData = new CompanyFactsMockBuilder().build();
    renderWithTheme(
      <SuppliersForm
        formData={formData}
        regions={regionsMocks.regions1()}
        industries={industriesMocks.industries1()}
        updateCompanyFacts={updateCompanyFacts}
      />
    );

    for (const index in formData.supplyFractions) {
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
    const formData = SuppliersMocks.suppliers1();
    renderWithTheme(
      <SuppliersForm
        formData={formData}
        regions={regionsMocks.regions1()}
        industries={industriesMocks.industries1()}
        updateCompanyFacts={updateCompanyFacts}
      />
    );
    const newCosts = 20;
    for (const index in formData.supplyFractions) {
      await fillNumberField(user, `supplyFractions.${index}.costs`, newCosts);
    }
    const companyFactsMockBuilder = new CompanyFactsMockBuilder();
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    expect(updateCompanyFacts).toHaveBeenCalledWith({
      totalPurchaseFromSuppliers: formData.totalPurchaseFromSuppliers,
      supplyFractions: companyFactsMockBuilder
        .build()
        .supplyFractions.map((s) => ({ ...s, costs: newCosts })),
      mainOriginOfOtherSuppliers:
        companyFactsMockBuilder.build().mainOriginOfOtherSuppliers.countryCode,
    });
  });

  it('adding supply fraction without region selected leads to form error', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <SuppliersForm
        formData={{
          ...SuppliersMocks.suppliers1(),
          supplyFractions: [],
        }}
        regions={regionsMocks.regions1()}
        industries={industriesMocks.industries1()}
        updateCompanyFacts={updateCompanyFacts}
      />
    );
    const addSupplierButton = screen.getByRole('button', {
      name: 'Add supplier',
    });
    await user.click(addSupplierButton);
    await saveForm(user);

    expect(updateCompanyFacts).not.toHaveBeenCalled();
  });

  it('saves changes of main origin region', async () => {
    const user = userEvent.setup();
    const formData = SuppliersMocks.suppliers1();
    renderWithTheme(
      <SuppliersForm
        formData={formData}
        regions={regionsMocks.regions1()}
        industries={industriesMocks.industries1()}
        updateCompanyFacts={updateCompanyFacts}
      />
    );
    const selectedRegion = regionsMocks.regions1()[3];
    await selectRegion(
      user,
      'mainOriginOfOtherSuppliers.countryCode',
      selectedRegion
    );
    await saveForm(user);

    expect(updateCompanyFacts).toHaveBeenCalledWith({
      ...formData,
      mainOriginOfOtherSuppliers: selectedRegion.countryCode,
    });
  });

  it('removes supply fraction and saves changes', async () => {
    const user = userEvent.setup();
    const formData = SuppliersMocks.suppliers1();
    renderWithTheme(
      <SuppliersForm
        formData={formData}
        regions={regionsMocks.regions1()}
        industries={industriesMocks.industries1()}
        updateCompanyFacts={updateCompanyFacts}
      />
    );
    const removeSupplierButton = screen.getByRole('button', {
      name: `Remove supplyFractions with 0`,
    });
    await user.click(removeSupplierButton);
    await saveForm(user);
    const expectedSupplyFractions = [...formData.supplyFractions.slice(1)];
    expect(updateCompanyFacts).toHaveBeenCalledWith({
      totalPurchaseFromSuppliers: 900,
      supplyFractions: expectedSupplyFractions,
      mainOriginOfOtherSuppliers:
        formData.mainOriginOfOtherSuppliers.countryCode,
    });
  });

  it('main origin of other suppliers field is readonly', async () => {
    const formData = SuppliersMocks.suppliers1();
    renderWithTheme(
      <SuppliersForm
        formData={formData}
        regions={regionsMocks.regions1()}
        industries={industriesMocks.industries1()}
        updateCompanyFacts={updateCompanyFacts}
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
    const formData = SuppliersMocks.suppliers1();
    renderWithTheme(
      <SuppliersForm
        formData={formData}
        regions={regionsMocks.regions1()}
        industries={industriesMocks.industries1()}
        updateCompanyFacts={updateCompanyFacts}
      />
    );
    const mainOriginOfOtherSuppliersFieldBeforeUpdate = screen.getByLabelText(
      `mainOriginOfOtherSuppliers.costs`
    );

    expect(
      within(mainOriginOfOtherSuppliersFieldBeforeUpdate).getByRole('textbox')
    ).toHaveValue((900 - 388 - 54).toString());

    const newCosts = 20;
    for (const index in formData.supplyFractions) {
      await fillNumberField(user, `supplyFractions.${index}.costs`, newCosts);
    }
    const mainOriginOfOtherSuppliersField = screen.getByLabelText(
      `mainOriginOfOtherSuppliers.costs`
    );

    expect(
      within(mainOriginOfOtherSuppliersField).getByRole('textbox')
    ).toHaveValue(
      (900 - newCosts * formData.supplyFractions.length).toString()
    );
  });
});
