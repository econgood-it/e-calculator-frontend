import GridItem from '../../layout/GridItem';
import { Typography, TypographyVariants } from '@mui/material';
import GridContainer from '../../layout/GridContainer';

type FormTitleProps = {
  precedingCharacter: string;
  title: string;
};

export function FormTitle({ precedingCharacter, title }: FormTitleProps) {
  const typoVariant: keyof TypographyVariants = 'h1';
  return (
    <GridContainer spacing={3} alignItems={'center'}>
      <GridItem>
        <Typography variant={typoVariant}>{precedingCharacter}</Typography>
      </GridItem>
      <GridItem>
        <Typography variant={typoVariant}>{title}</Typography>
      </GridItem>
    </GridContainer>
  );
}
