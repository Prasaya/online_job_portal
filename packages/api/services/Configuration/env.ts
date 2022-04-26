import dotenv from 'dotenv';

dotenv.config({ path: './config/.env' });

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
