import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faSeedling,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import ListItemText from '@mui/material/ListItemText';
import { Trans, useTranslation } from 'react-i18next';
import List from '@mui/material/List';
import { Link, useNavigate } from 'react-router-dom';
import { BalanceSheetItem } from '../../dataTransferObjects/BalanceSheet';
import { useApi } from '../../contexts/ApiContext';
import { useBalanceSheetItems } from '../../contexts/BalanceSheetListContext';

type BalanceSheetSubNavigationProps = {
  balanceSheetItem: BalanceSheetItem;
};

const BalanceSheetSubNavigation = ({
  balanceSheetItem,
}: BalanceSheetSubNavigationProps) => {
  const { t } = useTranslation('sidebar');
  const api = useApi();
  const navigate = useNavigate();
  const [, setBalanceSheetItems] = useBalanceSheetItems();

  const deleteBalanceSheet = async () => {
    await api.delete(`/v1/balancesheets/${balanceSheetItem.id}`);
    setBalanceSheetItems((prevState) =>
      prevState.filter((b) => b.id !== balanceSheetItem.id)
    );
    navigate('/balancesheets');
  };

  return (
    <List component="div">
      <ListItem key="company-facts">
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
      <ListItem key="ratings">
        <ListItemButton component={Link} to={`${balanceSheetItem.id}/ratings`}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faSeedling} />
          </ListItemIcon>
          <ListItemText primary={<Trans t={t}>Ratings</Trans>} />
        </ListItemButton>
      </ListItem>
      <ListItem key="delete">
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
