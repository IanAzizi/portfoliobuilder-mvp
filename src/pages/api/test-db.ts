// src/pages/api/test-db.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase()
    const users = await User.find().limit(1) // یه یوزر تستی بخونه

    return res.status(200).json({
      status: 'ok',
      usersCount: users.length,
      message: 'Connection to MongoDB is working!',
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'DB connection failed.' })
  }
}
