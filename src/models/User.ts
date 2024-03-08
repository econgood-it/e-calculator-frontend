import { z } from 'zod';
import { UserInvitationResponseSchema } from '@ecogood/e-calculator-schemas/dist/user.schema';

export type Invitation = z.infer<typeof UserInvitationResponseSchema>;
