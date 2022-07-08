import Rating from '@mui/material/Rating';
import { useState } from 'react';
import { Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons/faSeedling';
import styled from 'styled-components';

const StyledRating = styled(Rating)`
  & .MuiRating-iconFilled {
    color: ${(props) => props.theme.palette.primary.main};
  }
  & .MuiRating-iconHover {
    color: ${(props) => props.theme.palette.primary.main};
  }
`;

type PositiveRatingProps = {
  value: number;
  onChange: (value: number) => void;
};

export default function PositiveRating({
  value,
  onChange,
}: PositiveRatingProps) {
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
    <Box
      sx={{
        width: 400,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <StyledRating
        aria-label="positive-rating-input"
        name="hover-feedback"
        value={value}
        max={10}
        precision={1}
        icon={<FontAwesomeIcon icon={faSeedling} />}
        emptyIcon={<FontAwesomeIcon icon={faSeedling} />}
        onChange={(event, newValue) => {
          onChange(newValue as number);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
      />
      {value !== null && (
        <Box sx={{ ml: 2, width: 150 }}>
          {getLabel(hover !== -1 ? hover : value)}
        </Box>
      )}
    </Box>
  );
}
