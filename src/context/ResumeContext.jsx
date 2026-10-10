import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialProfile,
  initialCareerGoal,
  initialEducation,
  initialProjects,
  initialExperience,
  initialSkills,
  initialCertifications,
  initialAchievements,
  initialSavedResumes
} from '../data/initialData';
import { aiService } from '../services/aiService';

const ResumeContext = createContext(null);

const STORAGE_KEY = 'resumeai_app_state_v1';

export const ResumeProvider = ({ children }) => {
  // Load from localStorage or defaults
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [profile, setProfile] = useState(initialProfile);
  const [careerGoal, setCareerGoal] = useState(initialCareerGoal);
  const [education, setEducation] = useState(initialEducation);
  const [projects, setProjects] = useState(initialProjects);
  const [experience, setExperience] = useState(initialExperience);
  const [skills, setSkills] = useState(initialSkills);
  const [certifications, setCertifications] = useState(initialCertifications);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [savedResumes, setSavedResumes] = useState(initialSavedResumes);
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [activeResumeId, setActiveResumeId] = useState('res-1');

  const [atsAnalysis, setAtsAnalysis] = useState({
    score: 92,
    keywordMatch: 88,
    suggestionsCount: 2,
    status: 'Great match!',
    matchedKeywords: ['SolidWorks', 'CAD Modelling', 'Simulation', 'Mechanical Design', 'OpenCV', 'Python', 'Quality Control', 'Documentation'],
    missingKeywords: ['FEA Analysis', 'GD&T', 'DFM/DFA'],
    formattingFeedback: [
      'Clean ATS-friendly heading and section hierarchy.',
      'Contact channels and professional portfolio links formatted properly.',
      'Reverse-chronological structure adheres to recruiter guidelines.'
    ],
    improvementSuggestions: [
      'Incorporate quantifiable metrics in your Tata Technologies internship experience.',
      'Add GD&T and FEA Analysis skills to your profile to boost recruiter keyword hits.'
    ]
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.careerGoal) setCareerGoal(parsed.careerGoal);
        if (parsed.education) setEducation(parsed.education);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.experience) setExperience(parsed.experience);
        if (parsed.skills) setSkills(parsed.skills);
        if (parsed.certifications) setCertifications(parsed.certifications);
        if (parsed.achievements) setAchievements(parsed.achievements);
        if (parsed.savedResumes) setSavedResumes(parsed.savedResumes);
        if (parsed.activeTemplate) setActiveTemplate(parsed.activeTemplate);
        if (parsed.atsAnalysis) setAtsAnalysis(parsed.atsAnalysis);
        if (parsed.isAuthenticated !== undefined) setIsAuthenticated(parsed.isAuthenticated);
      }
    } catch (err) {
      console.error('Error loading stored state:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToSave = {
        isAuthenticated,
        profile,
        careerGoal,
        education,
        projects,
        experience,
        skills,
        certifications,
        achievements,
        savedResumes,
        activeTemplate,
        atsAnalysis
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (err) {
      console.error('Error saving state:', err);
    }
  }, [
    isLoaded,
    isAuthenticated,
    profile,
    careerGoal,
    education,
    projects,
    experience,
    skills,
    certifications,
    achievements,
    savedResumes,
    activeTemplate,
    atsAnalysis
  ]);

  // Auth methods
  const login = (userData) => {
    setIsAuthenticated(true);
    if (userData?.email) {
      setProfile((prev) => ({
        ...prev,
        email: userData.email,
        fullName: userData.fullName || prev.fullName
      }));
    }
  };

  const signup = (userData) => {
    setIsAuthenticated(true);
    setProfile((prev) => ({
      ...prev,
      fullName: userData.fullName || prev.fullName,
      email: userData.email || prev.email,
      phone: userData.phone || prev.phone,
      field: userData.field || prev.field,
      subfield: userData.subfield || prev.subfield
    }));
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Profile
  const updateProfile = (data) => {
    setProfile((prev) => ({ ...prev, ...data }));
  };

  // Career Goal
  const updateCareerGoal = (data) => {
    setCareerGoal((prev) => ({ ...prev, ...data }));
  };

  const setTargetRoles = (roles) => {
    setCareerGoal((prev) => ({ ...prev, targetRoles: roles }));
  };

  // Education
  const addEducation = (edu) => {
    const newEdu = { ...edu, id: 'edu-' + Date.now() };
    setEducation((prev) => [...prev, newEdu]);
    return newEdu;
  };

  const updateEducation = (id, updated) => {
    setEducation((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
  };

  const deleteEducation = (id) => {
    setEducation((prev) => prev.filter((e) => e.id !== id));
  };

  // Projects
  const addProject = (proj) => {
    const newProj = { ...proj, id: 'proj-' + Date.now() };
    setProjects((prev) => [...prev, newProj]);
    return newProj;
  };

  const updateProject = (id, updated) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Experience
  const addExperience = (exp) => {
    const newExp = { ...exp, id: 'exp-' + Date.now() };
    setExperience((prev) => [...prev, newExp]);
    return newExp;
  };

  const updateExperience = (id, updated) => {
    setExperience((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
  };

  const deleteExperience = (id) => {
    setExperience((prev) => prev.filter((e) => e.id !== id));
  };

  // Skills
  const addTechnicalSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (skills.technical.includes(trimmed)) return;
    setSkills((prev) => ({
      ...prev,
      technical: [...prev.technical, trimmed]
    }));
  };

  const removeTechnicalSkill = (skill) => {
    setSkills((prev) => ({
      ...prev,
      technical: prev.technical.filter((s) => s !== skill)
    }));
  };

  const addSoftSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (skills.soft.includes(trimmed)) return;
    setSkills((prev) => ({
      ...prev,
      soft: [...prev.soft, trimmed]
    }));
  };

  const removeSoftSkill = (skill) => {
    setSkills((prev) => ({
      ...prev,
      soft: prev.soft.filter((s) => s !== skill)
    }));
  };

  const addLanguage = (lang) => {
    setSkills((prev) => ({
      ...prev,
      languages: [...prev.languages, lang]
    }));
  };

  const removeLanguage = (index) => {
    setSkills((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, idx) => idx !== index)
    }));
  };

  const updateLanguage = (index, updated) => {
    setSkills((prev) => ({
      ...prev,
      languages: prev.languages.map((l, idx) => (idx === index ? { ...l, ...updated } : l))
    }));
  };

  // Certifications
  const addCertification = (cert) => {
    const newCert = { ...cert, id: 'cert-' + Date.now() };
    setCertifications((prev) => [...prev, newCert]);
    return newCert;
  };

  const updateCertification = (id, updated) => {
    setCertifications((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteCertification = (id) => {
    setCertifications((prev) => prev.filter((c) => c.id !== id));
  };

  // Achievements
  const addAchievement = (ach) => {
    const newAch = { ...ach, id: 'ach-' + Date.now() };
    setAchievements((prev) => [...prev, newAch]);
    return newAch;
  };

  const updateAchievement = (id, updated) => {
    setAchievements((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
  };

  const deleteAchievement = (id) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id));
  };

  // Resumes list management
  const createSavedResume = (name, targetRole, template = 'modern') => {
    const newResume = {
      id: 'res-' + Date.now(),
      name: name || `${targetRole || 'Professional'} Resume`,
      targetRole: targetRole || careerGoal.targetRoles[0] || 'Mechanical Design Engineer',
      template: template || activeTemplate,
      lastUpdated: 'Just now',
      atsScore: 92,
      keywordMatch: 88,
      suggestions: 2
    };
    setSavedResumes((prev) => [newResume, ...prev]);
    setActiveResumeId(newResume.id);
    setActiveTemplate(newResume.template);
    return newResume;
  };

  const updateSavedResume = (id, updates) => {
    setSavedResumes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates, lastUpdated: 'Just now' } : r))
    );
  };

  const deleteSavedResume = (id) => {
    setSavedResumes((prev) => prev.filter((r) => r.id !== id));
  };

  const duplicateSavedResume = (id) => {
    const original = savedResumes.find((r) => r.id === id);
    if (!original) return;
    const duplicated = {
      ...original,
      id: 'res-' + Date.now(),
      name: `${original.name} (Copy)`,
      lastUpdated: 'Just now'
    };
    setSavedResumes((prev) => [duplicated, ...prev]);
    return duplicated;
  };

  // Re-analyze ATS with AI
  const reanalyzeATS = async () => {
    setIsAnalyzing(true);
    try {
      const primaryRole = careerGoal.targetRoles[0] || 'Mechanical Design Engineer';
      const result = await aiService.analyzeResume(
        { profile, careerGoal, education, experience, projects, skills, certifications, achievements },
        primaryRole
      );
      setAtsAnalysis(result);
      return result;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset to sample defaults
  const resetToDefaults = () => {
    setProfile(initialProfile);
    setCareerGoal(initialCareerGoal);
    setEducation(initialEducation);
    setProjects(initialProjects);
    setExperience(initialExperience);
    setSkills(initialSkills);
    setCertifications(initialCertifications);
    setAchievements(initialAchievements);
    setSavedResumes(initialSavedResumes);
    setActiveTemplate('modern');
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ResumeContext.Provider
      value={{
        isAuthenticated,
        login,
        signup,
        logout,
        profile,
        updateProfile,
        careerGoal,
        updateCareerGoal,
        setTargetRoles,
        education,
        addEducation,
        updateEducation,
        deleteEducation,
        experience,
        addExperience,
        updateExperience,
        deleteExperience,
        projects,
        addProject,
        updateProject,
        deleteProject,
        skills,
        addTechnicalSkill,
        removeTechnicalSkill,
        addSoftSkill,
        removeSoftSkill,
        addLanguage,
        removeLanguage,
        updateLanguage,
        certifications,
        addCertification,
        updateCertification,
        deleteCertification,
        achievements,
        addAchievement,
        updateAchievement,
        deleteAchievement,
        savedResumes,
        createSavedResume,
        updateSavedResume,
        deleteSavedResume,
        duplicateSavedResume,
        activeTemplate,
        setActiveTemplate,
        activeResumeId,
        setActiveResumeId,
        atsAnalysis,
        isAnalyzing,
        reanalyzeATS,
        resetToDefaults
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) throw new Error('useResume must be used within ResumeProvider');
  return context;
};
