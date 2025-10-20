import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env.development' });

const config: DataSourceOptions = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*{.ts, .js}'],
  logging: true, // muestra por consola la interaccion con la base de datos
  synchronize: true, // sincroniza las entidades con la base de datos
  dropSchema: true, // limpia, borra y crea nuevamente todas las entidades
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config);