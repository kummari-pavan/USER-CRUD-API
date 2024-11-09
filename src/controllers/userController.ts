import { Request, Response } from 'express'; 
import redisClient from '../config/redisClient';
import logger from '../config/logger';
import UserService from '../services/userService';

class UserController {
  // Create a new user
  public static createUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const userData = req.body; // Assuming user data is in the request body
      const result = await UserService.createUser(userData);
      // Clear the cache since a new user is created
      await redisClient.del('users'); // Adjust the key as per your cache logic
      logger.info(`(Redis)User created successfully: ${JSON.stringify(result)}`); // Log success
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`(Redis)Error creating user: ${error.message}`); // Log error
        return res.status(500).json({ success: false, message: error.message });
      } else {
        logger.error('(Redis)An unknown error occurred while creating a user'); // Log unknown error
        return res.status(500).json({ success: false, message: 'An unknown error occurred' });
      }
    }
  }

  // Get all users
  public static getAllUsers = async (req: Request, res: Response): Promise<any> => {
    try {
      // Check if the users are in cache
      const cachedUsers = await redisClient.get('users');
      if (cachedUsers) {
        logger.info('(Redis)Returning cached users'); // Log cache hit
        return res.status(200).json(JSON.parse(cachedUsers)); // Return cached users
      }

      const result = await UserService.getAllUsers();
      // Cache the users for future requests
      await redisClient.set('users', JSON.stringify(result.users), {
        EX: 3600, // Cache expires in 1 hour
      });
      logger.info(`(Redis)Fetched all users: ${JSON.stringify(result)}`); // Log success
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`(Redis)Error fetching all users: ${error.message}`); // Log error
        return res.status(500).json({ success: false, message: error.message });
      } else {
        logger.error('(Redis)An unknown error occurred while fetching all users'); // Log unknown error
        return res.status(500).json({ success: false, message: 'An unknown error occurred' });
      }
    }
  }

  // Get a single user by ID
  public static getUserById = async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.params.id; // Declare userId here
      // Check if the user is in cache
      const cachedUser = await redisClient.get(`user:${userId}`);
      if (cachedUser) {
        logger.info(`(Redis)Returning cached user with ID: ${userId}`); // Log cache hit
        return res.status(200).json(JSON.parse(cachedUser)); // Return cached user
      }

      const result = await UserService.getUserById(userId);
      if (!result.success) {
        logger.warn(`(Redis)User not found with ID: ${userId}`); // Log warning
        return res.status(404).json({ message: result.message });
      }

      // Cache the user for future requests
      await redisClient.set(`user:${userId}`, JSON.stringify(result.user), {
        EX: 3600, // Cache expires in 1 hour
      });
      logger.info(`(Redis)Fetched user with ID: ${userId}`); // Log success
      return res.status(200).json(result);
    } catch (error) {
      const userId = req.params.id; // Declare userId here as well
      if (error instanceof Error) {
        logger.error(`(Redis)Error fetching user with ID: ${userId}, Error: ${error.message}`); // Log error
        return res.status(500).json({ success: false, message: error.message });
      } else {
        logger.error('(Redis)An unknown error occurred while fetching user by ID'); // Log unknown error
        return res.status(500).json({ success: false, message: 'An unknown error occurred' });
      }
    }
  }

  // Update a user by ID
  public static updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.params.id; // Declare userId here
      const result = await UserService.updateUser(userId, req.body);
      if (!result.success) {
        logger.warn(`User not found for update with ID: ${userId}`); // Log warning
        return res.status(404).json({ message: result.message });
      }

      // Clear the cache for the updated user
      await redisClient.del(`user:${userId}`); // Clear specific user cache
      // Also clear the all users cache
      await redisClient.del('users'); // Clear all users cache
      logger.info(`User updated successfully with ID: ${userId}`); // Log success
      return res.status(200).json(result);
    } catch (error) {
      const userId = req.params.id; // Declare userId here as well
      if (error instanceof Error) {
        logger.error(`Error updating user with ID: ${userId}, Error: ${error.message}`); // Log error
        return res.status(500).json({ success: false, message: error.message });
      } else {
        logger.error('An unknown error occurred while updating user'); // Log unknown error
        return res.status(500).json({ success: false, message: 'An unknown error occurred' });
      }
    }
  }

  // Delete a user by ID
  public static deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.params.id; // Declare userId here
      const result = await UserService.deleteUser(userId);
      if (!result.success) {
        logger.warn(`User not found for deletion with ID: ${userId}`); // Log warning
        return res.status(404).json({ message: result.message });
      }

      // Clear the cache for the deleted user
      await redisClient.del(`user:${userId}`);
      // Also clear the all users cache
      await redisClient.del('users');
      logger.info(`User deleted successfully with ID: ${userId}`); // Log success
      return res.status(200).json(result);
    } catch (error) {
      const userId = req.params.id; // Declare userId here as well
      if (error instanceof Error) {
        logger.error(`Error deleting user with ID: ${userId}, Error: ${error.message}`); // Log error
        return res.status(500).json({ success: false, message: error.message });
      } else {
        logger.error('An unknown error occurred while deleting user'); // Log unknown error
        return res.status(500).json({ success: false, message: 'An unknown error occurred' });
      }
    }
  }
}

export default UserController;





