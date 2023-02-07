import Element, { ReactElement } from 'react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OwnersAndFinancialServicesMocks } from './balanceSheets';
import renderWithTheme from './rendering';
import { OwnersAndFinancialServicesForm } from '../components/balanceSheet/companyFacts/OwnersAndFinancialServicesForm';

async function checkPositiveNumberFieldValidations(
  input: Element,
  user: UserEvent
) {
  await user.clear(input);
  await user.type(input, 'a7');
  expect(input).toHaveValue('a7');
  expect(screen.getByText('Number expected')).toBeInTheDocument();
  //
  await user.clear(input);
  await user.type(input, '-7');
  expect(input).toHaveValue('-7');
  await waitFor(() =>
    expect(screen.getByText('Number should be positive')).toBeInTheDocument()
  );
}

export async function expectPositiveNumberFieldToBeValidatedAndModifiedAndSaved(
  fieldLabel: string,
  fieldKey: string,
  updateCompanyFacts: () => void,
  formData: any,
  form: ReactElement
) {
  const user = userEvent.setup();
  renderWithTheme(form);
  const input = screen.getByLabelText(fieldLabel);

  expect(input).toHaveValue(formData[fieldKey].toString());
  await checkPositiveNumberFieldValidations(input, user);
  const modifiedValue = 7;
  await user.clear(input);
  await user.type(input, modifiedValue.toString());
  expect(input).toHaveValue(modifiedValue.toString());

  const saveButton = screen.getByRole('button', { name: 'Save' });
  await user.click(saveButton);
  expect(updateCompanyFacts).toHaveBeenCalledWith({
    ...formData,
    [fieldKey]: modifiedValue,
  });
}
