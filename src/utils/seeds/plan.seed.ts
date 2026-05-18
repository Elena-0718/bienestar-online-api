import { DataSource } from 'typeorm';
import { Plan } from '../../entities/plan.entity';
import { plansData } from '../data/plans.data';
import { PlanSeedData } from '../interfaces/plan-seed.interface';

export async function planSeed(dataSource: DataSource): Promise<void> {
  const planRepo = dataSource.getRepository(Plan);

  console.log('🌱 Seed de planes iniciado');

  for (const item of plansData as PlanSeedData[]) {
    const existingPlan = await planRepo.findOne({
      where: { type: item.type },
    });

    if (existingPlan) {
      console.log(`⚠️ Plan ya existe: ${item.type}`);
      continue;
    }

    const plan = planRepo.create({
      name: item.name,
      type: item.type,
      price: item.price,
      nutritionConsultations: item.nutritionConsultations,
      fitnessConsultations: item.fitnessConsultations,
      hasLibraryAccess: item.hasLibraryAccess,
      isActive: item.isActive,
    });

    await planRepo.save(plan);

    console.log(`✅ Plan creado: ${item.name}`);
  }

  console.log('✅ Seed de planes finalizado');
}
