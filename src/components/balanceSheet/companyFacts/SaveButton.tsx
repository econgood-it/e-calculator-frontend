import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { useAlert } from '../../../contexts/AlertContext';
import { UseFormHandleSubmit } from 'react-hook-form/dist/types/form';

type SaveButtonProps<TFieldValues> = {
  handleSubmit: UseFormHandleSubmit<TFieldValues>;
  onSaveClick: (data: TFieldValues) => Promise<void>;
};

export function SaveButton<TFieldValues>({
  handleSubmit,
  onSaveClick,
}: SaveButtonProps<TFieldValues>) {
  const { addErrorAlert } = useAlert();
  const { t } = useTranslation();
  return (
    <Button
      fullWidth={true}
      size={'large'}
      onClick={handleSubmit(onSaveClick, () =>
        addErrorAlert(t`Form data is invalid`)
      )}
      variant={'contained'}
      startIcon={<FontAwesomeIcon icon={faSave} />}
    >
      <Trans>Save</Trans>
    </Button>
  );
}
