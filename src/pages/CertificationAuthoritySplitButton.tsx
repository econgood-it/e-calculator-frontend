import React, { useState } from 'react';
import { Button, ButtonGroup, Menu, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { CertificationAuthorityNames } from '@ecogood/e-calculator-schemas/dist/audit.dto';
import { useTranslation } from 'react-i18next';
import { SaveButton } from '../components/buttons/SaveButton.tsx';
import { FieldValues, UseFormHandleSubmit } from 'react-hook-form';

type SplitButtonProps = {
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  onClick: (authority: CertificationAuthorityNames, data: FieldValues) => void;
};

export function CertificationAuthoritySplitButton({
  handleSubmit,
  onClick,
}: SplitButtonProps) {
  const [anchorEl, setAnchorEl] = useState<
    (EventTarget & HTMLButtonElement) | null
  >(null);
  const { t } = useTranslation();
  const options = [
    { key: CertificationAuthorityNames.AUDIT, label: t`Submit to audit` },
    {
      key: CertificationAuthorityNames.PEER_GROUP,
      label: t`Submit to peer-group`,
    },
  ];
  const [selectedAuthority, setSelectedAuthority] =
    useState<CertificationAuthorityNames>(CertificationAuthorityNames.AUDIT);

  const handleClick = (data: FieldValues) => {
    onClick(selectedAuthority, data);
  };

  const handleMenuItemClick = (authority: CertificationAuthorityNames) => {
    setSelectedAuthority(authority);
    setAnchorEl(null);
  };

  const handleToggle = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ButtonGroup variant="contained">
      <SaveButton
        handleSubmit={handleSubmit}
        onSaveClick={handleClick}
        label={options.find((o) => o.key === selectedAuthority)?.label}
      />
      <Button
        size="small"
        aria-controls={anchorEl ? 'split-button-menu' : undefined}
        aria-expanded={anchorEl ? 'true' : undefined}
        aria-label="select between audit and peer group"
        aria-haspopup="menu"
        onClick={handleToggle}
      >
        <FontAwesomeIcon icon={faCaretDown} />
      </Button>
      <Menu
        id="split-button-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option) => (
          <MenuItem
            key={option.key}
            selected={option.key === selectedAuthority}
            onClick={() => handleMenuItemClick(option.key)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </ButtonGroup>
  );
}
