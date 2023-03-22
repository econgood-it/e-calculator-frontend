import Element, { ReactElement } from 'react';

import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithTheme from './rendering';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import { Region } from '../models/Region';
import { Industry } from '../models/Industry';

async function checkNumberFieldValidations(
  isPositveNumber: boolean,
  input: Element,
  user: UserEvent
) {
  await user.clear(input);
  await user.type(input, 'a7');
  expect(input).toHaveValue('a7');
  expect(screen.getByText('Number expected')).toBeInTheDocument();
  //

  if (isPositveNumber) {
    await user.clear(input);
    await user.type(input, '-7');
    expect(input).toHaveValue('-7');
    await waitFor(() =>
      expect(screen.getByText('Number should be positive')).toBeInTheDocument()
    );
  }
}

export async function expectPositiveNumberFieldToBeValidatedAndModifiedAndSaved(
  isPositveNumber: boolean,
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
  await checkNumberFieldValidations(isPositveNumber, input, user);
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

export async function saveForm(user: UserEvent) {
  const saveButton = screen.getByRole('button', { name: 'Save' });
  await user.click(saveButton);
}

export async function fillNumberField(
  user: UserEvent,
  labelOfField: string,
  value: number
) {
  const percentageField = within(screen.getByLabelText(labelOfField)).getByRole(
    'textbox'
  );
  await user.clear(percentageField);
  await user.type(percentageField, value.toString());
}

export async function selectRegion(
  user: UserEvent,
  labelOfSearchField: string,
  regionToSelect: Region
) {
  const searchField = screen.getByLabelText(labelOfSearchField);
  await user.type(searchField, regionToSelect.countryCode);

  const foundRegion = screen.getByRole('option', {
    name: `${regionToSelect.countryCode} ${regionToSelect.countryName}`,
  });
  await user.click(foundRegion);
}

export async function selectIndustry(
  user: UserEvent,
  labelOfSearchField: string,
  industryToSelect: Industry
) {
  const searchField = screen.getByLabelText(labelOfSearchField);
  await user.type(searchField, industryToSelect.industryCode);

  const foundRegion = screen.getByRole('option', {
    name: `${industryToSelect.industryCode} - ${industryToSelect.industryName}`,
  });
  await user.click(foundRegion);
}
