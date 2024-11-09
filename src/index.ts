import express from "express";
import mongoose from "mongoose";
import router from "./routes";
import userRoutes from './routes/userRoutes';
import winston from "winston";
import morgan from "morgan";
import cors from 'cors';//cross origin resourse sharing 
import helmet from 'helmet';//helmet for security

const app = express();
const MONGo_URL = 'mongodb://localhost:27017';
const PORT = 4000;

// Winston configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ],
});

// Morgan configuration with Winston stream
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Middleware
app.use(cors());         // CORS middleware with default settings
app.use(helmet());       // Helmet middleware for secure headers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/', router);

// Database connection
mongoose.connect(MONGo_URL, { dbName: "wipro" })
  .then(() => logger.info("DB connected"))
  .catch((err) => logger.error(`DB connection error: ${err}`));

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});