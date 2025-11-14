import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListSubheader } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import { Trans } from 'react-i18next';
import {
  BalanceSheetCreateRequestBody,
  BalanceSheetItem,
} from '../../models/BalanceSheet';
import { BalanceSheetCreationDialog } from './BalanceSheetCreationDialog';
import { BalanceSheetNavigationItem } from './BalanceSheetNavigationItem';
import { UserInformation } from '../../models/User.ts';

type BalanceSheetSidebarSectionProps = {
  user: UserInformation;
  organizationName: string;
  balanceSheetItems: BalanceSheetItem[];
  onCreateBalanceSheet: (
    balanceSheet: BalanceSheetCreateRequestBody
  ) => Promise<void>;
  isMemberOfCertificationAuthority: boolean;
};

export function BalanceSheetSidebarSection({
  user,
  organizationName,
  balanceSheetItems,
  onCreateBalanceSheet,
  isMemberOfCertificationAuthority,
}: BalanceSheetSidebarSectionProps) {
  const [showBalanceSheetCreationDialog, setShowBalanceSheetCreationDialog] =
    useState<boolean>(false);

  return (
    <>
      <List
        subheader={
          <ListSubheader>
            <Trans>Balance sheets</Trans>
          </ListSubheader>
        }
      >
        {!isMemberOfCertificationAuthority ? (
          <ListItem key={'create-balance-sheet'} disablePadding>
            <ListItemButton
              onClick={() => setShowBalanceSheetCreationDialog(true)}
            >
              <ListItemIcon>
                <FontAwesomeIcon icon={faPlus} />
              </ListItemIcon>
              <ListItemText primary={<Trans>Create balance sheet</Trans>} />
            </ListItemButton>
          </ListItem>
        ) : null}
      </List>
      <List component="nav">
        {balanceSheetItems.map((b) => (
          <BalanceSheetNavigationItem
            key={b.id}
            balanceSheetItem={b}
            isMemberOfCertificationAuthority={isMemberOfCertificationAuthority}
          />
        ))}
      </List>
      <BalanceSheetCreationDialog
        user={user}
        organizationName={organizationName}
        onSave={onCreateBalanceSheet}
        open={showBalanceSheetCreationDialog}
        onClose={() => setShowBalanceSheetCreationDialog(false)}
      />
    </>
  );
}
