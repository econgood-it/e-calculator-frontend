import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';

type FieldArrayRemoveButtonProps = {
  onClick: () => void;
  ariaLabel?: string;
};

export function FieldArrayRemoveButton({
  onClick,
  ariaLabel,
}: FieldArrayRemoveButtonProps) {
  return (
    <IconButton onClick={onClick} aria-label={ariaLabel} color="error">
      <FontAwesomeIcon icon={faTrash} />
    </IconButton>
  );
}
