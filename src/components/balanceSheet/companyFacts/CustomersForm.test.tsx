import '@testing-library/jest-dom';

import {
  CustomersMocks,
  EmployeesMocks,
} from '../../../testUtils/balanceSheets';
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';
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
import { EmployeesForm } from './EmployeesForm';
import { regionsMocks } from '../../../testUtils/regions';
import HTMLInputElement from 'react';

jest.mock('../../../contexts/ActiveBalanceSheetProvider');
jest.mock('../../../contexts/AlertContext');

describe('CustomersForm', () => {
  const updateCompanyFacts = jest.fn();

  beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({ addErrorAlert: jest.fn() });
    (useActiveBalanceSheet as jest.Mock).mockReturnValue({
      updateCompanyFacts: updateCompanyFacts,
    });
  });

  it('should modify turnover field and save changes', async () => {
    const formData = CustomersMocks.customers1();
    const form = (
      <CustomersForm
        formData={formData}
        industries={industriesMocks.industries1()}
      />
    );
    await expectPositiveNumberFieldToBeValidatedAndModifiedAndSaved(
      'Turnover',
      'turnover',
      updateCompanyFacts,
      formData as any,
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
      />
    );
    const addIndustrySectorButton = screen.getByRole('button', {
      name: 'Add',
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
          amountOfTotalTurnover: amountOfTotalTurnover / 100,
        },
      ],
    });
  });
});
