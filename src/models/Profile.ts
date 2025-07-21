// src/models/Profile.ts
import mongoose, { Schema, models, model } from 'mongoose'

const ProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String },
  jobTitle: { type: String },
  bio: { type: String },
  social: {
    website: String,
    github: String,
    linkedin: String,
    twitter: String
  }
}, { timestamps: true })

export default models.Profile || model('Profile', ProfileSchema)
