import dotenv from 'dotenv';
import config from './StaticConfiguration';

dotenv.config({ path: config.envPath });

export function getEnv(key: string, default_?: string): string {
  const value = process.env[key];
  if (!value) {
    if (default_) {
      return default_;
    }
    throw new Error(`${key} is not defined.`);
  }
  return value;
}
