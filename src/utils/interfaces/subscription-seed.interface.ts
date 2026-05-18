import { BillingCycle } from '../../enum/billingcycle.enum';
import { SubscriptionStatus } from '../../enum/subscription-status.enum';
import { PlanType } from '../../entities/plan.entity';

export interface SubscriptionSeedData {
  /**
   * Email del usuario (debe existir y ser role USER)
   */
  userEmail: string;

  /**
   * Tipo de plan al que se suscribe
   */
  planType: PlanType;

  /**
   * Ciclo de facturación
   */
  billingCycle: BillingCycle;

  /**
   * Estado de la suscripción
   */
  status: SubscriptionStatus;

  /**
   * Fecha de inicio del plan
   * Se convierte a Date en el seed
   */
  startDate: string;

  /**
   * Fecha de finalización (opcional)
   * null = suscripción vigente
   */
  endDate?: string | null;
}
