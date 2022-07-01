import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faFile,
} from '@fortawesome/free-solid-svg-icons';
import ListItemText from '@mui/material/ListItemText';
import { Trans, useTranslation } from 'react-i18next';
import Collapse from '@mui/material/Collapse';
import { BalanceSheetItem } from '../../dataTransferObjects/BalanceSheet';
import BalanceSheetSubNavigation from './BalanceSheetSubNavigation';

type BalanceSheetNavigationItemProps = {
  balanceSheetItem: BalanceSheetItem;
};

export const BalanceSheetNavigationItem = ({
  balanceSheetItem,
}: BalanceSheetNavigationItemProps) => {
  const { t } = useTranslation('sidebar');
  const [open, setOpen] = useState(false);
  const { balanceSheetId } = useParams();

  const isSelected = Number(balanceSheetId) === balanceSheetItem.id;

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
          to={`${balanceSheetItem.id}`}
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
        <BalanceSheetSubNavigation balanceSheetItem={balanceSheetItem} />
      </Collapse>
    </div>
  );
};
