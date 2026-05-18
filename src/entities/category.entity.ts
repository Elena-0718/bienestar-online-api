import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { Product } from './products.entity';

@Entity({ name: 'categories' })
@Index(['name'])
@Index(['slug'])
export class Category {
  /* =========================
     IDENTIFICACIÓN
  ========================== */

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  /* =========================
     DATOS DE CATÁLOGO
  ========================== */

  @Column({
    length: 100,
    unique: true,
  })
  name: string;

  @Column({
    length: 120,
    unique: true,
    comment: 'Slug para URLs amigables',
  })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({
    default: true,
    comment: 'Indica si la categoría está visible en el catálogo',
  })
  isActive: boolean;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Orden de visualización en el catálogo',
  })
  sortOrder: number;

  /* =========================
     RELACIONES
  ========================== */

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  /* =========================
     AUDITORÍA
  ========================== */

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

