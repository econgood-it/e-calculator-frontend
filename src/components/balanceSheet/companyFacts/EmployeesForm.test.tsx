import '@testing-library/jest-dom';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithTheme from '../../../testUtils/rendering';

import { EmployeesMocks } from '../../../testUtils/balanceSheets';
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';
import { useAlert } from '../../../contexts/AlertContext';
import HTMLInputElement from 'react';
import {
  expectPositiveNumberFieldToBeValidatedAndModifiedAndSaved,
  fillNumberField,
  saveForm,
  selectRegion,
} from '../../../testUtils/form';
import { EmployeesForm } from './EmployeesForm';
import { regionsMocks } from '../../../testUtils/regions';

jest.mock('../../../contexts/ActiveBalanceSheetProvider');
jest.mock('../../../contexts/AlertContext');

describe('EmployeesForm', () => {
  const updateCompanyFacts = jest.fn();

  beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({ addErrorAlert: jest.fn() });
    (useActiveBalanceSheet as jest.Mock).mockReturnValue({
      updateCompanyFacts: updateCompanyFacts,
    });
  });

  async function shouldModifyFieldSaveResults(
    fieldLabel: string,
    fieldKey: string
  ) {
    const formData = EmployeesMocks.employees1();
    const form = (
      <EmployeesForm formData={formData} regions={regionsMocks.regions1()} />
    );
    await expectPositiveNumberFieldToBeValidatedAndModifiedAndSaved(
      fieldLabel,
      fieldKey,
      updateCompanyFacts,
      formData as any,
      form
    );
  }

  it('should modify number of employees field and save changes', async () => {
    await shouldModifyFieldSaveResults(
      'Number of employees (full time equivalents)',
      'numberOfEmployees'
    );
  });

  it('should modify total staff costs field and save changes', async () => {
    await shouldModifyFieldSaveResults(
      'Staff costs (gross without employer contribution)',
      'totalStaffCosts'
    );
  });

  it('should modify average journey to work field and save changes', async () => {
    await shouldModifyFieldSaveResults(
      'Average journey to work for staff (in km)',
      'averageJourneyToWorkForStaffInKm'
    );
  });

  it('should check has canteen switch on and recognize modification', async () => {
    const user = userEvent.setup();
    const formData = EmployeesMocks.employees1();
    renderWithTheme(
      <EmployeesForm formData={formData} regions={regionsMocks.regions1()} />
    );
    const switchField = screen.getByRole('checkbox', {
      name: 'Is there a canteen for the majority of staff?',
    });
    expect((switchField as HTMLInputElement).checked).toBeFalsy();
    await user.click(switchField);
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    expect(updateCompanyFacts).toHaveBeenCalledWith({
      ...formData,
      hasCanteen: true,
    });
  });

  it('adding employees fraction without region selected leads to form error', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <EmployeesForm
        formData={{
          ...EmployeesMocks.employees1(),
        }}
        regions={regionsMocks.regions1()}
      />
    );
    const addEmployeesOriginButton = screen.getByRole('button', {
      name: 'Add employees origin',
    });
    await user.click(addEmployeesOriginButton);
    await saveForm(user);

    expect(updateCompanyFacts).not.toHaveBeenCalled();
  });

  it('adds employees fraction and modify and save its fields', async () => {
    const user = userEvent.setup();
    const formData = EmployeesMocks.employees1();
    renderWithTheme(
      <EmployeesForm formData={formData} regions={regionsMocks.regions1()} />
    );
    const addEmployeesOriginButton = screen.getByRole('button', {
      name: 'Add employees origin',
    });
    await user.click(addEmployeesOriginButton);
    const indexOfAddedEmployeesFraction =
      EmployeesMocks.employees1().employeesFractions.length;
    const selectedRegion = regionsMocks.regions1()[3];
    await selectRegion(
      user,
      `employeesFractions.${indexOfAddedEmployeesFraction}.countryCode`,
      selectedRegion
    );
    const percentage = 40;
    await fillNumberField(
      user,
      `employeesFractions.${indexOfAddedEmployeesFraction}.percentage`,
      percentage
    );
    await saveForm(user);

    expect(updateCompanyFacts).toHaveBeenCalledWith({
      ...formData,
      employeesFractions: [
        ...formData.employeesFractions,
        { countryCode: selectedRegion.countryCode, percentage: 0.4 },
      ],
    });
  });

  it('removes employees fraction and saves changes', async () => {
    const user = userEvent.setup();
    const formData = EmployeesMocks.employees1();
    renderWithTheme(
      <EmployeesForm formData={formData} regions={regionsMocks.regions1()} />
    );
    const removeEmployeesFractionButton = screen.getByRole('button', {
      name: `Remove employees origin with 0`,
    });
    await user.click(removeEmployeesFractionButton);
    await saveForm(user);

    expect(updateCompanyFacts).toHaveBeenCalledWith({
      ...formData,
      employeesFractions: [],
    });
  });
});
