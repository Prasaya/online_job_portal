import * as bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string>;
async function hashPassword(password?: null): Promise<null>;
async function hashPassword(password: string | null | undefined) {
  if (!password) {
    return null;
  }
  const saltRounds = 13;
  const computedHash = await bcrypt.hash(password, saltRounds);
  return computedHash;
}

export const verifyPassword = async (
  enteredPassword: string,
  storedPassword: string | null,
): Promise<boolean> => {
  if (!storedPassword) {
    return false;
  }
  return bcrypt.compare(enteredPassword, storedPassword);
};

export default hashPassword;
