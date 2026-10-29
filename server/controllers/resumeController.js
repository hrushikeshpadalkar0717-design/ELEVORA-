import { Resume } from '../models/Resume.js';

// @desc    Get all resumes for logged in user
// @route   GET /api/resumes
export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
    const formatted = resumes.map((doc) => doc.toJSON());
    res.json(formatted);
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Error retrieving resumes' });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
export const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: 'Resume not found (invalid ID format)' });
    }

    const resume = await Resume.findOne({ _id: id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume.toJSON());
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Error retrieving resume' });
  }
};

// @desc    Create a new resume
export const createResume = async (req, res) => {
  try {
    // Enforce plan restrictions defined in ELEVORA pricing tiers
    const userPlan = req.user.plan || 'free';
    const existingCount = await Resume.countDocuments({ user: req.user._id });

    if (userPlan === 'free' && existingCount >= 1) {
      return res.status(403).json({
        message: 'Free plan limit reached (1 resume maximum). Please upgrade to Pro or Ultra to create additional resumes.',
        code: 'PLAN_LIMIT_EXCEEDED',
        plan: userPlan,
        limit: 1,
        currentCount: existingCount,
      });
    }

    if (userPlan === 'pro' && existingCount >= 10) {
      return res.status(403).json({
        message: 'Pro plan limit reached (10 resumes maximum). Please upgrade to Ultra for unlimited resumes.',
        code: 'PLAN_LIMIT_EXCEEDED',
        plan: userPlan,
        limit: 10,
        currentCount: existingCount,
      });
    }

    const rawData = { ...req.body };
    // Remove client-only or non-ObjectId _id/id to avoid CastError
    if (rawData._id && !rawData._id.toString().match(/^[0-9a-fA-F]{24}$/)) {
      delete rawData._id;
    }
    if (rawData.id && !rawData.id.toString().match(/^[0-9a-fA-F]{24}$/)) {
      delete rawData.id;
    }

    const resumeData = {
      ...rawData,
      user: req.user._id,
      name: rawData.name || rawData.title || 'My Professional Resume',
      title: rawData.name || rawData.title || 'My Professional Resume',
    };

    const resume = await Resume.create(resumeData);
    res.status(201).json(resume.toJSON());
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ message: error.message || 'Error creating resume' });
  }
};

// @desc    Update a resume
// @route   PUT /api/resumes/:id
export const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    let resume = await Resume.findOne({ _id: id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const updates = { ...req.body };
    delete updates._id;
    delete updates.user;

    Object.assign(resume, updates);
    const updated = await resume.save();
    res.json(updated.toJSON());
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ message: error.message || 'Error updating resume' });
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const resume = await Resume.findOneAndDelete({ _id: id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Error deleting resume' });
  }
};

// @desc    Batch sync resumes from frontend to MongoDB
// @route   POST /api/resumes/sync
export const syncResumes = async (req, res) => {
  try {
    const { resumes } = req.body;
    if (!Array.isArray(resumes)) {
      return res.status(400).json({ message: 'Resumes array required' });
    }

    // Upsert or create resumes for this user
    for (const r of resumes) {
      const cleanData = { ...r };
      const hasValidId = cleanData._id && cleanData._id.toString().match(/^[0-9a-fA-F]{24}$/);
      if (!hasValidId) {
        delete cleanData._id;
        delete cleanData.id;
      }

      if (hasValidId) {
        await Resume.findOneAndUpdate(
          { _id: cleanData._id, user: req.user._id },
          { ...cleanData, user: req.user._id },
          { upsert: true, new: true }
        );
      } else {
        await Resume.create({
          ...cleanData,
          user: req.user._id,
        });
      }
    }

    const updatedList = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
    const formattedList = updatedList.map((doc) => doc.toJSON());
    res.json(formattedList);
  } catch (error) {
    console.error('Sync resumes error:', error);
    res.status(500).json({ message: 'Error syncing resumes' });
  }
};

