import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Both 'name' (frontend) and 'title' (legacy backend) supported
    name: {
      type: String,
      default: 'My Professional Resume',
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
      default: 92,
    },
    keywordMatch: {
      type: Number,
      default: 88,
    },
    suggestions: {
      type: Number,
      default: 2,
    },
    lastUpdated: {
      type: String,
      default: 'Just now',
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
        id: String,
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
        id: String,
        company: String,
        role: String,
        location: String,
        startDate: String,
        endDate: String,
        currentlyWorking: Boolean,
        current: Boolean,
        responsibilities: [String],
        description: mongoose.Schema.Types.Mixed,
      },
    ],
    projects: [
      {
        id: String,
        name: String,
        title: String,
        type: { type: String },
        role: String,
        duration: String,
        description: mongoose.Schema.Types.Mixed,
        technologies: mongoose.Schema.Types.Mixed,
        keyFeatures: [String],
        github: String,
        liveUrl: String,
        link: String,
      },
    ],
    skills: {
      technical: [String],
      soft: [String],
      tools: [String],
      languages: [mongoose.Schema.Types.Mixed],
    },
    certifications: [
      {
        id: String,
        name: String,
        issuer: String,
        date: String,
        year: String,
        credentialId: String,
        credentialUrl: String,
        link: String,
        url: String,
      },
    ],
    achievements: [
      {
        id: String,
        title: String,
        description: String,
        year: String,
        date: String,
      },
    ],
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: false, // Ensure additional metadata from frontend templates is never dropped
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        if (!ret.id && ret._id) ret.id = ret._id.toString();
        if (!ret.name && ret.title) ret.name = ret.title;
        return ret;
      },
    },
  }
);

// Pre-save hook to synchronize name and title
ResumeSchema.pre('save', function (next) {
  if (this.name && !this.title) this.title = this.name;
  if (this.title && !this.name) this.name = this.title;
  next();
});

export const Resume = mongoose.model('Resume', ResumeSchema);

