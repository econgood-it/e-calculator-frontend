import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mui/material';
import { ReactNode } from 'react';

type FieldArrayAppendButtonProps = {
  label: ReactNode;
  onClick: () => void;
  disabled: boolean; //gerrit edit
};

export function FieldArrayAppendButton({
  label,
  onClick,
  disabled, //gerrit edit
}: FieldArrayAppendButtonProps) {
  return (
    <Button
      variant={'contained'}
      startIcon={<FontAwesomeIcon icon={faPlus} />}
      disabled={disabled} //gerrit edit
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
