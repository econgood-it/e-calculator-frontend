import Rating from '@mui/material/Rating';
import { useState } from 'react';
import { Box } from '@mui/material';

export default function HoverRating() {
  const [value, setValue] = useState<number | null>(2);
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
      <Rating
        name="hover-feedback"
        value={value}
        max={10}
        precision={1}
        onChange={(event, newValue) => {
          setValue(newValue);
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
