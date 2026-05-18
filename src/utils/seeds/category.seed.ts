import { DataSource } from 'typeorm';
import { Category } from '../../entities/category.entity';
import categoriesData from '../data/categories.data.json';
import { CategorySeedData } from '../interfaces/category-seed.interface';

export async function categorySeed(
  dataSource: DataSource,
): Promise<void> {
  const categoryRepo = dataSource.getRepository(Category);

  console.log(`🌱 Seed de categorías iniciado (${categoriesData.length})`);

  for (const item of categoriesData as CategorySeedData[]) {
    /* 1️⃣ Evitar duplicados por slug */
    const exists = await categoryRepo.findOne({
      where: { slug: item.slug },
    });

    if (exists) {
      console.log(`⚠️ Categoría ya existe: ${item.name}`);
      continue;
    }

    /* 2️⃣ Crear categoría */
    const category = new Category();
    category.name = item.name;
    category.slug = item.slug;
    category.description = item.description ?? null;
    category.sortOrder = item.sortOrder;
    category.isActive = true;

    await categoryRepo.save(category);

    console.log(`✅ Categoría creada: ${item.name}`);
  }

  console.log('✅ Seed de categorías finalizado');
}
