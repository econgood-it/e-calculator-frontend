import '@testing-library/jest-dom';
import renderWithTheme from '../../testUtils/rendering';
import { screen, waitFor } from '@testing-library/react';
import { useAlert } from '../../contexts/AlertContext';
import {
  BalanceSheetType,
  BalanceSheetVersion,
} from '@ecogood/e-calculator-schemas/dist/shared.schemas';
import { BalanceSheetCreationDialog } from './BalanceSheetCreationDialog';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

vi.mock('../../contexts/AlertContext');
describe('BalanceSheetCreationDialog', () => {
  beforeEach(() => {
    (useAlert as Mock).mockReturnValue({ addErrorAlert: vi.fn() });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should call create balance sheet on submit', async () => {
    const createBalanceSheetMock = vi.fn();

    const onClose = vi.fn();
    const { user } = renderWithTheme(
      <BalanceSheetCreationDialog
        open={true}
        onClose={onClose}
        onSave={createBalanceSheetMock}
      />
    );

    await user.click(
      screen.getByRole('combobox', {
        name: /Select type/,
      })
    );
    const typeOptions = await screen.findAllByRole('option');
    expect(typeOptions.map((o) => o.textContent)).toEqual(['Compact', 'Full']);
    await user.click(typeOptions.find((o) => o.textContent === 'Compact')!);

    await user.click(
      screen.getByRole('combobox', {
        name: /Select version/,
      })
    );
    const versionOptions = await screen.findAllByRole('option');
    expect(versionOptions.map((o) => o.textContent)).toEqual(['5.08', '5.09']);
    await user.click(versionOptions.find((o) => o.textContent === '5.08')!);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    const expected = {
      type: BalanceSheetType.Compact,
      version: BalanceSheetVersion.v5_0_8,
    };
    await waitFor(() =>
      expect(createBalanceSheetMock).toHaveBeenCalledWith(expected)
    );
    expect(onClose).toHaveBeenCalledWith();
  });

  it('should close dialog when close button is clicked', async () => {
    const onClose = vi.fn();
    const createBalanceSheetMock = vi.fn();
    const { user } = renderWithTheme(
      <BalanceSheetCreationDialog
        open={true}
        onClose={onClose}
        onSave={createBalanceSheetMock}
      />
    );

    await user.click(screen.getByLabelText('Close dialog'));
    await waitFor(() => expect(onClose).toHaveBeenCalledWith());
  });
});
