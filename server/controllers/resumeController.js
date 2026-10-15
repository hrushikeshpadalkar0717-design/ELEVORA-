import { Resume } from '../models/Resume.js';

// @desc    Get all resumes for logged in user
// @route   GET /api/resumes
export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Error retrieving resumes' });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Error retrieving resume' });
  }
};

// @desc    Create a new resume
// @route   POST /api/resumes
export const createResume = async (req, res) => {
  try {
    const resumeData = {
      ...req.body,
      user: req.user._id,
    };

    const resume = await Resume.create(resumeData);
    res.status(201).json(resume);
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ message: error.message || 'Error creating resume' });
  }
};

// @desc    Update a resume
// @route   PUT /api/resumes/:id
export const updateResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    Object.assign(resume, req.body);
    const updated = await resume.save();
    res.json(updated);
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ message: error.message || 'Error updating resume' });
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
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

    // Upsert or replace resumes for this user
    for (const r of resumes) {
      if (r._id && r._id.match(/^[0-9a-fA-F]{24}$/)) {
        await Resume.findOneAndUpdate(
          { _id: r._id, user: req.user._id },
          { ...r, user: req.user._id },
          { upsert: true, new: true }
        );
      } else {
        await Resume.create({
          ...r,
          user: req.user._id,
        });
      }
    }

    const updatedList = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(updatedList);
  } catch (error) {
    console.error('Sync resumes error:', error);
    res.status(500).json({ message: 'Error syncing resumes' });
  }
};
