import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import ListItemText from '@mui/material/ListItemText';
import { Trans } from 'react-i18next';
import Collapse from '@mui/material/Collapse';
import BalanceSheetSubNavigation from './BalanceSheetSubNavigation';
import { BalanceSheetItem } from '../../models/BalanceSheet';
import { useUser } from '../../authentication/index.ts';

type BalanceSheetNavigationItemProps = {
  balanceSheetItem: BalanceSheetItem;
  isMemberOfCertificationAuthority: boolean;
};

export const BalanceSheetNavigationItem = ({
  balanceSheetItem,
  isMemberOfCertificationAuthority
}: BalanceSheetNavigationItemProps) => {
  const [open, setOpen] = useState(false);
  const { balanceSheetId } = useParams();

  const isSelected = Number(balanceSheetId) === balanceSheetItem.id;

  useEffect(() => {
    setOpen(isSelected);
  }, [isSelected]);
  const handleClick = () => {
    setOpen(!open);
  };

  return !isMemberOfCertificationAuthority || ( isMemberOfCertificationAuthority && isSelected ) ? (
    <div>
      <ListItem disablePadding>
        <ListItemButton
          component={Link}
          to={`balancesheet/${balanceSheetItem.id}/overview`}
          onClick={handleClick}
        >
          <ListItemText
            primary={<Trans>Balance sheet {{ id: balanceSheetItem.id }}</Trans>}
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
  ) : null;
};
