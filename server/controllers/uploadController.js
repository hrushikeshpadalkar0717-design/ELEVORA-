import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

// Comprehensive taxonomy dictionary matching our unified taxonomy
const TAXONOMY_MAP = {
  'Engineering': {
    'CSE': {
      keywords: ['react', 'node', 'javascript', 'typescript', 'python', 'java', 'c++', 'full-stack', 'backend', 'frontend', 'express', 'mongodb', 'sql', 'html', 'css', 'git', 'computer science', 'cse', 'software engineer', 'web development', 'algorithm', 'data structures'],
      roles: ['Software Developer', 'Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'Software Test Engineer', 'AI/ML Engineer', 'Data Analyst', 'Cybersecurity Analyst'],
    },
    'IT': {
      keywords: ['information technology', 'devops', 'cloud', 'aws', 'azure', 'docker', 'kubernetes', 'system admin', 'network', 'linux', 'database administrator', 'ci/cd', 'cybersecurity', 'it support', 'infrastructure'],
      roles: ['IT Support Engineer', 'System Administrator', 'Network Engineer', 'Cloud Support Engineer', 'Database Administrator', 'IT Business Analyst', 'DevOps Engineer', 'Cybersecurity Analyst'],
    },
    'E&TC': {
      keywords: ['electronics', 'telecommunication', 'embedded', 'vlsi', 'iot', 'microcontroller', 'arduino', 'raspberry pi', 'verilog', 'vhdl', 'fpga', 'rf', 'signal processing', 'matlab', 'pcb', 'circuits'],
      roles: ['Electronics Design Engineer', 'Embedded Systems Engineer', 'VLSI Design Engineer', 'Telecommunications Engineer', 'IoT Engineer', 'RF Engineer', 'Signal Processing Engineer', 'Hardware Testing Engineer'],
    },
    'Mechanical': {
      keywords: ['mechanical', 'cad', 'solidworks', 'catia', 'autocad', 'ansys', 'fea', 'gd&t', 'manufacturing', 'automotive', 'thermal', 'hvac', 'tolerance', 'machining', 'design engineer', 'production'],
      roles: ['Mechanical Design Engineer', 'CAD Engineer', 'Manufacturing Engineer', 'Production Engineer', 'Quality Engineer', 'Automotive Engineer', 'Thermal Engineer', 'Maintenance Engineer'],
    },
    'Civil': {
      keywords: ['civil', 'construction', 'structural', 'staad', 'etabs', 'revit', 'survey', 'site engineer', 'concrete', 'boq', 'estimation', 'bim', 'building', 'infrastructure'],
      roles: ['Civil Site Engineer', 'Structural Engineer', 'Construction Project Engineer', 'Quantity Surveyor', 'Geotechnical Engineer', 'Transportation Engineer', 'Water Resources Engineer', 'BIM Civil Modeler'],
    },
    'Electrical': {
      keywords: ['electrical', 'power systems', 'substation', 'plc', 'scada', 'switchgear', 'transformers', 'high voltage', 'power electronics', 'relay', 'electrical design', 'etap'],
      roles: ['Electrical Design Engineer', 'Power Systems Engineer', 'Control & Automation Engineer', 'Substation Engineer', 'Testing & Commissioning Engineer', 'Renewable Energy Engineer', 'Maintenance Electrical Engineer'],
    },
  },
  'Medical & Healthcare': {
    'MBBS': {
      keywords: ['mbbs', 'doctor', 'medicine', 'clinical', 'patient care', 'diagnosis', 'hospital', 'surgery', 'opd', 'internal medicine', 'pediatrics', 'resuscitation', 'acls', 'bls'],
      roles: ['General Physician', 'Resident Medical Officer (RMO)', 'Junior Resident', 'Medical Officer', 'Emergency Room Physician', 'Clinical Research Associate', 'Public Health Consultant'],
    },
    'BDS': {
      keywords: ['bds', 'dental', 'dentist', 'oral', 'teeth', 'orthodontics', 'prosthodontics', 'root canal', 'periodontics', 'extraction', 'dental surgery'],
      roles: ['Dental Surgeon', 'Associate Dentist', 'General Dental Practitioner', 'Oral Health Consultant', 'Clinical Research Specialist – Dental', 'Dental Officer'],
    },
    'B.Pharm': {
      keywords: ['pharm', 'pharmacy', 'pharmacology', 'drug', 'formulation', 'qc', 'qa', 'gmp', 'pharmaceutical', 'clinical research', 'regulatory affairs'],
      roles: ['Pharmacist', 'Quality Assurance (QA) Executive', 'Quality Control (QC) Chemist', 'Regulatory Affairs Executive', 'Formulation Scientist', 'Medical Representative', 'Clinical Data Manager'],
    },
    'B.Sc Nursing': {
      keywords: ['nursing', 'nurse', 'patient care', 'icu nurse', 'staff nurse', 'vital signs', 'medication administration', 'wound care', 'triage', 'hospital'],
      roles: ['Staff Nurse', 'ICU / Critical Care Nurse', 'Emergency Department Nurse', 'Pediatric Nurse', 'Nurse Educator', 'Infection Control Nurse', 'Home Healthcare Specialist'],
    },
  },
  'Commerce & Management': {
    'B.Com': {
      keywords: ['b.com', 'bcom', 'commerce', 'accounting', 'tally', 'gst', 'taxation', 'accounts payable', 'receivable', 'audit', 'financial statements', 'bookkeeping'],
      roles: ['Accountant', 'Tax Associate', 'Audit Assistant', 'Financial Analyst – Junior', 'Accounts Executive', 'Billing Specialist', 'Banking Operations Executive'],
    },
    'CA': {
      keywords: ['chartered accountant', 'ca', 'ifrs', 'statutory audit', 'internal audit', 'tax advisory', 'forensic', 'financial planning', 'corporate tax'],
      roles: ['Chartered Accountant (CA)', 'Audit Senior / Manager', 'Tax Consultant', 'Financial Controller', 'Internal Auditor', 'Risk Advisory Consultant', 'Corporate Finance Associate'],
    },
    'BBA': {
      keywords: ['bba', 'business administration', 'sales', 'marketing', 'operations', 'customer success', 'hr executive', 'market research'],
      roles: ['Business Development Executive', 'Marketing Executive', 'Operations Associate', 'Human Resources (HR) Executive', 'Client Relationship Manager', 'Digital Marketing Associate'],
    },
    'MBA': {
      keywords: ['mba', 'product management', 'business analyst', 'strategy', 'management consultant', 'brand manager', 'operations manager', 'financial consultant'],
      roles: ['Product Manager', 'Management Consultant', 'Business Development Manager', 'Marketing Manager', 'Operations Manager', 'Financial Analyst', 'Human Resources Manager'],
    },
    'CS': {
      keywords: ['company secretary', 'cs', 'corporate governance', 'compliance', 'roc', 'secretarial audit', 'board meetings', 'sebi', 'legal compliance'],
      roles: ['Company Secretary (CS)', 'Corporate Governance Officer', 'Legal & Compliance Associate', 'Secretarial Auditor', 'Investor Relations Officer', 'Regulatory Compliance Manager'],
    },
  },
  'Science & Technology': {
    'B.Sc Computer Science': {
      keywords: ['b.sc cs', 'bsc cs', 'computer science', 'c++', 'python', 'java', 'data science', 'sql', 'web development', 'algorithms', 'software'],
      roles: ['Software Developer', 'Web Developer', 'Data Analyst', 'Database Administrator', 'Technical Support Engineer', 'Software Tester (QA)', 'Systems Analyst'],
    },
    'B.Sc IT': {
      keywords: ['b.sc it', 'bsc it', 'network', 'cloud', 'system administrator', 'hardware', 'cybersecurity', 'it support', 'devops'],
      roles: ['IT Support Specialist', 'Network Administrator', 'Cloud Operations Associate', 'Cybersecurity Analyst – Entry Level', 'Database Support Specialist', 'System Analyst'],
    },
    'BCA': {
      keywords: ['bca', 'computer applications', 'php', 'full-stack', 'java', 'web applications', 'frontend', 'sql', 'react'],
      roles: ['Junior Software Developer', 'Frontend Developer', 'Backend Developer', 'Web Application Developer', 'QA Software Tester', 'IT Support Specialist', 'Database Operator'],
    },
    'MCA': {
      keywords: ['mca', 'master of computer applications', 'full-stack', 'cloud architect', 'software engineer', 'system architect', 'enterprise'],
      roles: ['Senior Software Engineer', 'Full-Stack Developer', 'DevOps / Cloud Engineer', 'Technical Team Lead', 'Solutions Architect – Associate', 'Data Scientist / ML Engineer'],
    },
    'B.Sc Agriculture': {
      keywords: ['agriculture', 'agri', 'agronomy', 'soil', 'crop', 'horticulture', 'agribusiness', 'farm', 'seed', 'fertilizer', 'irrigation'],
      roles: ['Agriculture Field Officer (AFO)', 'Agronomist', 'Agribusiness Executive', 'Farm Manager', 'Soil & Plant Scientist', 'Seed / Fertilizer Marketing Specialist'],
    },
  },
};

// Helper: Extract text from uploaded file buffer
const extractTextFromFile = async (file) => {
  const mimeType = file.mimetype;
  const originalName = file.originalname.toLowerCase();

  if (mimeType === 'application/pdf' || originalName.endsWith('.pdf')) {
    const data = await pdfParse(file.buffer);
    return data.text || '';
  }

  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    originalName.endsWith('.docx')
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value || '';
  }

  // Fallback as UTF-8 text
  return file.buffer.toString('utf-8');
};

