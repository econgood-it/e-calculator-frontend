import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import {
  FieldValues,
  SubmitHandler,
  UseFormHandleSubmit,
} from 'react-hook-form';
import { useAlert } from '../../../contexts/AlertContext';

type SaveButtonProps = {
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  onSaveClick: SubmitHandler<FieldValues>;
};

export function SaveButton({ onSaveClick, handleSubmit }: SaveButtonProps) {
  const { addErrorAlert } = useAlert();
  const { t } = useTranslation();
  return (
    <Button
      fullWidth={true}
      size={'large'}
      onClick={handleSubmit(onSaveClick, () => {
        addErrorAlert(t`Form data is invalid`);
      })}
      variant={'contained'}
      startIcon={<FontAwesomeIcon icon={faSave} />}
    >
      <Trans>Save</Trans>
    </Button>
  );
}
