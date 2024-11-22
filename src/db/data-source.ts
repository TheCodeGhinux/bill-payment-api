import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import path from 'path'; // Import path module to resolve paths dynamically

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';
const sslOption = process.env.DB_SSL || false;

// Choose the file extension based on the environment
const fileExtension = isDevelopment ? '*.ts' : '*.js';

// Use a wildcard to load all entities from the entities directory
const entitiesPath = path.join(__dirname, 'entities', fileExtension); // Dynamic file extension

// Similarly for migrations, use a wildcard pattern
const migrationsPath = path.join(__dirname, 'migration', fileExtension); // Dynamic file extension for migrations

const dataSource = new DataSource({
  type: process.env.DB_TYPE as 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  synchronize: isDevelopment,
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
