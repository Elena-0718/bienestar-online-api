import { DataSource } from 'typeorm';
import { Product } from '../../entities/products.entity';
import { Category } from '../../entities/category.entity';
import productsData from '../data/products.data.json';
import { ProductSeedData } from '../interfaces/product-seed.interface';

export async function productSeed(
  dataSource: DataSource,
): Promise<void> {
  const productRepo = dataSource.getRepository(Product);
  const categoryRepo = dataSource.getRepository(Category);

  console.log('🌱 Seed de productos iniciado');

  for (const item of productsData as ProductSeedData[]) {
    /* 1️⃣ Validar categoría */
    const category = await categoryRepo.findOne({
      where: { slug: item.categorySlug },
    });

    if (!category) {
      console.log(
        `⚠️ Categoría no encontrada: ${item.categorySlug} (producto: ${item.name})`,
      );
      continue;
    }

    /* 2️⃣ Evitar duplicados por nombre */
    const existingProduct = await productRepo.findOne({
      where: { name: item.name },
    });

    if (existingProduct) {
      console.log(`⚠️ Producto ya existe: ${item.name}`);
      continue;
    }

    /* 3️⃣ Crear producto */
    const product = productRepo.create({
      name: item.name,
      description: item.description,
      price: item.price,
      stock: item.stock,
      images: item.images ?? [],
      category,
      isActive: true,
    });

    await productRepo.save(product);

    console.log(`✅ Producto creado: ${item.name}`);
  }

  console.log('✅ Seed de productos finalizado');
}
