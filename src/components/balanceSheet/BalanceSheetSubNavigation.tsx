import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faHouse,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import ListItemText from '@mui/material/ListItemText';
import { Trans, useTranslation } from 'react-i18next';
import List from '@mui/material/List';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../../contexts/ApiProvider';
import { useBalanceSheetItems } from '../../contexts/BalanceSheetListProvider';
import { Divider, ListSubheader } from '@mui/material';
import { BalanceSheetItem } from '../../models/BalanceSheet';
import { useOrganizations } from '../../contexts/OrganizationProvider';
import { ReactNode } from 'react';
import { StakeholderIcon } from '../lib/StakeholderIcon';
import GridItem from '../layout/GridItem';

type BalanceSheetSubNavigationProps = {
  balanceSheetItem: BalanceSheetItem;
};

type StakeholderRatingNavigationItemProps = {
  balanceSheetId: number;
  pathName: string;
  icon: ReactNode;
  navItemText: string;
};

function StakeholderRatingNavigationItem({
  balanceSheetId,
  navItemText,
  icon,
  pathName,
}: StakeholderRatingNavigationItemProps) {
  return (
    <ListItem key="suppliers">
      <ListItemButton
        component={Link}
        to={`balancesheet/${balanceSheetId}/ratings/${pathName}`}
      >
        <ListItemIcon>{icon}</ListItemIcon>
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
  const { setBalanceSheetItems } = useBalanceSheetItems();
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
      <ListItem key="overview">
        <ListItemButton
          component={Link}
          to={`balancesheet/${balanceSheetItem.id}/overview`}
        >
          <ListItemIcon>
            <FontAwesomeIcon icon={faHouse} />
          </ListItemIcon>
          <ListItemText primary={<Trans>Overview</Trans>} />
        </ListItemButton>
      </ListItem>
      <GridItem xs={12}>
        <Divider variant="middle" />
      </GridItem>
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
      <GridItem xs={12}>
        <Divider variant="middle" />
      </GridItem>
      <ListSubheader>
        <Trans>Ratings</Trans>
      </ListSubheader>
      <StakeholderRatingNavigationItem
        balanceSheetId={balanceSheetItem.id}
        pathName={'suppliers'}
        icon={<StakeholderIcon stakeholderKey="A" />}
        navItemText={t`Suppliers`}
      />
      <StakeholderRatingNavigationItem
        balanceSheetId={balanceSheetItem.id}
        pathName={'finance'}
        icon={<StakeholderIcon stakeholderKey="B" />}
        navItemText={t`Financial service providers`}
      />
      <StakeholderRatingNavigationItem
        balanceSheetId={balanceSheetItem.id}
        pathName={'employees'}
        icon={<StakeholderIcon stakeholderKey="C" />}
        navItemText={t`Employees`}
      />
      <StakeholderRatingNavigationItem
        balanceSheetId={balanceSheetItem.id}
        pathName={'customers'}
        icon={<StakeholderIcon stakeholderKey="D" />}
        navItemText={t`Customers and other companies`}
      />
      <StakeholderRatingNavigationItem
        balanceSheetId={balanceSheetItem.id}
        pathName={'society'}
        icon={<StakeholderIcon stakeholderKey="E" />}
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
