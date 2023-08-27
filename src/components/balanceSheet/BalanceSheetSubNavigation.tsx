import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faCoins,
  faGlobe,
  faPeopleGroup,
  faTrash,
  faTruckRampBox,
  faUserGroup,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import ListItemText from '@mui/material/ListItemText';
import { Trans, useTranslation } from 'react-i18next';
import List from '@mui/material/List';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../../contexts/ApiContext';
import { useBalanceSheetItems } from '../../contexts/BalanceSheetListContext';
import { ListSubheader } from '@mui/material';
import { BalanceSheetItem } from '../../models/BalanceSheet';
import { useOrganizations } from '../../contexts/OrganizationContext';

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
        to={`balancesheet/${balanceSheetId}/ratings/${pathName}`}
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
  const { activeOrganization } = useOrganizations();

  const deleteBalanceSheet = async () => {
    await api.deleteBalanceSheet(balanceSheetItem.id);
    setBalanceSheetItems((prevState) =>
      prevState.filter((b) => b.id !== balanceSheetItem.id)
    );
    navigate(`/organization/${activeOrganization?.id}`);
  };

  return (
    <List component="div">
      <ListItem key="company-facts">
        <ListItemButton
          component={Link}
          to={`balancesheet/${balanceSheetItem.id}/companyfacts`}
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
      <StakeholderRatingNavigationItem
        balanceSheetId={balanceSheetItem.id}
        pathName={'employees'}
        iconDefinition={faPeopleGroup}
        navItemText={t`Employees`}
      />
      <StakeholderRatingNavigationItem
        balanceSheetId={balanceSheetItem.id}
        pathName={'customers'}
        iconDefinition={faUserGroup}
        navItemText={t`Customers and other companies`}
      />
      <StakeholderRatingNavigationItem
        balanceSheetId={balanceSheetItem.id}
        pathName={'society'}
        iconDefinition={faGlobe}
        navItemText={t`Social environment`}
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
