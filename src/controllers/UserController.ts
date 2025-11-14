import { Request, Response, NextFunction } from 'express';
import * as userModel from '../models/UserModel.js';
import bcrypt from "bcrypt";
import config from '../config/config.js';
import jwt from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });

    const user = await userModel.getUserByEmail(email);

    if (!user)
      return res.status(404).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ message: "Sai mật khẩu" });

    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { full_name, email, password_hash, avatar_url, role } = req.body;

    if (!full_name || !email || !password_hash) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const hashPass = await bcrypt.hash(password_hash, config.hashSaltRounds);

    const newUser = await userModel.createUser(full_name, email, hashPass, avatar_url, role || "user");
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const user = await userModel.getUserById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { full_name, email, avatar_url, role } = req.body;
    const updatedUser = await userModel.updateUser(id, full_name, email, avatar_url, role);
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const deletedUser = await userModel.deleteUser(id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json(deletedUser);
  } catch (error) {
    next(error);
  }
};

export const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.params;
      if (!email) {
        return res.status(400).json({ message: 'Email parameter is required' });
      }
      const user = await userModel.getUserByEmail(email);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      next(error);
    };
  };

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Thiếu email" });

    const user = await userModel.getUserByEmail(email);
    if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản" });

    // 👉 Ở đây bạn có thể dùng thư viện như nodemailer để gửi email reset password thật
    // hoặc đơn giản trả về success để test
    res.json({ success: true, message: "Email reset password đã được gửi (giả lập)" });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.userid);
    if (!id) {
      return res.status(400).json({ message: 'ID parameter is required' });
    }

    const user = await userModel.getUserById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  };
};