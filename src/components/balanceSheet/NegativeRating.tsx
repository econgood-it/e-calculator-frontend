import { Grid, Input } from '@mui/material';
import { z, ZodError } from 'zod';
import styled from 'styled-components';
import { useState } from 'react';

const GridWithFixedSize = styled(Grid)`
  width: 400px;
`;
type NegativeRatingProps = {
  readOnly: boolean;
  estimations: number;
  onError: () => void;
  onEstimationsChange: (value: number) => void;
};

const NegativeRating = ({
  readOnly,
  estimations,
  onError,
  onEstimationsChange,
}: NegativeRatingProps) => {
  const [value, setValue] = useState<string>(estimations.toString());
  const [error, setError] = useState<ZodError | undefined>(undefined);

  const ValidNumberSchema = z
    .number({
      invalid_type_error: 'Zahl erwartet',
      required_error: 'Zahl erwartet',
    })
    .min(-200, 'Wert sollte größer oder gleich -200 sein')
    .max(0, 'Wert sollte kleiner oder gleich 0 sein');

  const onChange = (newValue: string) => {
    setValue(newValue);
    const valueAsNumber = Number.parseFloat(newValue);
    const result = ValidNumberSchema.safeParse(valueAsNumber);
    if (result.success) {
      setError(undefined);
      onEstimationsChange(valueAsNumber);
    } else {
      setError(result.error);
      onError();
    }
  };
  return (
    <GridWithFixedSize container spacing={1} alignItems={'center'}>
      <Grid item xs={2}>
        <Input
          readOnly={readOnly}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          size="small"
          error={error !== undefined}
          inputProps={{
            step: 1,
            min: -200,
            max: 0,
            type: 'number',
            'aria-label': 'negative-rating-input',
          }}
        />
      </Grid>
      <Grid item xs={10}>
        {error ? (
          <p>{error.errors[0].message}</p>
        ) : (
          <p>Wert zwischen -200 und 0 eintragen</p>
        )}
      </Grid>
    </GridWithFixedSize>
  );
};
export default NegativeRating;
