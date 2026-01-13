import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - Missing or invalid token' });
  }
  
  const token = authHeader.substring(7);
  
  if (token === process.env.ADMIN_TOKEN) {
    req.user = {
      id: 1,
      name: 'Admin',
      email: 'admin@example.com'
    };
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden - Invalid token' });
  }
}

