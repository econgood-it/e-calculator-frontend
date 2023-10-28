import Rating from '@mui/material/Rating';
import { ReactNode, useState } from 'react';
import { Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons/faSeedling';
import styled from 'styled-components';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

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
  const [hover, setHover] = useState(-1);
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
          <Box
            sx={{
              width: 400,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <StyledRating
              aria-label={name}
              value={field.value}
              onChange={(e, newValue) => {
                field.onChange(newValue);
              }}
              max={10}
              precision={1}
              icon={<FontAwesomeIcon icon={faSeedling} />}
              emptyIcon={<FontAwesomeIcon icon={faSeedling} />}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
            />
            {field.value !== null && (
              <Box sx={{ ml: 2, width: 150 }}>
                {getLabel(hover !== -1 ? hover : field.value)}
              </Box>
            )}
          </Box>
        );
      }}
      name={name}
      control={control}
    />
  );
}
