// src/pages/api/profile/index.ts
import type { NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/db';
import { authenticate, AuthRequest } from '@/lib/auth';
import Profile from '@/models/Profile';

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  // ✅ CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // یا بجاش دامنه دقیق رو بزار
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // ✅ Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectToDatabase();
  console.log('✅ DB Connected');

  switch (req.method) {
    case 'GET':
      return authenticate(req, res, async () => {
        console.log('👉 GET profile for:', req.user);
        const profile = await Profile.findOne({ userId: req.user!.userId });
        if (!profile) {
          return res.status(404).json({ message: 'Profile not found.' });
        }
        return res.status(200).json(profile);
      });

    case 'POST':
      return authenticate(req, res, async () => {
        console.log('👉 POST create profile for:', req.user);
        const { fullName, jobTitle, bio, social } = req.body;

        const existing = await Profile.findOne({ userId: req.user!.userId });
        if (existing) {
          return res
            .status(400)
            .json({ message: 'Profile already exists. Use PUT to update.' });
        }
        const profile = new Profile({
          userId: req.user!.userId,
          fullName,
          jobTitle,
          bio,
          social,
        });
        await profile.save();
        return res.status(201).json(profile);
      });

    case 'PUT':
      return authenticate(req, res, async () => {
        console.log('👉 PUT update profile for:', req.user);
        const { fullName, jobTitle, bio, social } = req.body;

        const profile = await Profile.findOne({ userId: req.user!.userId });
        if (!profile) {
          return res.status(404).json({ message: 'Profile not found.' });
        }

        profile.fullName = fullName;
        profile.jobTitle = jobTitle;
        profile.bio = bio;
        profile.social = social;
        await profile.save();

        return res.status(200).json(profile);
      });

    case 'DELETE':
      return authenticate(req, res, async () => {
        console.log('👉 DELETE profile for:', req.user);
        const profile = await Profile.findOneAndDelete({ userId: req.user!.userId });
        if (!profile) {
          return res.status(404).json({ message: 'Profile not found.' });
        }
        return res.status(200).json({ message: 'Profile deleted.' });
      });

    default:
      return res.status(405).json({ message: 'Method not allowed.' });
  }
}
