import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500; // Default to 500 if no status code is provided
    const message = err.message || 'Internal Server Error'; // Default message

    // Log the error for debugging purposes (optional)
    console.error(`Error: ${message}`);

    // Send the error response
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};

export default errorMiddleware;
