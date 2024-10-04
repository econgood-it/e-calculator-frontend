import GridContainer from '../layout/GridContainer.tsx';
import GridItem from '../layout/GridItem.tsx';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type PointLabelProps = {
  value: number | null;
  color?: 'primary' | 'error';
};

export function PointLabel({ value, color }: PointLabelProps) {
  const { t } = useTranslation();
  return (
    <GridContainer justifyContent="flex-end">
      <GridItem xs={12} md={'auto'}>
        {value !== null && (
          <Typography
            variant={'h2'}
            color={color}
          >{`${value} ${t`Points`}`}</Typography>
        )}
      </GridItem>
    </GridContainer>
  );
}
