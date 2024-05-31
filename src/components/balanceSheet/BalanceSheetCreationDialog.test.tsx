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
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

vi.mock('../../contexts/AlertContext');
vi.mock('../../contexts/BalanceSheetListProvider');
describe('BalanceSheetCreationDialog', () => {
  const createBalanceSheetMock = vi.fn();

  beforeEach(() => {
    (useAlert as Mock).mockReturnValue({ addErrorAlert: vi.fn() });
    (useBalanceSheetItems as Mock).mockReturnValue({
      createBalanceSheet: createBalanceSheetMock,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should call create balance sheet on submit', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithTheme(
      <BalanceSheetCreationDialog open={true} onClose={onClose} />
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
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithTheme(
      <BalanceSheetCreationDialog open={true} onClose={onClose} />
    );

    await user.click(screen.getByLabelText('Close dialog'));
    await waitFor(() => expect(onClose).toHaveBeenCalledWith());
  });
});
