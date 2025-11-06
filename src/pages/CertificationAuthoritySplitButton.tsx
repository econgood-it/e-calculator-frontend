import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Menu, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { CertificationAuthorityNames } from '@ecogood/e-calculator-schemas/dist/audit.dto';
import { useTranslation } from 'react-i18next';

type SplitButtonProps = {
  onSubmit: (authority: CertificationAuthorityNames) => void;
  register: any;
  setValue: (name: string, value: any) => void;
};

export function CertificationAuthoritySplitButton({
  onSubmit,
  register,
  setValue,
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

  const handleClick = () => {
    //  onSubmit(selectedAuthority);
  };

  const handleMenuItemClick = (authority: CertificationAuthorityNames) => {
    setSelectedAuthority(authority);
    setValue('generalInformation.certificationAuthority', authority);
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

  useEffect(() => {
    setValue('generalInformation.certificationAuthority', selectedAuthority);
  }, [setValue, selectedAuthority]);

  return (
    <ButtonGroup variant="contained">
      <Button size="large" type="submit" onClick={handleClick}>
        {options.find((o) => o.key === selectedAuthority)?.label}
      </Button>
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
      <input
        type="hidden"
        {...register(`generalInformation.certificationAuthority`)}
        value={selectedAuthority}
      />
    </ButtonGroup>
  );
}
