import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mui/material';
import { ReactNode } from 'react';

type FieldArrayAppendButtonProps = {
  label: ReactNode;
  onClick: () => void;
};

export function FieldArrayAppendButton({
  label,
  onClick,
}: FieldArrayAppendButtonProps) {
  return (
    <Button
      variant={'contained'}
      startIcon={<FontAwesomeIcon icon={faPlus} />}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
