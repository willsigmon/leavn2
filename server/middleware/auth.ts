import { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { pool } from '../db';

// Add custom properties to the session
declare module 'express-session' {
  interface SessionData {
    userId: string;
    userProfile: {
      id: string;
      name: string;
      email: string;
      profileImageUrl?: string;
    };
  }
}

// Initialize session store
const PgSession = connectPgSimple(session);

// Configure session middleware
export const sessionMiddleware = session({
  store: new PgSession({
    pool, 
    tableName: 'sessions',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'leavn-bible-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
});

// Simple authentication middleware
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) {
    return next();
  }
  
  res.status(401).json({ error: 'Unauthorized' });
}

// Temporary development login functionality
export function handleLogin(req: Request, res: Response) {
  // Create a session for testing purposes
  const userId = '123456';
  req.session.userId = userId;
  req.session.userProfile = {
    id: userId,
    name: 'Test User',
    email: 'test@example.com'
  };
  
  res.redirect('/');
}

export function handleLogout(req: Request, res: Response) {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error('Logout error:', err);
      }
    });
  }
  
  res.redirect('/login');
}