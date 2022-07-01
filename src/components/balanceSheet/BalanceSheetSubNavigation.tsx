import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import ListItemText from '@mui/material/ListItemText';
import { Trans, useTranslation } from 'react-i18next';
import List from '@mui/material/List';
import { Link } from 'react-router-dom';
import { BalanceSheetItem } from '../../dataTransferObjects/BalanceSheet';

type BalanceSheetSubNavigationProps = {
  balanceSheetItem: BalanceSheetItem;
};

const BalanceSheetSubNavigation = ({
  balanceSheetItem,
}: BalanceSheetSubNavigationProps) => {
  const { t } = useTranslation('sidebar');
  return (
    <List disablePadding>
      <ListItem key={`company-facts`} disablePadding>
        <ListItemButton
          component={Link}
          to={`${balanceSheetItem.id}/companyfacts`}
        >
          <ListItemIcon>
            <FontAwesomeIcon icon={faBuilding} />
          </ListItemIcon>
          <ListItemText primary={<Trans t={t}>Company Facts</Trans>} />
        </ListItemButton>
      </ListItem>
    </List>
  );
};

export default BalanceSheetSubNavigation;
