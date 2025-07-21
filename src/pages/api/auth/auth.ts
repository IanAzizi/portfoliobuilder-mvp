// src/lib/api/auth.ts
import jwt from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

export interface AuthRequest extends NextApiRequest {
  user?: { userId: string; email: string }
}

export function authenticate(req: AuthRequest, res: NextApiResponse, next: () => void) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    req.user = decoded as { userId: string; email: string }
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' })
  }
}
