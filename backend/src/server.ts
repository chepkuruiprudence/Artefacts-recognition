import express, { Application, Request, Response, NextFunction } from 'express';
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
   * Configure middleware with Enhanced CORS and Body Parsers
   */
  private initializeMiddlewares(): void {
    // 1. Define all allowed origins (Local Dev + Production Vercel)
    const allowedOrigins = [
      'http://localhost:5173',
      'https://artefacts-recognition.vercel.app'
    ];

    // 2. Enhanced CORS configuration
    this.app.use(
      cors({
        origin: (origin, callback) => {
          // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
          if (!origin) return callback(null, true);

          // Clean the origin (remove trailing slashes for strict matching)
          const cleanOrigin = origin.replace(/\/$/, "");
          const isAllowed = allowedOrigins.some(o => o.replace(/\/$/, "") === cleanOrigin);

          if (isAllowed) {
            callback(null, true);
          } else {
            console.warn(`⚠️ CORS Blocked: Origin ${origin} not in allowed list`);
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
      })
    );

    // 3. Standard Body Parsers
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // 4. Static Files serving
    this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // 5. Request Logging (Active in development mode)
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      }
      next();
    });
  }

  /**
   * Mount API routes
   */
  private initializeRoutes(): void {
    // Basic root route to prevent 404 when visiting the base Render URL
    this.app.get('/', (req: Request, res: Response) => {
      res.json({ 
        message: "Ūgwati wa Gĩkũyũ API is Live", 
        env: process.env.NODE_ENV || 'development' 
      });
    });

    // Main API routes
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
        
        // Dynamic logging for the API URL
        const displayUrl = process.env.API_URL || `http://localhost:${this.port}/api`;
        console.log(`🚀 API URL: ${displayUrl}`);
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

// Create and start server instance
const server = new Server();
server.start();

// Handle Process Signals for clean exit
process.on('SIGTERM', () => server.shutdown());
process.on('SIGINT', () => server.shutdown());

// Handle Unhandled Rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  server.shutdown();
});