import List from '@mui/material/List';
import { ListSubheader } from '@mui/material';
import { Trans } from 'react-i18next';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ListItemText from '@mui/material/ListItemText';
import { BalanceSheetNavigationItem } from './BalanceSheetNavigationItem';
import { useBalanceSheetItems } from '../../contexts/BalanceSheetListProvider';
import { BalanceSheetCreationDialog } from './BalanceSheetCreationDialog';
import { useState } from 'react';

export function BalanceSheetSidebarSection() {
  const { balanceSheetItems } = useBalanceSheetItems();
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
      </List>
      <List component="nav">
        {balanceSheetItems.map((b) => (
          <BalanceSheetNavigationItem key={b.id} balanceSheetItem={b} />
        ))}
      </List>
      <BalanceSheetCreationDialog
        open={showBalanceSheetCreationDialog}
        onClose={() => setShowBalanceSheetCreationDialog(false)}
      />
    </>
  );
}
