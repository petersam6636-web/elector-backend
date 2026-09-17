import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: ['dist/users/entities/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
});