import { Router } from 'express';
import userRoutes from './userRoutes'; // Import the user routes
import { consumeMessages } from '../utils/rabbitMq';

const router = Router();

//initializing RabbitMq connection
consumeMessages();

// Use the user routes
router.use('/', userRoutes); // All user routes will be prefixed with /users

// Export the main router
export default router;
