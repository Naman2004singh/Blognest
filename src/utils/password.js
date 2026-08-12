import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// In mongoose this lived in a userSchema.pre("save") hook.
// With raw mysql2 there are no schema hooks, so we hash explicitly
// in the repository before INSERT / password UPDATE.
export const hashPassword = async (plain) => {
    return bcrypt.hash(plain, SALT_ROUNDS);
};

export const isPasswordCorrect = async (plain, hashed) => {
    return bcrypt.compare(plain, hashed);
};
