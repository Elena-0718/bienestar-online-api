import { PlanSeedData } from '../interfaces/plan-seed.interface';
import { PlanType } from '../../entities/plan.entity';

export const plansData: PlanSeedData[] = 

[
{
 
    name: 'Plan Free',
    type: PlanType.FREE,
    price: 0,
    nutritionConsultations: 0,
    fitnessConsultations: 0,
    hasLibraryAccess: false,
    isActive: true,
  },
  {
    /* =========================
       NUTRITION
    ========================== */
    name: 'Plan Nutricional',
    type: PlanType.NUTRITION,
    price: 120000,
    nutritionConsultations: 4,
    fitnessConsultations: 0,
    hasLibraryAccess: true,
    isActive: true,
  },
  {
    /* =========================
       FITNESS
    ========================== */
    name: 'Plan Fitness',
    type: PlanType.FITNESS,
    price: 110000,
    nutritionConsultations: 0,
    fitnessConsultations: 4,
    hasLibraryAccess: true,
    isActive: true,
  },
  {
    /* =========================
       BIENESTAR (TODO INCLUIDO)
    ========================== */
    name: 'Plan Bienestar Integral',
    type: PlanType.BIENESTAR,
    price: 180000,
    nutritionConsultations: 4,
    fitnessConsultations: 4,
    hasLibraryAccess: true,
    isActive: true,
  },
];