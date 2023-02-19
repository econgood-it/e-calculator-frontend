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

const BaseRatingSchema = z.object({
  shortName: z.string(),
  name: z.string(),
  type: z.nativeEnum(RatingType),
});

const errorMessageForNegativeEstimations =
  'Number should be between -200 and 0';

const errorMessageForPositiveEstimations = 'Number should be between 0 and 10';

export const RatingSchema = z
  .discriminatedUnion('isPositive', [
    z.object({
      isPositive: z.literal(true),
      estimations: z
        .number()
        .min(0, errorMessageForPositiveEstimations)
        .max(10, errorMessageForPositiveEstimations),
    }),
    z.object({
      isPositive: z.literal(false),
      estimations: z
        .number()
        .min(-200, errorMessageForNegativeEstimations)
        .max(0, errorMessageForNegativeEstimations),
    }),
  ])
  .and(BaseRatingSchema);

export type Rating = z.infer<typeof RatingSchema>;