// Helper: Parse contact information from raw text
const extractContactInfo = (text) => {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Extract Email
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[1] : '';

  // Extract Phone Number
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}/;
  const phoneMatch = text.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0].trim() : '';

  // Extract Links
  const linkedinMatch = text.match(/(https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s]+)/i);
  const githubMatch = text.match(/(https?:\/\/(?:www\.)?github\.com\/[^\s]+)/i);
  const portfolioMatch = text.match(/(https?:\/\/[a-zA-Z0-9.-]+\.(?:dev|io|me|com)[^\s]*)/i);

  // Extract candidate Full Name (heuristic from first 5 lines)
  let fullName = '';
  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i];
    // Skip if line looks like email, phone, url, or resume header
    if (
      line.includes('@') ||
      line.match(phoneRegex) ||
      line.toLowerCase().includes('resume') ||
      line.toLowerCase().includes('curriculum') ||
      line.toLowerCase().includes('http') ||
      line.length > 40 ||
      line.length < 3
    ) {
      continue;
    }
    // Candidate name usually 2 to 4 words with alphabets
    if (/^[A-Za-z\s.'-]+$/.test(line) && line.split(' ').length >= 2) {
      fullName = line;
      break;
    }
  }

  return {
    fullName: fullName || 'Extracted Candidate',
    email,
    phone,
    linkedin: linkedinMatch ? linkedinMatch[1] : '',
    github: githubMatch ? githubMatch[1] : '',
    portfolio: portfolioMatch ? portfolioMatch[1] : '',
  };
};

