import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({
  path: resolve(process.cwd(), '.env.development'),
});

import { AppDataSource } from '../data-source';
import { userSeed } from './user.seed';
import { professionalSeed } from './professional.seed';
import { categorySeed } from './category.seed';
import { productSeed } from './product.seed';
import { planSeed } from './plan.seed';
import { subscriptionSeed } from './subscription.seed';
import { nutritionPlanSeed } from './nutrition-plan.seed';
import { workoutPlanSeed } from './workout-plan.seed';
import { ProgressSeed } from './progress.seed';

async function runSeeds() {
  try {
    console.log('🌱 Inicializando conexión a la base de datos...');
    await AppDataSource.initialize();

    /* =========================
       USERS
    ========================== */
    console.log('🌱 Ejecutando seed de usuarios...');
    await userSeed(AppDataSource);

    /* =========================
       PROFESSIONAL PROFILES
    ========================== */
    console.log('🌱 Ejecutando seed de profesionales...');
    await professionalSeed(AppDataSource);

    /* =========================
       CATEGORIES
    ========================== */
    console.log('🌱 Ejecutando seed de categorías...');
    await categorySeed(AppDataSource);

    /* =========================
       PRODUCTS
    ========================== */
    console.log('🌱 Ejecutando seed de productos...');
    await productSeed(AppDataSource);

    /* =========================
       PLANS
    ========================== */
    console.log('🌱 Ejecutando seed de planes...');
    await planSeed(AppDataSource);

    /* =========================
       SUBSCRIPTIONS
    ========================== */
    console.log('🌱 Ejecutando seed de suscripciones...');
    await subscriptionSeed(AppDataSource);

    /* =========================
       NUTRITION PLANS
    ========================== */
    console.log('🌱 Ejecutando seed de planes nutricionales...');
    await nutritionPlanSeed(AppDataSource);

    /* =========================
       WORKOUT PLANS
    ========================== */
    console.log('🌱 Ejecutando seed de planes de entrenamiento...');
    await workoutPlanSeed(AppDataSource);

    /* =========================
       PROGRESS ✅
    ========================== */
    console.log('🌱 Ejecutando seed de progreso...');
    await ProgressSeed.run(AppDataSource);

    console.log('✅ Seeds ejecutados correctamente');

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando seeds:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

/* =========================
   DEBUG ENV (solo desarrollo)
========================== */
console.log('ENV CHECK:', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USERNAME,
  DB_PASS: process.env.DB_PASSWORD ? '***' : undefined
});
console.log('Base usada:', process.env.DB_NAME);
runSeeds();
