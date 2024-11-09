import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Optionally, replace 'any' with a more specific user type
    }
  }
}