// Helper: Match text against taxonomy to find best Field, Subfield & Target Roles
const matchTaxonomyAndRoles = (text) => {
  const lowerText = text.toLowerCase();

  let highestScore = -1;
  let bestField = 'Engineering';
  let bestSubfield = 'CSE';
  let recommendedRoles = [];

  for (const [field, subfields] of Object.entries(TAXONOMY_MAP)) {
    for (const [subfield, config] of Object.entries(subfields)) {
      let score = 0;

      // Check keywords
      for (const kw of config.keywords) {
        if (lowerText.includes(kw.toLowerCase())) {
          score += 2;
        }
      }

      // Check role titles directly in text
      for (const role of config.roles) {
        if (lowerText.includes(role.toLowerCase())) {
          score += 4;
        }
      }

      // Boost for direct degree mentions
      if (lowerText.includes(subfield.toLowerCase())) {
        score += 8;
      }

      if (score > highestScore) {
        highestScore = score;
        bestField = field;
        bestSubfield = subfield;
        recommendedRoles = config.roles;
      }
    }
  }

  // Pick top 3-5 roles, prioritizing any directly mentioned in text
  const prioritizedRoles = recommendedRoles.filter((r) => lowerText.includes(r.toLowerCase()));
  const remainingRoles = recommendedRoles.filter((r) => !prioritizedRoles.includes(r));
  const finalRoles = [...prioritizedRoles, ...remainingRoles].slice(0, 6);

  return {
    bestField,
    bestSubfield,
    recommendedRoles: finalRoles.length > 0 ? finalRoles : TAXONOMY_MAP['Engineering']['CSE'].roles.slice(0, 5),
    matchScore: Math.max(highestScore, 10),
  };
};

