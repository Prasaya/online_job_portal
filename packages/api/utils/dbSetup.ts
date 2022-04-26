import { createPool } from 'mysql2';
import { getEnv } from '@root/services/Configuration/env';

export const pool = createPool({
  host: getEnv('DB_HOST'),
  user: getEnv('DB_USER'),
  port: parseInt(getEnv('DB_PORT', '3306'), 10),
  password: getEnv('DB_PASSWORD'),
  database: getEnv('DB_NAME'),
});

export default pool.promise();
