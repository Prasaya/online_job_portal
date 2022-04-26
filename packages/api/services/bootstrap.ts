import { getEnv } from './Configuration/env';
import { DatabaseService } from './DatabaseService/databaseService';
import { DBConfig } from './DatabaseService/typings';

const config: DBConfig = {
  host: getEnv('DB_HOST'),
  port: parseInt(getEnv('DB_PORT', '3306'), 10),
  user: getEnv('DB_USER'),
  password: getEnv('DB_PASSWORD'),
  database: getEnv('DB_NAME'),
};
export const databaseService = new DatabaseService(config);
