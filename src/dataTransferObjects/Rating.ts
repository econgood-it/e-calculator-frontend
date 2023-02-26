import { z } from 'zod';

export enum StakholderShortNames {
  Suppliers = 'A',
  Finance = 'B',
  Employees = 'C',
  Customers = 'D',
  Society = 'E',
}

export enum RatingType {
  topic = 'topic',
  aspect = 'aspect',
}

export const RatingSchema = z
  .object({
    shortName: z.string(),
    name: z.string(),
    type: z.nativeEnum(RatingType),
    isPositive: z.boolean(),
    estimations: z.number({
      invalid_type_error: 'Number expected',
      required_error: 'Number expected',
    }),
  })
  .refine(
    (data) => {
      const isValid =
        data.type === RatingType.topic ||
        (data.isPositive &&
          z.number().min(0).max(10).safeParse(data.estimations).success) ||
        (!data.isPositive &&
          z.number().min(-200).max(0).safeParse(data.estimations).success);
      return isValid;
    },
    (data) => ({
      message: `Number should be between ${
        data.isPositive ? '0 and 10' : '-200 and 0'
      }`,
      path: ['estimations'],
    })
  );

export type Rating = z.infer<typeof RatingSchema>;
