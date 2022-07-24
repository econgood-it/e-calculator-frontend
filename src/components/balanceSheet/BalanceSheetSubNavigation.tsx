import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faTrash,
  faTruckRampBox,
  faCoins,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import ListItemText from '@mui/material/ListItemText';
import { Trans, useTranslation } from 'react-i18next';
import List from '@mui/material/List';
import { Link, useNavigate } from 'react-router-dom';
import { BalanceSheetItem } from '../../dataTransferObjects/BalanceSheet';
import { useApi } from '../../contexts/ApiContext';
import { useBalanceSheetItems } from '../../contexts/BalanceSheetListContext';
import { ListSubheader } from '@mui/material';

type BalanceSheetSubNavigationProps = {
  balanceSheetItem: BalanceSheetItem;
};

type StakeholderRatingNavigationItemProps = {
  balanceSheetId: number;
  pathName: string;
  iconDefinition: IconDefinition;
  navItemText: string;
};

function StakeholderRatingNavigationItem({
  balanceSheetId,
  navItemText,
  iconDefinition,
  pathName,
}: StakeholderRatingNavigationItemProps) {
  return (
    <ListItem key="suppliers">
      <ListItemButton
        component={Link}
        to={`${balanceSheetId}/ratings/${pathName}`}
      >
        <ListItemIcon>
          <FontAwesomeIcon icon={iconDefinition} />
        </ListItemIcon>
        <ListItemText primary={navItemText} />
      </ListItemButton>
    </ListItem>
  );
}

const BalanceSheetSubNavigation = ({
  balanceSheetItem,
}: BalanceSheetSubNavigationProps) => {
  const api = useApi();
  const { t } = useTranslation();
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
          <ListItemText primary={<Trans>Company Facts</Trans>} />
        </ListItemButton>
      </ListItem>
      <ListSubheader>
        <Trans>Ratings</Trans>
      </ListSubheader>
      <StakeholderRatingNavigationItem
        balanceSheetId={balanceSheetItem.id}
        pathName={'suppliers'}
        iconDefinition={faTruckRampBox}
        navItemText={t`Suppliers`}
      />
      <StakeholderRatingNavigationItem
        balanceSheetId={balanceSheetItem.id}
        pathName={'finance'}
        iconDefinition={faCoins}
        navItemText={t`Financial service providers`}
      />
      <ListItem key="delete">
        <ListItemButton onClick={deleteBalanceSheet}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faTrash} />
          </ListItemIcon>
          <ListItemText primary={<Trans>Delete</Trans>} />
        </ListItemButton>
      </ListItem>
    </List>
  );
};

export default BalanceSheetSubNavigation;
