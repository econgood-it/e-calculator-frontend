import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faChevronDown,
  faChevronUp,
  faFile,
} from '@fortawesome/free-solid-svg-icons';
import ListItemText from '@mui/material/ListItemText';
import { Trans, useTranslation } from 'react-i18next';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import { BalanceSheetItem } from '../../dataTransferObjects/BalanceSheet';

type BalanceSheetNavigationItemProps = {
  balanceSheetItem: BalanceSheetItem;
};

export const BalanceSheetNavigationItem = ({
  balanceSheetItem,
}: BalanceSheetNavigationItemProps) => {
  const { t } = useTranslation('sidebar');
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isSelected =
    `/balancesheets/${balanceSheetItem.id}` === location.pathname;

  useEffect(() => {
    setOpen(isSelected);
  }, [isSelected]);
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <ListItem disablePadding>
        <ListItemButton
          component={Link}
          to={`balancesheets/${balanceSheetItem.id}`}
          onClick={handleClick}
          selected={isSelected}
        >
          <ListItemIcon>
            <FontAwesomeIcon icon={faFile} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Trans t={t}>Balance sheet {{ id: balanceSheetItem.id }}</Trans>
            }
          />
          {open ? (
            <FontAwesomeIcon icon={faChevronUp} />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} />
          )}
        </ListItemButton>
      </ListItem>
      <Collapse
        key={`balance-sheet-collapse-${balanceSheetItem.id}`}
        in={open}
        timeout="auto"
        unmountOnExit
      >
        <List disablePadding>
          <ListItem key={`company-facts-${balanceSheetItem.id}`} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <FontAwesomeIcon icon={faBuilding} />
              </ListItemIcon>
              <ListItemText primary={<Trans t={t}>Company Facts</Trans>} />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>
    </div>
  );
};
