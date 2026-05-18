import { DataSource } from 'typeorm';
import { Professional } from '../../entities/professional.entity';
import { User } from '../../entities/users.entity';
import professionalsData from '../data/professionals.data.json';
import { ProfessionalSeedData } from '../interfaces/professional-seed.interface';

export async function professionalSeed(
  dataSource: DataSource,
): Promise<void> {
  const professionalRepo = dataSource.getRepository(Professional);
  const userRepo = dataSource.getRepository(User);

  console.log('🌱 Seed de profesionales iniciado');

  for (const item of professionalsData as ProfessionalSeedData[]) {
    /* =========================
       1️⃣ Buscar usuario + relaciones
    ========================== */
    const user = await userRepo.findOne({
      where: { email: item.userEmail },
      relations: {
        credential: true,
        professionalProfile: true,
      },
    });

    if (!user) {
      console.warn(`❌ Usuario no encontrado: ${item.userEmail}`);
      continue;
    }

    /* =========================
       2️⃣ Validar rol PROFESSIONAL
    ========================== */
    if (user.credential?.role !== 'PROFESSIONAL') {
      console.warn(
        `⚠️ Usuario ${user.email} no es PROFESSIONAL (rol actual: ${user.credential?.role})`,
      );
      continue;
    }

    /* =========================
       3️⃣ Evitar duplicados
    ========================== */
    if (user.professionalProfile) {
      console.warn(`⚠️ Perfil profesional ya existe: ${user.email}`);
      continue;
    }

    /* =========================
       4️⃣ Crear perfil profesional
    ========================== */
    const professional = new Professional();
    professional.user = user;
    professional.type = item.type;
    professional.professionalTitle = item.professionalTitle;
    professional.licenseNumber = item.licenseNumber || null;
    professional.yearsOfExperience = item.yearsOfExperience ?? 0;
    professional.bio = item.bio || null;
    professional.isApproved = true;
    professional.isActive = true;

    await professionalRepo.save(professional);

    console.log(`✅ Profesional creado: ${user.email}`);
  }

  console.log('✅ Seed de profesionales finalizado');
}
