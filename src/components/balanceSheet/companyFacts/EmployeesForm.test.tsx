import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithTheme from '../../../testUtils/rendering';

import {
  EmployeesMocks,
  OwnersAndFinancialServicesMocks,
} from '../../../testUtils/balanceSheets';
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';
import { useAlert } from '../../../contexts/AlertContext';
import { OwnersAndFinancialServicesForm } from './OwnersAndFinancialServicesForm';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import Element from 'react';
import { expectPositiveNumberFieldToBeValidatedAndModifiedAndSaved } from '../../../testUtils/form';
import { EmployeesForm } from './EmployeesForm';
import HTMLInputElement from 'react';

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
    const form = <EmployeesForm formData={formData} />;
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
    renderWithTheme(<EmployeesForm formData={formData} />);
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
});
