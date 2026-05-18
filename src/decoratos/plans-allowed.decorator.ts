import { SetMetadata } from '@nestjs/common';
import { PlanType } from 'src/entities/plan.entity';

export const PLANS_KEY = 'plans_allowed';

export const PlansAllowed = (...plans: PlanType[]) =>
  SetMetadata(PLANS_KEY, plans);
