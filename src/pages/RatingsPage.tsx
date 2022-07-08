import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@mui/material';
import { useActiveBalanceSheet } from '../contexts/WithActiveBalanceSheet';

const RatingsPage = () => {
  const { balanceSheet } = useActiveBalanceSheet();
  const FormInputSchema = z.object({
    ratings: z.object({ shortName: z.string() }).array(),
  });
  const {
    register,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof FormInputSchema>>({
    resolver: zodResolver(FormInputSchema),
    mode: 'onSubmit',
    defaultValues: balanceSheet,
  });
  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'ratings', // unique name for your Field Array
  });

  return (
    <>
      <div>Rating Page</div>
      {fields.map((field, index) => (
        <Input
          key={index}
          error={!!errors.ratings?.[index]?.shortName}
          inputProps={{
            'aria-label': `ratings.${index}.shortName`,
            ...register(`ratings.${index}.shortName`),
          }}
        />
      ))}
    </>
  );
};

export default RatingsPage;
