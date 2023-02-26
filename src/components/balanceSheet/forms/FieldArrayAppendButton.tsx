import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Trans } from 'react-i18next';
import { Button } from '@mui/material';

type FieldArrayAppendButtonProps = {
  onClick: () => void;
};

export function FieldArrayAppendButton({
  onClick,
}: FieldArrayAppendButtonProps) {
  return (
    <Button
      variant={'contained'}
      startIcon={<FontAwesomeIcon icon={faPlus} />}
      onClick={onClick}
    >
      <Trans>Add</Trans>
    </Button>
  );
}