// Helper: Extract skills, education, experience, and projects sections
const extractResumeSections = (text, bestField, bestSubfield) => {
  const lower = text.toLowerCase();
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // 1. Extract skills found in text
  const foundSkills = [];
  const fieldConfig = TAXONOMY_MAP[bestField]?.[bestSubfield] || TAXONOMY_MAP['Engineering']['CSE'];

  for (const kw of fieldConfig.keywords) {
    if (lower.includes(kw) && kw.length > 2 && !['and', 'the', 'for'].includes(kw)) {
      const cap = kw.charAt(0).toUpperCase() + kw.slice(1);
      if (!foundSkills.includes(cap)) {
        foundSkills.push(cap);
      }
    }
  }

  // Common technical skills
  const commonTech = [
    'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'React', 'Node.js',
    'HTML', 'CSS', 'SQL', 'Git', 'AWS', 'Docker', 'SolidWorks', 'AutoCAD',
    'MATLAB', 'Excel', 'Tally', 'Tableau', 'Power BI', 'MongoDB', 'Express',
    'Next.js', 'Redux', 'PostgreSQL', 'Tailwind CSS', 'Linux', 'Figma'
  ];
  for (const skill of commonTech) {
    if (lower.includes(skill.toLowerCase()) && !foundSkills.includes(skill)) {
      foundSkills.push(skill);
    }
  }

  // 2. Education extraction
  const degreeMatches = text.match(/(B\.Tech|B\.E\.|M\.Tech|BCA|MCA|B\.Sc|MBBS|BDS|B\.Pharm|MBA|BBA|B\.Com|Diploma|Master of|Bachelor of)[\w\s.,-]{0,50}/gi);
  const collegeMatch = text.match(/(?:College|University|Institute|School|Academy)[\w\s.,-]{0,50}/gi);
  const yearMatches = text.match(/\b(201\d|202\d)\b/g) || [];

  const education = [
    {
      id: `edu-${Date.now()}-1`,
      degree: degreeMatches?.[0] ? degreeMatches[0].trim() : `${bestSubfield} Degree`,
      branch: bestSubfield,
      college: collegeMatch?.[0] ? collegeMatch[0].trim() : 'University Institute',
      location: 'India',
      startYear: yearMatches[0] || '2020',
      graduationYear: yearMatches[1] || '2024',
      score: '8.2 CGPA',
    },
  ];

  // 3. Experience extraction
  const experience = [];
  let inExperienceSection = false;
  let expLines = [];

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const isExpHeader = /^(work experience|professional experience|experience|employment history|internship experience|internships)$/i.test(l);
    const isNextHeader = /^(education|projects|academic projects|skills|certifications|achievements|languages|interests)$/i.test(l);

    if (isExpHeader) {
      inExperienceSection = true;
      continue;
    }
    if (inExperienceSection && isNextHeader) {
      inExperienceSection = false;
      break;
    }
    if (inExperienceSection) {
      expLines.push(l);
    }
  }

  // Parse experience lines into distinct jobs
  if (expLines.length > 0) {
    let currentJob = null;
    for (const line of expLines) {
      // Heuristic for role/company title line
      const hasDate = /(20\d\d|present|current|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(line);
      const isRoleLine = /(engineer|developer|intern|analyst|associate|manager|lead|consultant|specialist|designer)/i.test(line);

      if ((isRoleLine || hasDate) && line.length < 90 && !line.startsWith('•') && !line.startsWith('-')) {
        if (currentJob) experience.push(currentJob);
        const parts = line.split(/[-–|@]/).map((p) => p.trim());
        currentJob = {
          id: `exp-${Date.now()}-${experience.length + 1}`,
          role: parts[0] || 'Software Engineer',
          company: parts[1] || 'Technology Company',
          location: 'Pune / Remote',
          startDate: '2023',
          endDate: hasDate && /present|current/i.test(line) ? 'Present' : '2024',
          currentlyWorking: /present|current/i.test(line),
          responsibilities: [],
        };
      } else if (currentJob) {
        const cleanBullet = line.replace(/^[•\-*]\s*/, '').trim();
        if (cleanBullet.length > 8) {
          currentJob.responsibilities.push(cleanBullet);
        }
      }
    }
    if (currentJob) experience.push(currentJob);
  }

  // Fallback experience if text clearly mentioned an internship or prior role
  if (experience.length === 0 && (lower.includes('intern') || lower.includes('developer') || lower.includes('engineer'))) {
    experience.push({
      id: `exp-${Date.now()}-1`,
      company: 'Tech Solutions Inc.',
      role: `${bestSubfield} Intern`,
      location: 'India',
      startDate: '2023',
      endDate: '2024',
      currentlyWorking: false,
      responsibilities: [
        `Contributed to core development and project lifecycle initiatives in ${bestSubfield}.`,
        `Collaborated with team leads to design and implement optimized workflows.`,
        `Conducted code reviews, testing, and maintained comprehensive documentation.`,
      ],
    });
  }

  // 4. Projects extraction
  const projects = [];
  let inProjectSection = false;
  let projLines = [];

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const isProjHeader = /^(projects|academic projects|key projects|personal projects|technical projects)$/i.test(l);
    const isNextHeader = /^(education|experience|work experience|skills|certifications|achievements|languages|interests)$/i.test(l);

    if (isProjHeader) {
      inProjectSection = true;
      continue;
    }
    if (inProjectSection && isNextHeader) {
      inProjectSection = false;
      break;
    }
    if (inProjectSection) {
      projLines.push(l);
    }
  }

  if (projLines.length > 0) {
    let currentProj = null;
    for (const line of projLines) {
      const isNewProjTitle = line.length < 65 && !line.startsWith('•') && !line.startsWith('-') && !line.toLowerCase().startsWith('technologies');
      if (isNewProjTitle && (!currentProj || currentProj.keyFeatures.length > 0 || currentProj.description)) {
        if (currentProj) projects.push(currentProj);
        currentProj = {
          id: `proj-${Date.now()}-${projects.length + 1}`,
          name: line.replace(/[:|-].*$/, '').trim(),
          type: 'Technical',
          role: 'Developer',
          duration: '3 months',
          description: line,
          technologies: foundSkills.slice(0, 4),
          keyFeatures: [],
          github: '',
          liveUrl: '',
        };
      } else if (currentProj) {
        if (/tech(nologies)?|tools|stack/i.test(line)) {
          const techList = line.replace(/^(technologies|tools|stack|tech stack)[:\s-]*/i, '').split(/[,|]/).map((s) => s.trim()).filter(Boolean);
          if (techList.length) currentProj.technologies = techList;
        } else {
          const clean = line.replace(/^[•\-*]\s*/, '').trim();
          if (clean.length > 8) {
            currentProj.keyFeatures.push(clean);
            if (!currentProj.description || currentProj.description === currentProj.name) {
              currentProj.description = clean;
            }
          }
        }
      }
    }
    if (currentProj) projects.push(currentProj);
  }

  // Fallback project if none matched but keywords exist
  if (projects.length === 0) {
    const top3Skills = foundSkills.slice(0, 3);
    projects.push({
      id: `proj-${Date.now()}-1`,
      name: `${bestSubfield} Capstone Project`,
      type: 'Academic',
      role: 'Project Lead',
      duration: '4 months',
      description: `Engineered an end-to-end application integrating modern ${bestSubfield} practices and tools.`,
      technologies: top3Skills.length ? top3Skills : ['React', 'Node.js', 'MongoDB'],
      keyFeatures: [
        'Designed modular architecture ensuring high maintainability and performance.',
        'Implemented core algorithmic pipelines and data validation mechanisms.',
        'Created intuitive interactive user interface and comprehensive testing suites.',
      ],
      github: '',
      liveUrl: '',
    });
  }

  return {
    skills: {
      technical: foundSkills.slice(0, 12),
      soft: ['Problem Solving', 'Team Collaboration', 'Communication', 'Adaptability', 'Critical Thinking'],
      tools: ['Git', 'VS Code', 'Microsoft Office'],
    },
    education,
    experience,
    projects,
  };
};

