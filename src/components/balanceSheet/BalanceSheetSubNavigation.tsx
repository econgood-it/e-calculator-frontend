import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faGear, faHouse } from '@fortawesome/free-solid-svg-icons';
import ListItemText from '@mui/material/ListItemText';
import { Trans } from 'react-i18next';
import List from '@mui/material/List';
import { Link, useMatch } from 'react-router-dom';
import { Divider, ListSubheader } from '@mui/material';
import { BalanceSheetItem } from '../../models/BalanceSheet';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { StakeholderIcon } from '../lib/StakeholderIcon';
import GridItem from '../layout/GridItem';
import {
  createApiClient,
  makeWretchInstanceWithAuth,
} from '../../api/api.client.ts';
import { API_URL } from '../../configuration.ts';
import { useLanguage } from '../../i18n.ts';
import { useUser } from '../../authentication/index.ts';
import { Workbook } from '../../models/Workbook.ts';
import { StakholderShortNames } from '../../models/Rating.ts';

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
  const matchRoute = useMatch(
    `organization/:id/balancesheet/${balanceSheetId}/ratings/${pathName}`
  );
  return (
    <ListItem key="suppliers">
      <ListItemButton
        component={Link}
        selected={matchRoute !== null}
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
  const matchRoute = useMatch(
    `organization/:id/balancesheet/${balanceSheetItem.id}/:navItem`
  );
  const { lng } = useLanguage();
  const { userData } = useUser();
  const [workbook, setWorkbook] = useState<Workbook | undefined>();

  useEffect(() => {
    (async () => {
      setWorkbook(
        await createApiClient(
          makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
        ).getWorkbook(balanceSheetItem.version, balanceSheetItem.type)
      );
    })();
  }, [balanceSheetItem, userData, lng]);

  const getStakeholderName = useCallback(
    (stakeholder: string) => {
      return workbook?.findGroup(stakeholder)?.name ?? '';
    },
    [workbook]
  );

  return (
    <List component="div">
      <ListItem key="overview">
        <ListItemButton
          component={Link}
          selected={matchRoute?.params.navItem === 'overview'}
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
          selected={matchRoute?.params.navItem === 'companyfacts'}
          to={`balancesheet/${balanceSheetItem.id}/companyfacts`}
        >
          <ListItemIcon>
            <FontAwesomeIcon icon={faBuilding} />
          </ListItemIcon>
          <ListItemText primary={<Trans>Facts about the organization</Trans>} />
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
        icon={
          <StakeholderIcon stakeholderKey={StakholderShortNames.Suppliers} />
        }
        navItemText={getStakeholderName(StakholderShortNames.Suppliers)}
      />
      <StakeholderRatingNavigationItem
        balanceSheetId={balanceSheetItem.id}
        pathName={'finance'}
        icon={<StakeholderIcon stakeholderKey={StakholderShortNames.Finance} />}
        navItemText={getStakeholderName(StakholderShortNames.Finance)}
      />
      <StakeholderRatingNavigationItem
        balanceSheetId={balanceSheetItem.id}
        pathName={'employees'}
        icon={
          <StakeholderIcon stakeholderKey={StakholderShortNames.Employees} />
        }
        navItemText={getStakeholderName(StakholderShortNames.Employees)}
      />
      <StakeholderRatingNavigationItem
        balanceSheetId={balanceSheetItem.id}
        pathName={'customers'}
        icon={
          <StakeholderIcon stakeholderKey={StakholderShortNames.Customers} />
        }
        navItemText={getStakeholderName(StakholderShortNames.Customers)}
      />
      <StakeholderRatingNavigationItem
        balanceSheetId={balanceSheetItem.id}
        pathName={'society'}
        icon={<StakeholderIcon stakeholderKey={StakholderShortNames.Society} />}
        navItemText={getStakeholderName(StakholderShortNames.Society)}
      />

      <GridItem xs={12}>
        <Divider variant="middle" />
      </GridItem>
      <ListItem key="settings">
        <ListItemButton
          selected={matchRoute?.params.navItem === 'settings'}
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
