export interface User {
    user_id: number;
    full_name: string;
    email: string;
    password_hash: string;
    avatar_url?: string;
    created_at: Date;
    updated_at: Date;
    role: 'user' | 'admin';
}
/**
  Lấy tất cả người dùng
  @returns Promise<User[]> A list of all users.
*/
export declare const getAllUsers: () => Promise<User[]>;
export declare const getUserById: (id: number) => Promise<User | null>;
export declare const createUser: (full_name: string, email: string, password_hash: string, avatar_url?: string, role?: "user" | "admin") => Promise<User>;
export declare const updateUser: (id: number, full_name?: string, email?: string, avatar_url?: string, role?: "user" | "admin") => Promise<User | null>;
export declare const deleteUser: (id: number) => Promise<User | null>;
export declare const getUserByEmail: (email: string) => Promise<User | null>;
//# sourceMappingURL=UserModel.d.ts.map