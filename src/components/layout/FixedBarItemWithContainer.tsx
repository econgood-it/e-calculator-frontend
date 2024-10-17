import { ReactNode } from 'react';
import GridItem from './GridItem.tsx';
import GridContainer from './GridContainer.tsx';

type FixedBarProps = {
  children: ReactNode;
};

export function FixedBarItemWithContainer({
  children,
}: FixedBarProps): JSX.Element {
  return (
    <GridItem
      position={'fixed'}
      zIndex={3}
      bgcolor={'white'}
      sx={{ width: '100%' }}
    >
      <GridContainer alignItems={'center'} padding={2} spacing={2}>
        {children}
      </GridContainer>
    </GridItem>
  );
}
