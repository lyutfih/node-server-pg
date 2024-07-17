import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Client } = pg;

const client = new Client({ connectionString: process.env.DATABASE_URI + '?sslmode=require' });
await client.connect();

export default client;