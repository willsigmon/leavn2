import express, { Request, Response, NextFunction } from 'express';
import { registerRoutes } from '../server/routes';
import { serveStatic, log } from '../server/vite';
import { initBibleRAG } from '../server/rag-bible';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let initPromise: Promise<void> | null = null;
async function ensureInitialized() {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        await initBibleRAG();
        log('Bible RAG system initialized successfully', 'vercel');
      } catch (error) {
        log(`Error initializing Bible RAG system: ${error}`, 'vercel');
      }

      await registerRoutes(app);

      app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || 'Internal Server Error';
        res.status(status).json({ message });
        throw err;
      });

      serveStatic(app);
    })();
  }
  return initPromise;
}

export default async function handler(req: Request, res: Response) {
  await ensureInitialized();
  return app(req, res);
}
