import { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';

// Simple authentication middleware without database dependency
// This is a temporary solution for testing purposes

// Configure simple session
export const setupSession = (app: any) => {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'leavn-bible-study-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
  }));
};

// Middleware to check if user is authenticated
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session && (req.session as any).userId) {
    return next();
  }

  return res.status(401).json({ message: 'Unauthorized' });
};

// Simple login handler
export const handleLogin = (req: Request, res: Response) => {
  const userId = uuidv4();
  
  // Set user data in session
  (req.session as any).userId = userId;
  (req.session as any).user = {
    id: userId,
    name: 'Test User',
    email: 'user@example.com'
  };
  
  // Save and redirect
  req.session.save(err => {
    if (err) {
      console.error('Session save error:', err);
      return res.status(500).json({ message: 'Login failed' });
    }
    
    return res.redirect('/');
  });
};

// Simple logout handler
export const handleLogout = (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/login');
  });
};

// User data endpoint
export const getUserData = (req: Request, res: Response) => {
  if (!(req.session as any).userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  return res.json((req.session as any).user);
};
