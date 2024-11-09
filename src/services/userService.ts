import User from '../models/userModel';
import redisClient from '../config/redisClient'; 
import logger from '../config/logger'; 


class UserService {
  // Create a new user
  public static async createUser(userData: { name: string; email: string; password: string }) {
    try {
      const user = new User(userData);
      await user.save();
      return { success: true, user };
    } catch (error) {
      throw new Error('Error creating user');
    }
  }

  // Get all users
  public static async getAllUsers() {
    try {
      const users = await User.find();
      return { success: true, users };
    } catch (error) {
      throw new Error('Error fetching users');
    }
  }

  // Get a single user by ID
  public static async getUserById(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      return { success: true, user };
    } catch (error) {
      throw new Error('Error fetching user');
    }
  }

  // Update a user by ID
  public static async updateUser(userId: string, updates: Record<string, any>) {
    try {
      const user = await User.findByIdAndUpdate(userId, updates, { new: true });
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      return { success: true, user };
    } catch (error) {
      throw new Error('Error updating user');
    }
  }

  // Delete a user by ID
  public static async deleteUser(userId: string) {
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting user');
    }
  }
}

export default UserService; 

