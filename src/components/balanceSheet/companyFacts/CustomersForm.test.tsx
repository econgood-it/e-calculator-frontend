import { CustomersMocks } from '../../../testUtils/balanceSheets';
import { useAlert } from '../../../contexts/AlertContext';
import {
  expectPositiveNumberFieldToBeValidatedAndModifiedAndSaved,
  fillNumberField,
  saveForm,
  selectIndustry,
} from '../../../testUtils/form';
import { CustomersForm } from './CustomersForm';
import userEvent from '@testing-library/user-event';
import renderWithTheme from '../../../testUtils/rendering';
import { screen } from '@testing-library/react';
import { industriesMocks } from '../../../testUtils/industries';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

vi.mock('../../../contexts/AlertContext');

describe('CustomersForm', () => {
  const updateCompanyFacts = vi.fn();

  beforeEach(() => {
    (useAlert as Mock).mockReturnValue({ addErrorAlert: vi.fn() });
  });

  it('should modify turnover field and save changes', async () => {
    const formData = CustomersMocks.customers1();
    const form = (
      <CustomersForm
        formData={formData}
        industries={industriesMocks.industries1()}
        updateCompanyFacts={updateCompanyFacts}
      />
    );
    await expectPositiveNumberFieldToBeValidatedAndModifiedAndSaved(
      true,
      'Turnover',
      'turnover',
      updateCompanyFacts,
      formData as any, // eslint-disable-line
      form
    );
  });

  it('switches are your customers mainly other companies on and recognize modification', async () => {
    const user = userEvent.setup();
    const formData = CustomersMocks.customers1();
    renderWithTheme(
      <CustomersForm
        formData={formData}
        industries={industriesMocks.industries1()}
        updateCompanyFacts={updateCompanyFacts}
      />
    );
    const switchField = screen.getByRole('checkbox', {
      name: 'Are your customers mainly other companies?',
    });
    expect((switchField as HTMLInputElement).checked).toBeFalsy();
    await user.click(switchField);
    await saveForm(user);
    expect(updateCompanyFacts).toHaveBeenCalledWith({
      ...formData,
      isB2B: true,
    });
  });

  it('adds industry sector and modify and save its fields', async () => {
    const user = userEvent.setup();
    const formData = CustomersMocks.customers1();
    renderWithTheme(
      <CustomersForm
        formData={formData}
        industries={industriesMocks.industries1()}
        updateCompanyFacts={updateCompanyFacts}
      />
    );
    const addIndustrySectorButton = screen.getByRole('button', {
      name: 'Add industry sector',
    });
    await user.click(addIndustrySectorButton);
    const indexOfAddedIndustrySector =
      CustomersMocks.customers1().industrySectors.length;
    const selectedIndustry = industriesMocks.industries1()[2];
    await selectIndustry(
      user,
      `industrySectors.${indexOfAddedIndustrySector}.industryCode`,
      selectedIndustry
    );
    const amountOfTotalTurnover = 40;
    await fillNumberField(
      user,
      `industrySectors.${indexOfAddedIndustrySector}.amountOfTotalTurnover`,
      amountOfTotalTurnover
    );
    await saveForm(user);

    expect(updateCompanyFacts).toHaveBeenCalledWith({
      ...formData,
      industrySectors: [
        ...formData.industrySectors,
        {
          description: '',
          industryCode: selectedIndustry.industryCode,
          amountOfTotalTurnover: amountOfTotalTurnover,
        },
      ],
    });
  }, 10000);
});
