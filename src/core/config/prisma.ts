import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import { PrismaClient } from '../../generated/prisma/client.js';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in .env');
}

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

export default prisma;