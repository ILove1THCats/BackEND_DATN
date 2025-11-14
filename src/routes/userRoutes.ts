import { Router } from 'express';
import * as userController from '../controllers/UserController.js';

const router = Router();

router.post('/login', userController.loginUser);
router.get('/', userController.getUsers);
router.get('/profile', userController.getProfile);
router.get('/:id', userController.getUserById);
router.get('/email/:email', userController.getUserByEmail);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/reset-password', userController.resetPassword);

export default router;
