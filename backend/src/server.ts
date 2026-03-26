import express, { Application } from 'express';
import cors from 'cors';
import { config as dotenvConfig } from 'dotenv';
import path from 'path';
import Database from './config/database';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Load environment variables
dotenvConfig();

/**
 * Express Application Setup
 */
class Server {
  public app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '5000');

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Configure middleware
   */
  private initializeMiddlewares(): void {
    // Enable CORS
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
      })
    );

    // Parse JSON bodies
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Serve uploaded files
    this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // Request logging (development)
    if (process.env.NODE_ENV === 'development') {
      this.app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
      });
    }
  }

  /**
   * Mount routes
   */
  private initializeRoutes(): void {
    this.app.use('/api', routes);
  }

  /**
   * Error handling middleware (must be last)
   */
  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  /**
   * Start server
   */
  public async start(): Promise<void> {
    try {
      // Test database connection
      await Database.testConnection();

      // Start listening
      this.app.listen(this.port, () => {
        console.log('🚀 ================================');
        console.log(`🚀 Server running on port ${this.port}`);
        console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🚀 API URL: http://localhost:${this.port}/api`);
        console.log('🚀 ================================');
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  /**
   * Graceful shutdown
   */
  public async shutdown(): Promise<void> {
    console.log('\n🛑 Shutting down gracefully...');
    await Database.disconnect();
    process.exit(0);
  }
}

// Create and start server
const server = new Server();
server.start();

// Handle shutdown signals
process.on('SIGTERM', () => server.shutdown());
process.on('SIGINT', () => server.shutdown());

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  server.shutdown();
});