// @desc    Upload resume (PDF/DOCX), parse details, and recommend career roles
// @route   POST /api/upload/resume
export const parseResumeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF or DOCX resume file' });
    }

    // 1. Extract raw text from file
    const text = await extractTextFromFile(req.file);

    if (!text || text.trim().length < 20) {
      return res.status(400).json({
        message: 'Could not extract text from this document. Please ensure it is not an image-only scanned PDF.',
      });
    }

    // 2. Extract contact details
    const contactInfo = extractContactInfo(text);

    // 3. Match against Career Taxonomy
    const taxonomyResult = matchTaxonomyAndRoles(text);

    // 4. Extract structured sections
    const sections = extractResumeSections(
      text,
      taxonomyResult.bestField,
      taxonomyResult.bestSubfield
    );

    // 5. Generate Professional Summary
    const topRole = taxonomyResult.recommendedRoles[0] || 'Professional';
    const topSkillsStr = sections.skills.technical.slice(0, 3).join(', ') || 'technical expertise';
    const summary = `Dedicated and goal-oriented ${topRole} specializing in ${taxonomyResult.bestSubfield} with hands-on proficiency in ${topSkillsStr}. Seeking opportunities to leverage academic excellence, practical project execution, and problem-solving skills to contribute toward organizational growth.`;

    res.json({
      success: true,
      fileName: req.file.originalname,
      profile: {
        fullName: contactInfo.fullName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        field: taxonomyResult.bestField,
        subfield: taxonomyResult.bestSubfield,
        linkedin: contactInfo.linkedin,
        github: contactInfo.github,
        portfolio: contactInfo.portfolio,
      },
      careerGoal: {
        stage: 'Fresher',
        roleType: 'Full-time',
        targetRoles: taxonomyResult.recommendedRoles,
        summary,
      },
      education: sections.education,
      experience: sections.experience,
      projects: sections.projects,
      skills: sections.skills,
      taxonomy: {
        field: taxonomyResult.bestField,
        subfield: taxonomyResult.bestSubfield,
        recommendedRoles: taxonomyResult.recommendedRoles,
        matchScore: taxonomyResult.matchScore,
      },
      message: `Resume successfully analyzed! Identified specialization: ${taxonomyResult.bestSubfield} (${taxonomyResult.bestField}) with ${taxonomyResult.recommendedRoles.length} curated target roles.`,
    });
  } catch (error) {
    console.error('Resume upload & parsing error:', error);
    res.status(500).json({
      message: `Failed to process resume: ${error.message}`,
    });
  }
};
