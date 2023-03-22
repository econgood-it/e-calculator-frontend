import { RegionResponseBodySchema } from 'e-calculator-schemas/dist/region.dto';
import { z } from 'zod';

export type Region = z.infer<typeof RegionResponseBodySchema>;
