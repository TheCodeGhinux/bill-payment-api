import { DataSource } from 'typeorm';
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import path from 'path';
import { User } from './entities/User.entity';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';
const sslOption = process.env.DB_SSL || false;

// Choose the file extension based on the environment
const fileExtension = isDevelopment ? '*.ts' : '*.js';

// Use a wildcard to load all entities from the entities directory
const entitiesPath = path.join(__dirname, 'entities', fileExtension);

// Similarly for migrations, use a wildcard pattern
const migrationsPath = path.join(__dirname, 'migration', fileExtension);

const dataSource = new DataSource({
  type: process.env.DB_TYPE as 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  entities: [process.env.DB_ENTITIES],
  migrations: [process.env.DB_MIGRATIONS],
  synchronize: true,
  migrationsTableName: 'migrations',
  ssl:
    sslOption === 'require'
      ? { rejectUnauthorized: false }
      : sslOption === 'true',
});

export async function initializeDataSource() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource;
}

export default dataSource;
