import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'My Professional Resume',
    },
    targetRole: {
      type: String,
      default: 'Software Developer',
    },
    field: {
      type: String,
      default: 'Engineering',
    },
    subfield: {
      type: String,
      default: 'CSE',
    },
    template: {
      type: String,
      default: 'modern',
    },
    atsScore: {
      type: Number,
      default: 85,
    },
    profile: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      portfolio: String,
      github: String,
      avatar: String,
    },
    careerGoal: {
      stage: String,
      roleType: String,
      targetRoles: [String],
      summary: String,
    },
    education: [
      {
        degree: String,
        branch: String,
        college: String,
        location: String,
        startYear: String,
        graduationYear: String,
        score: String,
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: [String],
      },
    ],
    projects: [
      {
        title: String,
        technologies: [String],
        link: String,
        description: [String],
      },
    ],
    skills: {
      technical: [String],
      soft: [String],
      tools: [String],
    },
    certifications: [
      {
        name: String,
        issuer: String,
        year: String,
        credentialUrl: String,
      },
    ],
    achievements: [
      {
        title: String,
        description: String,
        year: String,
      },
    ],
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Resume = mongoose.model('Resume', ResumeSchema);
