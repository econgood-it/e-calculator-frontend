import React from 'react';
import { Dialog, DialogProps } from '@mui/material';
import { FixedToolbar } from './FixedToolbar';
import Toolbar from '@mui/material/Toolbar';

export function FullScreenDialog({ children, open }: DialogProps) {
  return (
    <>
      <Dialog fullScreen onClose={() => {}} open={open}>
        <FixedToolbar />
        <Toolbar />
        {children}
      </Dialog>
    </>
  );
}
