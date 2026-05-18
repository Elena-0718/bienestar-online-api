import { BillingCycle } from '../../enum/billingcycle.enum';
import { SubscriptionStatus } from '../../enum/subscription-status.enum';
import { PlanType } from '../../entities/plan.entity';

export interface SubscriptionSeedData {
  userEmail: string;
  planType: PlanType;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string | null;
}

export const subscriptionSeedData: SubscriptionSeedData[] = [
  {
    userEmail: 'daniel.herrera@gmail.com',
    planType: PlanType.FREE,
    billingCycle: BillingCycle.MONTHLY,
    status: SubscriptionStatus.ACTIVE,
    startDate: '2026-01-01',
  },
  {
    userEmail: 'natalia.rios@gmail.com',
    planType: PlanType.NUTRITION,
    billingCycle: BillingCycle.MONTHLY,
    status: SubscriptionStatus.ACTIVE,
    startDate: '2026-01-01',
  },
  {
    userEmail: 'andres.morales@gmail.com',
    planType: PlanType.FITNESS,
    billingCycle: BillingCycle.MONTHLY,
    status: SubscriptionStatus.ACTIVE,
    startDate: '2026-01-01',
  },
  {
    userEmail: 'laura.gomez@gmail.com',
    planType: PlanType.BIENESTAR,
    billingCycle: BillingCycle.MONTHLY,
    status: SubscriptionStatus.ACTIVE,
    startDate: '2026-01-01',
  },
];

