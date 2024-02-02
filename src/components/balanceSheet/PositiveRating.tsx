import Rating from '@mui/material/Rating';
import { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';
import { Chip, Divider, Typography } from '@mui/material';
import GridContainer from '../layout/GridContainer';
import GridItem from '../layout/GridItem';
import { useTranslation } from 'react-i18next';

const StyledRating = styled(Rating)`
  & .MuiRating-iconFilled {
    color: ${(props) => props.theme.palette.primary.main};
  }
  & .MuiRating-iconHover {
    color: ${(props) => props.theme.palette.primary.main};
  }
`;

type PositiveRatingProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
};

export default function PositiveRating<T extends FieldValues>({
  control,
  name,
}: PositiveRatingProps<T>) {
  const [hover, setHover] = useState<number>(-1);
  const { t } = useTranslation();
  const getLabel = (currentValue?: number): string => {
    if (currentValue == null) {
      return 'Basislinie';
    } else if (currentValue === 1) {
      return 'Erste Schritte';
    } else if (currentValue >= 2 && currentValue <= 3) {
      return 'Fortgeschritten';
    } else if (currentValue >= 4 && currentValue <= 6) {
      return 'Erfahren';
    } else if (currentValue >= 7 && currentValue <= 10) {
      return 'Vorbildlich';
    } else {
      return 'Basislinie';
    }
  };

  return (
    <Controller
      render={({ field }) => {
        return (
          <GridContainer
            alignItems="center"
            spacing={3}
            justifyContent={'center'}
          >
            <GridItem>
              <StyledRating
                aria-label={name}
                value={field.value}
                onChange={(_, newValue) => {
                  field.onChange(newValue);
                }}
                max={10}
                icon={<FontAwesomeIcon icon={faSeedling} />}
                emptyIcon={<FontAwesomeIcon icon={faSeedling} />}
                onChangeActive={(_, newHover) => {
                  setHover(newHover);
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <Divider>
                <Chip label={getLabel(hover !== -1 ? hover : field.value)} />
              </Divider>
            </GridItem>
            <GridItem>
              {field.value !== null && (
                <Typography variant={'h2'}>
                  {`${hover !== -1 ? hover : field.value} ${t`Points`}`}
                </Typography>
              )}
            </GridItem>
          </GridContainer>
        );
      }}
      name={name}
      control={control}
    />
  );
}
