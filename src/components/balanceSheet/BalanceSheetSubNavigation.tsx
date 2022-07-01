import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faTrash } from '@fortawesome/free-solid-svg-icons';
import ListItemText from '@mui/material/ListItemText';
import { Trans, useTranslation } from 'react-i18next';
import List from '@mui/material/List';
import { Link, useNavigate } from 'react-router-dom';
import { BalanceSheetItem } from '../../dataTransferObjects/BalanceSheet';
import { useApi } from '../../contexts/ApiContext';

type BalanceSheetSubNavigationProps = {
  balanceSheetItem: BalanceSheetItem;
};

const BalanceSheetSubNavigation = ({
  balanceSheetItem,
}: BalanceSheetSubNavigationProps) => {
  const { t } = useTranslation('sidebar');
  const api = useApi();
  const navigate = useNavigate();

  const deleteBalanceSheet = async () => {
    await api.delete(`/v1/balancesheets/${balanceSheetItem.id}`);
    navigate('/balancesheets');
  };

  return (
    <List disablePadding>
      <ListItem key="company-facts" disablePadding>
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
      <ListItem key="delete" disablePadding>
        <ListItemButton onClick={deleteBalanceSheet}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faTrash} />
          </ListItemIcon>
          <ListItemText primary={<Trans t={t}>Delete</Trans>} />
        </ListItemButton>
      </ListItem>
    </List>
  );
};

export default BalanceSheetSubNavigation;
