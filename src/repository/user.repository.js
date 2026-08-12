import { pool } from "../db/index.js";
import { hashPassword } from "../utils/password.js";

// fields without password and refresh token
const PUBLIC_FIELDS = "id, email, fullName, avatar, coverImage, role, createdAt, updatedAt";

const findById = async (id) => {
    const [rows] = await pool.execute(
        `SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ? LIMIT 1`,
        [id]
    );
    return rows[0] || null;
};

//  only for auth (login / password checks)
const findByIdWithSecrets = async (id) => {
    const [rows] = await pool.execute(
        `SELECT * FROM users WHERE id = ? LIMIT 1`,
        [id]
    );
    return rows[0] || null;
};

const findByEmail = async (email) => {
    const [rows] = await pool.execute(
        `SELECT * FROM users WHERE email = ? LIMIT 1`,
        [email]
    );
    return rows[0] || null;
};

const existsByEmail = async (email) => {
    const [rows] = await pool.execute(
        `SELECT id FROM users WHERE email = ? LIMIT 1`,
        [email]
    );
    return rows.length > 0;
};



const createUser = async ({
    email,
    fullName,
    avatar,
    coverImage = null,
    password,
    role = "user", // public signups are always 'user'
}) => {
    const hashed = await hashPassword(password);

    const [result] = await pool.execute(
        `INSERT INTO users (email, fullName, avatar, coverImage, password, role)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [email, fullName, avatar, coverImage, hashed, role]
    );

    return findById(result.insertId);
};

const setRefreshToken = async (id, refreshToken) => {
    await pool.execute(`UPDATE users SET refreshToken = ? WHERE id = ?`, [
        refreshToken,
        id,
    ]);
};

const clearRefreshToken = async (id) => {
    await pool.execute(`UPDATE users SET refreshToken = NULL WHERE id = ?`, [id]);
};

// ---- Admin management ----

const listAllUsers = async () => {
    const [rows] = await pool.execute(
        `SELECT ${PUBLIC_FIELDS},
                (SELECT COUNT(*) FROM blogs WHERE author = users.id) AS blogCount
        FROM users
        ORDER BY createdAt DESC`
    );
    return rows;
};

const deleteUser = async (id) => {
    // ON DELETE CASCADE on blogs/comments/likes cleans up their content.
    await pool.execute(`DELETE FROM users WHERE id = ?`, [id]);
};


export const userRepository = {
    findById,
    findByIdWithSecrets,
    findByEmail,
    existsByEmail,
    createUser,
    setRefreshToken,
    clearRefreshToken,
    listAllUsers,
    deleteUser,
    PUBLIC_FIELDS,
};