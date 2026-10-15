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
import { normalizeLegacyProfile } from '../data/careerTaxonomy';
import { api } from '../services/api';

const ResumeContext = createContext(null);

const STORAGE_KEY = 'elevora_app_state_v1';

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

  // Initialize from localStorage and MongoDB Atlas on mount
  useEffect(() => {
    const initializeAppState = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.profile) {
            const norm = normalizeLegacyProfile(parsed.profile.field, parsed.profile.subfield);
            setProfile({ ...parsed.profile, field: norm.field, subfield: norm.subfield });
          }
          if (parsed.careerGoal) setCareerGoal(parsed.careerGoal);
          if (parsed.education) setEducation(parsed.education);
          if (parsed.projects) setProjects(parsed.projects);
          if (parsed.experience) setExperience(parsed.experience);
          if (parsed.skills) setSkills(parsed.skills);
          if (parsed.certifications) setCertifications(parsed.certifications);
          if (parsed.achievements) setAchievements(parsed.achievements);
          if (parsed.savedResumes) {
            const migratedResumes = parsed.savedResumes.map((res) => {
              const norm = normalizeLegacyProfile(res.field, res.subfield);
              return { ...res, field: norm.field, subfield: norm.subfield };
            });
            setSavedResumes(migratedResumes);
          }
          if (parsed.activeTemplate) setActiveTemplate(parsed.activeTemplate);
          if (parsed.atsAnalysis) setAtsAnalysis(parsed.atsAnalysis);
          if (parsed.isAuthenticated !== undefined) setIsAuthenticated(parsed.isAuthenticated);
        }

        // Check if user has an active backend session in MongoDB Atlas (via HttpOnly cookie or localStorage token)
        try {
          const userData = await api.getMe();
          if (userData && userData.email) {
            setIsAuthenticated(true);
            const norm = normalizeLegacyProfile(userData.field, userData.subfield);
            setProfile((prev) => ({
              ...prev,
              fullName: userData.fullName || prev.fullName,
              email: userData.email,
              phone: userData.phone || prev.phone,
              field: norm.field || prev.field,
              subfield: norm.subfield || prev.subfield,
              location: userData.location || prev.location,
              linkedin: userData.linkedin || prev.linkedin,
              portfolio: userData.portfolio || prev.portfolio,
              github: userData.github || prev.github,
              avatar: userData.avatar || prev.avatar,
            }));
            if (userData.careerGoal) {
              setCareerGoal((prev) => ({ ...prev, ...userData.careerGoal }));
            }

            // Also load saved resumes from MongoDB
            const dbResumes = await api.getResumes();
            if (Array.isArray(dbResumes) && dbResumes.length > 0) {
              setSavedResumes(dbResumes);
            }
          }
        } catch (apiErr) {
          // If server says not authenticated, ensure local storage and state reflect logged out
          if (localStorage.getItem('elevora_auth_token')) {
            localStorage.removeItem('elevora_auth_token');
          }
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Error loading stored state:', err);
      } finally {
        setIsLoaded(true);
      }
    };

    initializeAppState();
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

  // Auth methods with MongoDB Atlas integration
  const login = async (userData) => {
    if (!userData?.email || !userData?.password) {
      throw new Error('Please enter both email and password');
    }

    // Call backend API — throws on 400/401/500 so wrong credentials are not bypassed
    const serverUser = await api.login({ email: userData.email, password: userData.password });

    setIsAuthenticated(true);
    const norm = normalizeLegacyProfile(serverUser?.field, serverUser?.subfield);
    setProfile((prev) => ({
      ...prev,
      email: serverUser?.email || userData.email,
      fullName: serverUser?.fullName || prev.fullName,
      phone: serverUser?.phone || prev.phone,
      field: norm.field || prev.field,
      subfield: norm.subfield || prev.subfield,
      avatar: serverUser?.avatar || prev.avatar,
    }));

    if (serverUser?.careerGoal) {
      setCareerGoal((prev) => ({ ...prev, ...serverUser.careerGoal }));
    }

    try {
      const dbResumes = await api.getResumes();
      if (Array.isArray(dbResumes) && dbResumes.length > 0) {
        setSavedResumes(dbResumes);
      }
    } catch (e) {
      console.warn('Resume load notice on login:', e.message);
    }

    return serverUser;
  };

  const signup = async (userData) => {
    if (!userData?.email || !userData?.password) {
      throw new Error('Email and password are required');
    }
    const normalized = normalizeLegacyProfile(
      userData.field || '',
      userData.subfield || ''
    );

    const payload = {
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password || 'Elevora@2026!',
      phone: userData.phone || '',
      field: normalized.field,
      subfield: normalized.subfield,
    };

    const serverUser = await api.register(payload);
    setIsAuthenticated(true);

    setProfile((prev) => ({
      ...prev,
      fullName: serverUser?.fullName || payload.fullName,
      email: serverUser?.email || payload.email,
      phone: serverUser?.phone || payload.phone,
      field: serverUser?.field || payload.field,
      subfield: serverUser?.subfield || payload.subfield,
    }));

    return serverUser;
  };

  const googleLogin = async (payload) => {
    setIsAuthenticated(true);
    try {
      const serverUser = await api.googleAuth(payload);
      if (serverUser) {
        const norm = normalizeLegacyProfile(serverUser.field, serverUser.subfield);
        setProfile((prev) => ({
          ...prev,
          fullName: serverUser.fullName || prev.fullName,
          email: serverUser.email || prev.email,
          avatar: serverUser.avatar || prev.avatar,
          field: norm.field || prev.field,
          subfield: norm.subfield || prev.subfield,
        }));
        if (serverUser.careerGoal) {
          setCareerGoal((prev) => ({ ...prev, ...serverUser.careerGoal }));
        }
      }
      return serverUser;
    } catch (err) {
      console.error('Google auth error:', err);
      // Fallback local auth if server is temporarily unreachable
      setProfile((prev) => ({
        ...prev,
        fullName: payload.fullName || 'Google User',
        email: payload.email || 'user@google.com',
      }));
    }
  };

  const linkedinLogin = async (payload) => {
    setIsAuthenticated(true);
    try {
      const serverUser = await api.linkedinAuth(payload);
      if (serverUser) {
        const norm = normalizeLegacyProfile(serverUser.field, serverUser.subfield);
        setProfile((prev) => ({
          ...prev,
          fullName: serverUser.fullName || prev.fullName,
          email: serverUser.email || prev.email,
          avatar: serverUser.avatar || prev.avatar,
          field: norm.field || prev.field,
          subfield: norm.subfield || prev.subfield,
        }));
        if (serverUser.careerGoal) {
          setCareerGoal((prev) => ({ ...prev, ...serverUser.careerGoal }));
        }
      }
      return serverUser;
    } catch (err) {
      console.error('LinkedIn auth error:', err);
      setProfile((prev) => ({
        ...prev,
        fullName: payload.fullName || 'LinkedIn User',
        email: payload.email || 'user@linkedin.com',
      }));
    }
  };

  const loginWithToken = async (token) => {
    if (token) {
      localStorage.setItem('elevora_auth_token', token);
    }
    const serverUser = await api.getMe();
    if (!serverUser || !serverUser.email) {
      throw new Error('Failed to retrieve user profile');
    }

    setIsAuthenticated(true);
    const norm = normalizeLegacyProfile(serverUser.field, serverUser.subfield);
    setProfile((prev) => ({
      ...prev,
      fullName: serverUser.fullName || prev.fullName,
      email: serverUser.email,
      phone: serverUser.phone || prev.phone,
      field: norm.field || prev.field,
      subfield: norm.subfield || prev.subfield,
      location: serverUser.location || prev.location,
      linkedin: serverUser.linkedin || prev.linkedin,
      portfolio: serverUser.portfolio || prev.portfolio,
      github: serverUser.github || prev.github,
      avatar: serverUser.avatar || prev.avatar,
    }));

    if (serverUser.careerGoal) {
      setCareerGoal((prev) => ({ ...prev, ...serverUser.careerGoal }));
    }

    try {
      const dbResumes = await api.getResumes();
      if (Array.isArray(dbResumes) && dbResumes.length > 0) {
        setSavedResumes(dbResumes);
      }
    } catch (e) {
      console.warn('Resume sync notice:', e.message);
    }

    return serverUser;
  };

  const logout = async () => {
    setIsAuthenticated(false);
    try {
      await api.logout();
    } catch (e) {
      console.warn('Logout notice:', e.message);
    }
    localStorage.removeItem('elevora_auth_token');
  };

  // Profile update with background backend sync
  const updateProfile = (data) => {
    setProfile((prev) => {
      const updated = { ...prev, ...data };
      api.updateProfile(updated).catch(() => {});
      return updated;
    });
  };

  // Career Goal update with background backend sync
  const updateCareerGoal = (data) => {
    setCareerGoal((prev) => {
      const updated = { ...prev, ...data };
      api.updateProfile({ careerGoal: updated }).catch(() => {});
      return updated;
    });
  };

  // Intelligent Resume Upload & Extraction handler
  const uploadAndApplyResume = async (file) => {
    const result = await api.uploadAndExtractResume(file);
    if (result && result.profile) {
      const norm = normalizeLegacyProfile(result.profile.field, result.profile.subfield);
      setProfile((prev) => ({
        ...prev,
        fullName: result.profile.fullName || prev.fullName,
        email: result.profile.email || prev.email,
        phone: result.profile.phone || prev.phone,
        field: norm.field || prev.field,
        subfield: norm.subfield || prev.subfield,
        linkedin: result.profile.linkedin || prev.linkedin,
        github: result.profile.github || prev.github,
        portfolio: result.profile.portfolio || prev.portfolio,
      }));

      if (result.careerGoal) {
        setCareerGoal((prev) => ({
          ...prev,
          stage: result.careerGoal.stage || prev.stage,
          targetRoles: result.careerGoal.targetRoles || prev.targetRoles,
          summary: result.careerGoal.summary || prev.summary,
        }));
      }

      if (result.education && result.education.length > 0) {
        setEducation(result.education);
      }

      if (result.skills) {
        setSkills((prev) => ({
          ...prev,
          technical: result.skills.technical?.length ? result.skills.technical : prev.technical,
          soft: result.skills.soft?.length ? result.skills.soft : prev.soft,
        }));
      }
    }
    return result;
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
  const createSavedResume = (name, targetRole, template = 'modern', field = '', subfield = '') => {
    const resolvedRole = targetRole || careerGoal.targetRoles[0] || profile.subfield || profile.field || 'Professional';
    const resolvedField = field || profile.field || '';
    const resolvedSubfield = subfield || profile.subfield || '';
    const newResume = {
      id: 'res-' + Date.now(),
      name: name || `${resolvedRole} Resume`,
      targetRole: resolvedRole,
      field: resolvedField,
      subfield: resolvedSubfield,
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
      const primaryRole =
        careerGoal?.targetRoles?.[0] ||
        profile?.subfield ||
        profile?.field ||
        'Professional';
      const result = await aiService.analyzeResume(
        { profile, careerGoal, education, experience, projects, skills, certifications, achievements },
        primaryRole,
        profile?.field,
        profile?.subfield
      );
      setAtsAnalysis(result);
      if (activeResumeId) {
        setSavedResumes((prev) =>
          prev.map((r) =>
            r.id === activeResumeId
              ? { ...r, atsScore: result.score, keywordMatch: result.keywordMatch, lastUpdated: 'Just now' }
              : r
          )
        );
      }
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
        loginWithToken,
        googleLogin,
        linkedinLogin,
        uploadAndApplyResume,
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
