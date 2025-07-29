// src/lib/api/auth.ts
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface AuthRequest extends NextApiRequest {
  user?: { userId: string; email: string };
}

export function authenticate(
  req: AuthRequest,
  res: NextApiResponse,
  next: () => void
) {
  // ✅ ست کردن CORS - البته بهتره تو handler ها باشه!
  res.setHeader('Access-Control-Allow-Origin', '*'); // بهتره دامنه دقیق بدی
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    // ✅ جواب Preflight
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded as { userId: string; email: string };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
}
