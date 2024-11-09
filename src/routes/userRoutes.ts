import { Router } from 'express';
import UserController from '../controllers/userController';

const router = Router();

// Route to create a new user (register a new user)
router.post('/register', UserController.createUser);

// Route to get all users
router.get('/users', UserController.getAllUsers);

// Route to get a single user by ID
router.get('/users/:id', UserController.getUserById);

// Route to update a user by ID
router.put('/users/:id', UserController.updateUser);

// Route to delete a user by ID
router.delete('/users/:id', UserController.deleteUser);

export default router;

