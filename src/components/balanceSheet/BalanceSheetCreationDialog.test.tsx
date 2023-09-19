import '@testing-library/jest-dom';
import renderWithTheme from '../../testUtils/rendering';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAlert } from '../../contexts/AlertContext';

import { useBalanceSheetItems } from '../../contexts/BalanceSheetListProvider';
import {
  BalanceSheetType,
  BalanceSheetVersion,
} from '@ecogood/e-calculator-schemas/dist/shared.schemas';
import { BalanceSheetCreationDialog } from './BalanceSheetCreationDialog';

jest.mock('../../contexts/AlertContext');
jest.mock('../../contexts/BalanceSheetListProvider');
describe('BalanceSheetCreationDialog', () => {
  const createBalanceSheetMock = jest.fn();

  beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({ addErrorAlert: jest.fn() });
    (useBalanceSheetItems as jest.Mock).mockReturnValue({
      createBalanceSheet: createBalanceSheetMock,
    });
  });

  it('should call create balance sheet on submit', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderWithTheme(
      <BalanceSheetCreationDialog open={true} onClose={onClose} />
    );

    await user.click(
      screen.getByRole('button', {
        name: /Select type/,
      })
    );
    const typeOptions = await screen.findAllByRole('option');
    expect(typeOptions.map((o) => o.textContent)).toEqual(['Compact', 'Full']);
    await user.click(typeOptions.find((o) => o.textContent === 'Compact')!);

    await user.click(
      screen.getByRole('button', {
        name: /Select version/,
      })
    );
    const versionOptions = await screen.findAllByRole('option');
    expect(versionOptions.map((o) => o.textContent)).toEqual(['5.06', '5.08']);
    await user.click(versionOptions.find((o) => o.textContent === '5.06')!);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    const expected = {
      type: BalanceSheetType.Compact,
      version: BalanceSheetVersion.v5_0_6,
    };
    await waitFor(() =>
      expect(createBalanceSheetMock).toHaveBeenCalledWith(expected)
    );
    expect(onClose).toHaveBeenCalledWith();
  });

  it('should close dialog when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderWithTheme(
      <BalanceSheetCreationDialog open={true} onClose={onClose} />
    );

    await user.click(screen.getByLabelText('Close dialog'));
    await waitFor(() => expect(onClose).toHaveBeenCalledWith());
  });
});
