import { Dialog, DialogProps } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';

const CloseButton = styled(IconButton)`
  position: absolute;
  left: 95%;
  top: -5%;
`;

const DialogWithtoutOverflow = styled(Dialog)`
  .MuiDialog-paper {
    overflow: unset;
  }
`;

type ClosableDialogProps = {
  onClose: () => void;
};

export function ClosableDialog({
  onClose,
  children,
  ...props
}: ClosableDialogProps & DialogProps) {
  return (
    <DialogWithtoutOverflow {...props}>
      <CloseButton
        aria-label={'Close dialog'}
        color={'error'}
        size={'large'}
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faCircleXmark} />
      </CloseButton>
      {children}
    </DialogWithtoutOverflow>
  );
}
