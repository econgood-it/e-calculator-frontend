import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faGear, faHouse } from '@fortawesome/free-solid-svg-icons';
import ListItemText from '@mui/material/ListItemText';
import { Trans, useTranslation } from 'react-i18next';
import List from '@mui/material/List';
import { Link } from 'react-router-dom';
import { Divider, ListSubheader } from '@mui/material';
import { BalanceSheetItem } from '../../models/BalanceSheet';
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
  const { t } = useTranslation();

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
      <GridItem xs={12}>
        <Divider variant="middle" />
      </GridItem>
      <ListItem key="settings">
        <ListItemButton
          component={Link}
          to={`balancesheet/${balanceSheetItem.id}/settings`}
        >
          <ListItemIcon>
            <FontAwesomeIcon icon={faGear} />
          </ListItemIcon>
          <ListItemText primary={<Trans>Settings</Trans>} />
        </ListItemButton>
      </ListItem>
    </List>
  );
};

export default BalanceSheetSubNavigation;
