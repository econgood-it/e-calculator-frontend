import Rating from '@mui/material/Rating';
import { ReactNode, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import GridContainer from '../layout/GridContainer';
import GridItem from '../layout/GridItem';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';
import { Chip } from '@mui/material';

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
  label: ReactNode;
};

export default function PositiveRating<T extends FieldValues>({
  control,
  name,
  label,
}: PositiveRatingProps<T>) {
  const [hover, setHover] = useState<number>(-1);
  const getLabel = (currentValue: number): string => {
    if (currentValue === 1) {
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
      render={({ field, fieldState }) => {
        return (
          <GridContainer spacing={1}>
            <GridItem>
              <StyledRating
                aria-label={name}
                value={field.value}
                onChange={(e, newValue) => {
                  field.onChange(newValue);
                }}
                max={10}
                icon={<FontAwesomeIcon icon={faSeedling} />}
                emptyIcon={<FontAwesomeIcon icon={faSeedling} />}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
              />
            </GridItem>
            {field.value !== null && (
              <>
                <GridItem>
                  <Chip label={hover !== -1 ? hover : field.value} />
                </GridItem>
                <GridItem>
                  <Chip label={getLabel(hover !== -1 ? hover : field.value)} />
                </GridItem>
              </>
            )}
          </GridContainer>
        );
      }}
      name={name}
      control={control}
    />
  );
}
