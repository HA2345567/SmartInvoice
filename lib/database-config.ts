import { neon } from '@neondatabase/serverless';

// Database configuration for Neon DB (PostgreSQL)
export const getDatabaseConfig = () => {
  return {
    type: 'neon',
    url: process.env.DATABASE_URL
  };
};

export const getNeonSql = () => {
  const connectionString = process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@ep-placeholder.neon.tech/neondb';
  return neon(connectionString);
};

export default getNeonSql;