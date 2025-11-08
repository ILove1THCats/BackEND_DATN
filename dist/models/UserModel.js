import pool from "../config/db.js";
/**
  Lấy tất cả người dùng
  @returns Promise<User[]> A list of all users.
*/
export const getAllUsers = async () => {
    const result = await pool.query(`SELECT * FROM users ORDER BY user_id ASC`);
    return result.rows;
};
export const getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
    return result.rows[0] || null;
};
export const createUser = async (full_name, email, password_hash, avatar_url, role = 'user') => {
    const result = await pool.query(`INSERT INTO users (full_name, email, password_hash, avatar_url, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`, [full_name, email, password_hash, avatar_url, role]);
    return result.rows[0];
};
export const updateUser = async (id, full_name, email, avatar_url, role) => {
    const result = await pool.query(`UPDATE users
     SET full_name = COALESCE($2, full_name),
         email = COALESCE($3, email),
         avatar_url = COALESCE($4, avatar_url),
         role = COALESCE($5, role),
         updated_at = NOW()
     WHERE user_id = $1
     RETURNING *`, [id, full_name, email, avatar_url, role]);
    return result.rows[0] || null;
};
export const deleteUser = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
};
export const getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
};
//# sourceMappingURL=UserModel.js.map