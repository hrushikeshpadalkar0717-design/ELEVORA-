import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password hash by default
    },
    phone: {
      type: String,
      default: '',
    },
    field: {
      type: String,
      default: 'Engineering',
    },
    subfield: {
      type: String,
      default: 'CSE',
    },
    location: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    portfolio: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'linkedin'],
      default: 'local',
    },
    googleId: {
      type: String,
      default: null,
      index: { sparse: true },  // unique-ish: allows many nulls, but no duplicate IDs
    },
    linkedinId: {
      type: String,
      default: null,
      index: { sparse: true },
    },
    careerGoal: {
      stage: { type: String, default: 'Fresher' },
      roleType: { type: String, default: 'Full-time' },
      targetRoles: [{ type: String }],
      summary: { type: String, default: '' },
    },
    activeTemplate: {
      type: String,
      default: 'modern',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to verify password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', UserSchema);
