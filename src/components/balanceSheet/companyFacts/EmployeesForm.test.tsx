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
});
