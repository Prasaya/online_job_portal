import * as bcrypt from 'bcrypt';

const hashPassword = async (password: string | null): Promise<string | null> => {
    if (!password || password.length === 0) {
        return null;
    }
    const saltRounds = 13;
    const computedHash = await bcrypt.hash(
        password,
        saltRounds,
    );
    return computedHash;
};

export const verifyPassword = async (
    enteredPassword: string,
    storedPassword: string | null,
): Promise<boolean> => {
    if (!storedPassword) {
        return false;
    }
    return bcrypt.compare(
        enteredPassword,
        storedPassword,
    );
};

export default hashPassword;
