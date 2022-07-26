import { Grid, Input } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled from 'styled-components';
import { useState } from 'react';

const GridWithFixedSize = styled(Grid)`
  width: 400px;
`;

const FormInputSchema = z.object({
  rating: z
    .number({
      invalid_type_error: 'Zahl erwartet',
      required_error: 'Zahl erwartet',
    })
    .min(-200, 'Wert sollte größer oder gleich -200 sein')
    .max(0, 'Wert sollte kleiner oder gleich 0 sein'),
});
type FormInput = z.infer<typeof FormInputSchema>;

type NegativeRatingProps = {
  value: number;
  onChange: (value: number) => void;
};

const NegativeRating = ({ value, onChange }: NegativeRatingProps) => {
  const [internalValue, setInternalValue] = useState<string>(value.toString());
  const {
    register,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(FormInputSchema),
    mode: 'onChange',
  });
  const onChangeTrigger = (newValue: string) => {
    setInternalValue(newValue);
    if (!errors.rating) {
      onChange(Number(newValue));
    }
  };

  return (
    <GridWithFixedSize container spacing={1} alignItems={'center'}>
      <Grid item xs={2}>
        <Input
          value={internalValue}
          onChange={(e) => {
            onChangeTrigger(e.target.value);
          }}
          size="small"
          error={!!errors.rating}
          inputProps={{
            ...register('rating', {
              valueAsNumber: true,
            }),
            step: 1,
            min: -200,
            max: 0,
            type: 'number',
            'aria-label': 'negative-rating-input',
          }}
        />
      </Grid>
      <Grid item xs={10}>
        {errors.rating ? (
          <p>{errors.rating.message}</p>
        ) : (
          <p>Wert zwischen -200 und 0 eintragen</p>
        )}
      </Grid>
    </GridWithFixedSize>
  );
};
export default NegativeRating;
