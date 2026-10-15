import { getRoles, normalizeLegacyProfile } from './careerTaxonomy';

export const initialProfile = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 98765 43210',
  field: 'Engineering',
  subfield: 'Mechanical',
  location: 'Pune, Maharashtra',
  linkedin: 'https://linkedin.com/in/johndoe',
  portfolio: 'https://johndoe.dev',
  github: 'https://github.com/johndoe',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
};

export const initialCareerGoal = {
  stage: 'Fresher', // 'Student' | 'Fresher' | 'Intern' | 'Experienced'
  roleType: 'Full-time', // 'Full-time' | 'Internship' | 'Both'
  targetRoles: [
    'Mechanical Design Engineer',
    'CAD Engineer',
    'Manufacturing Engineer'
  ],
  summary: 'Seeking a challenging role in Mechanical Engineering to apply my technical skills, 3D CAD modeling expertise, and contribute to innovative engineering solutions.'
};

export const initialEducation = [
  {
    id: 'edu-1',
    degree: 'B.Tech / B.E.',
    branch: 'Mechanical Engineering',
    college: 'ABC College of Engineering',
    location: 'Pune, Maharashtra',
    startYear: '2020',
    graduationYear: '2024',
    score: '8.5 CGPA'
  }
];

export const initialProjects = [
  {
    id: 'proj-1',
    name: 'Smart Inspection System',
    type: 'Academic',
    description: 'Developed a machine vision-based system to detect defects in mechanical parts using OpenCV and Python.',
    technologies: ['Python', 'OpenCV', 'MATLAB'],
    role: 'Team Lead',
    duration: '3 months',
    keyFeatures: [
      'Real-time defect detection with 92% accuracy',
      'Automated reporting and alerting dashboard',
      'Integrated CAD component verification'
    ],
    github: 'https://github.com/johndoe/smart-inspection',
    liveUrl: 'https://smart-inspection-demo.vercel.app',
    link: 'https://github.com/johndoe/smart-inspection'
  },
  {
    id: 'proj-2',
    name: 'Electric Go-Kart Chassis Design',
    type: 'Design',
    description: 'Designed and FEA-simulated a lightweight tubular space-frame chassis for an electric racing vehicle.',
    technologies: ['SolidWorks', 'ANSYS', 'SimScale'],
    role: 'Chassis Designer',
    duration: '5 months',
    keyFeatures: [
      'Reduced total chassis weight by 18% while maintaining torsional rigidity',
      'Conducted stress and crash safety analysis according to SAE standards'
    ],
    github: 'https://github.com/johndoe/go-kart-chassis',
    liveUrl: '',
    link: ''
  }
];

export const initialExperience = [
  {
    id: 'exp-1',
    company: 'Tata Technologies',
    role: 'Mechanical Design Intern',
    location: 'Pune, Maharashtra',
    startDate: 'May 2023',
    endDate: 'Jul 2023',
    currentlyWorking: false,
    responsibilities: [
      'Assisted in designing mechanical components and enclosures using SolidWorks.',
      'Worked on CAD modelling, geometric tolerancing (GD&T), and 3D simulations.',
      'Collaborated with senior engineers on structural verification and project documentation.'
    ]
  }
];

export const initialSkills = {
  technical: ['SolidWorks', 'AutoCAD', 'ANSYS', 'MATLAB', 'Microsoft Office', 'Python'],
  soft: ['Problem Solving', 'Communication', 'Teamwork', 'Time Management', 'Leadership'],
  languages: [
    { name: 'English', proficiency: 'Fluent' },
    { name: 'Hindi', proficiency: 'Fluent' },
    { name: 'Marathi', proficiency: 'Native' }
  ]
};

export const initialCertifications = [
  {
    id: 'cert-1',
    name: 'SolidWorks Professional (CSWP)',
    issuer: 'Dassault Systèmes',
    date: 'Jan 2023',
    credentialId: 'C-987124',
    link: 'https://www.solidworks.com/certifications/cswp'
  },
  {
    id: 'cert-2',
    name: 'AutoCAD Certified User',
    issuer: 'Autodesk',
    date: 'Aug 2022',
    credentialId: 'ACU-55219',
    link: 'https://www.autodesk.com/certification'
  }
];

export const initialAchievements = [
  {
    id: 'ach-1',
    title: '3rd Rank in National Level Design Competition',
    description: 'IIT Bombay Techfest',
    year: '2023'
  },
  {
    id: 'ach-2',
    title: 'Best Final Year Capstone Project Nominee',
    description: 'Department of Mechanical Engineering',
    year: '2024'
  }
];

export const initialSavedResumes = [
  {
    id: 'res-1',
    name: 'Mechanical Design Engineer Resume',
    targetRole: 'Mechanical Design Engineer',
    field: 'Engineering',
    subfield: 'Mechanical',
    template: 'modern',
    lastUpdated: 'Just now',
    atsScore: 92,
    keywordMatch: 88,
    suggestions: 2
  },
  {
    id: 'res-2',
    name: 'CAD & Simulation Specialist Resume',
    targetRole: 'CAD Engineer',
    field: 'Engineering',
    subfield: 'Mechanical',
    template: 'classic',
    lastUpdated: '2 days ago',
    atsScore: 89,
    keywordMatch: 84,
    suggestions: 3
  },
  {
    id: 'res-3',
    name: 'Manufacturing Engineer Resume',
    targetRole: 'Manufacturing Engineer',
    field: 'Engineering',
    subfield: 'Mechanical',
    template: 'executive',
    lastUpdated: '1 week ago',
    atsScore: 95,
    keywordMatch: 92,
    suggestions: 1
  }
];

// Legacy export kept for backwards-compat
export const targetRolesList = [
  'Mechanical Design Engineer',
  'Production Engineer',
  'Quality Engineer',
  'CAD Engineer',
  'R&D Engineer',
  'Project Engineer',
  'Maintenance Engineer',
  'Automotive Engineer',
  'Manufacturing Engineer',
  'Process Engineer',
  'Robotics Engineer',
  'Other'
];

// ─────────────────────────────────────────────────────────────
//  COMPREHENSIVE DYNAMIC ROLES MAP
//  Structure: field → subfield → string[]
//  Falls back to field-level roles if subfield not found.
// ─────────────────────────────────────────────────────────────
export const rolesByField = {

  // ── ENGINEERING ──────────────────────────────────────────────
  'Engineering': {
    '_default': [
      'Design Engineer', 'Project Engineer', 'Quality Engineer',
      'R&D Engineer', 'Maintenance Engineer', 'Production Engineer',
      'Process Engineer', 'Safety Engineer', 'Test Engineer', 'Other'
    ],
    'Mechanical Engineering': [
      'Mechanical Design Engineer', 'Product Design Engineer', 'CAD Engineer',
      'R&D Engineer', 'Production Engineer', 'Quality Engineer',
      'Automotive Engineer', 'Manufacturing Engineer', 'Thermal Engineer',
      'Robotics Engineer', 'Maintenance Engineer', 'Process Engineer',
      'Simulation/FEA Engineer', 'Tool & Die Engineer', 'Other'
    ],
    'Civil Engineering': [
      'Structural Engineer', 'Site Engineer', 'Project Manager – Construction',
      'Geotechnical Engineer', 'Transportation Engineer', 'Environmental Engineer',
      'Highway Engineer', 'Urban Planner', 'Quantity Surveyor',
      'Water Resources Engineer', 'Construction Manager', 'Other'
    ],
    'Electrical Engineering': [
      'Electrical Design Engineer', 'Power Systems Engineer', 'Control Systems Engineer',
      'Instrumentation Engineer', 'Embedded Systems Engineer', 'PCB Design Engineer',
      'Automation Engineer', 'Electrical Project Engineer', 'High Voltage Engineer',
      'Protection & Relay Engineer', 'Renewable Energy Engineer', 'Other'
    ],
    'Electronics & Communication': [
      'Electronics Design Engineer', 'VLSI Design Engineer', 'RF Engineer',
      'Embedded Systems Engineer', 'Signal Processing Engineer', 'IoT Engineer',
      'Telecom Engineer', 'Hardware Engineer', 'Firmware Developer', 'Other'
    ],
    'Aerospace Engineering': [
      'Aerospace Design Engineer', 'Propulsion Engineer', 'Avionics Engineer',
      'Structures Engineer', 'Flight Test Engineer', 'Systems Engineer',
      'Mission Planning Engineer', 'Spacecraft Engineer', 'CFD Engineer', 'Other'
    ],
    'Chemical Engineering': [
      'Process Engineer', 'Chemical Process Designer', 'Plant Engineer',
      'Quality Control Chemist', 'Environmental Engineer', 'Petroleum Engineer',
      'Polymer Engineer', 'Safety Engineer', 'R&D Chemist', 'Other'
    ],
    'Computer Engineering': [
      'Software Engineer', 'Embedded Software Engineer', 'Hardware Engineer',
      'Systems Architect', 'FPGA Engineer', 'Computer Vision Engineer',
      'IoT Developer', 'Firmware Engineer', 'Full Stack Developer',
      'Machine Learning Engineer', 'Other'
    ],
    'Biomedical Engineering': [
      'Biomedical Engineer', 'Medical Device Design Engineer', 'Clinical Engineer',
      'Biomechanics Researcher', 'Regulatory Affairs Specialist',
      'Healthcare IT Engineer', 'R&D Engineer – Medical Devices', 'Other'
    ],
    'Environmental Engineering': [
      'Environmental Engineer', 'Water Treatment Engineer', 'Waste Management Engineer',
      'Air Quality Engineer', 'Sustainability Consultant', 'Environmental Consultant',
      'EHS Manager', 'Climate Policy Analyst', 'Other'
    ],
    'Industrial Engineering': [
      'Industrial Engineer', 'Lean Manufacturing Engineer', 'Operations Research Analyst',
      'Supply Chain Engineer', 'Process Improvement Engineer', 'Plant Layout Engineer',
      'Six Sigma Specialist', 'Manufacturing Planner', 'Other'
    ],
  },

  // ── COMPUTER SCIENCE & IT ─────────────────────────────────────
  'Computer Science & IT': {
    '_default': [
      'Software Developer', 'Backend Developer', 'Frontend Developer',
      'Full Stack Developer', 'DevOps Engineer', 'QA Engineer',
      'IT Support Engineer', 'Systems Analyst', 'Other'
    ],
    'Software Development': [
      'Software Engineer', 'Full Stack Developer', 'Backend Developer',
      'Frontend Developer', 'Mobile App Developer (Android/iOS)',
      'React Developer', 'Node.js Developer', 'Python Developer',
      'Java Developer', 'Game Developer', 'API Developer', 'Other'
    ],
    'Data Science & AI': [
      'Data Scientist', 'Machine Learning Engineer', 'AI Researcher',
      'Data Analyst', 'NLP Engineer', 'Computer Vision Engineer',
      'Deep Learning Engineer', 'Business Intelligence Analyst',
      'Data Engineer', 'MLOps Engineer', 'Statistician', 'Other'
    ],
    'DevOps & Cloud': [
      'DevOps Engineer', 'Cloud Engineer (AWS/GCP/Azure)', 'Site Reliability Engineer (SRE)',
      'Platform Engineer', 'Infrastructure Engineer', 'Kubernetes Engineer',
      'CI/CD Engineer', 'Cloud Architect', 'Systems Administrator', 'Other'
    ],
    'Cybersecurity': [
      'Cybersecurity Analyst', 'Penetration Tester (Ethical Hacker)',
      'Security Operations Engineer (SOC)', 'Cloud Security Engineer',
      'Vulnerability Researcher', 'Incident Response Analyst',
      'Identity & Access Management Engineer', 'CISO (Senior)', 'Other'
    ],
    'Database & Backend': [
      'Database Administrator (DBA)', 'Backend Engineer', 'SQL Developer',
      'NoSQL Engineer', 'Data Warehouse Engineer', 'API Developer',
      'Microservices Developer', 'ETL Developer', 'Other'
    ],
    'UI/UX & Frontend': [
      'Frontend Developer', 'UI Developer', 'UX Engineer',
      'React Developer', 'Angular Developer', 'Vue.js Developer',
      'Web Designer', 'Motion Designer', 'Interaction Designer', 'Other'
    ],
    'Networking': [
      'Network Engineer', 'Network Administrator', 'Wireless Engineer',
      'Telecom Network Engineer', 'Network Security Engineer',
      'SD-WAN Engineer', 'VoIP Engineer', 'Other'
    ],
    'IT Management': [
      'IT Project Manager', 'IT Manager', 'CTO', 'IT Consultant',
      'Business Analyst (IT)', 'ERP Consultant', 'IT Governance Analyst', 'Other'
    ],
  },

  // ── HEALTHCARE & MEDICAL ──────────────────────────────────────
  'Healthcare & Medical': {
    '_default': [
      'Healthcare Professional', 'Clinical Researcher', 'Medical Consultant',
      'Hospital Administrator', 'Public Health Officer', 'Other'
    ],
    'MBBS / Medicine': [
      'General Physician', 'Junior Resident Doctor', 'Medical Officer',
      'Emergency Medicine Doctor', 'General Surgeon (PG applicant)',
      'Public Health Doctor', 'Government Medical Officer (PSC/UPSC)',
      'Clinical Research Associate', 'House Surgeon', 'Other'
    ],
    'Surgery': [
      'General Surgeon', 'Neurosurgeon', 'Cardiothoracic Surgeon',
      'Orthopedic Surgeon', 'Laparoscopic Surgeon', 'Plastic Surgeon',
      'Surgical Resident', 'Senior Registrar – Surgery', 'Other'
    ],
    'Nursing': [
      'Staff Nurse', 'ICU Nurse', 'OT Nurse', 'Pediatric Nurse',
      'Oncology Nurse', 'Community Health Nurse', 'Head Nurse',
      'Nursing Educator', 'Travel Nurse', 'Other'
    ],
    'Dentistry': [
      'Dental Surgeon', 'Orthodontist', 'Endodontist', 'Periodontist',
      'Oral & Maxillofacial Surgeon', 'Dental Implantologist',
      'Pediatric Dentist', 'Dental Lecturer', 'Other'
    ],
    'Pharmacy': [
      'Pharmacist', 'Clinical Pharmacist', 'Regulatory Affairs Executive',
      'Medical Sales Representative', 'Drug Safety Associate (Pharmacovigilance)',
      'Quality Assurance Executive – Pharma', 'Hospital Pharmacist', 'Other'
    ],
    'Physiotherapy': [
      'Physiotherapist', 'Sports Physiotherapist', 'Pediatric Physiotherapist',
      'Neurological Physiotherapist', 'Cardiopulmonary Physiotherapist',
      'Occupational Therapist', 'Rehabilitation Specialist', 'Other'
    ],
    'Clinical Research': [
      'Clinical Research Associate (CRA)', 'Clinical Research Coordinator',
      'Drug Safety Associate', 'Regulatory Affairs Specialist',
      'Pharmacovigilance Analyst', 'Medical Writer', 'Biostatistician', 'Other'
    ],
    'Radiology / Imaging': [
      'Radiologist (MD/DNB)', 'Radiographer / X-Ray Technician',
      'CT Scan Technician', 'MRI Technician', 'Ultrasound Technician',
      'Nuclear Medicine Technologist', 'Other'
    ],
    'Public Health': [
      'Public Health Officer', 'Epidemiologist', 'Health Program Manager',
      'Community Health Worker', 'Health Policy Analyst', 'WHO/NGO Health Consultant',
      'Biostatistician', 'Other'
    ],
  },

  // ── BUSINESS & MANAGEMENT ─────────────────────────────────────
  'Business & Management': {
    '_default': [
      'Business Analyst', 'Operations Manager', 'Consultant', 'Project Manager',
      'Strategy Manager', 'Business Development Executive', 'Other'
    ],
    'Product Management': [
      'Product Manager', 'Associate Product Manager (APM)', 'Technical Product Manager',
      'Product Analyst', 'Growth Product Manager', 'Mobile Product Manager',
      'Product Owner (Scrum)', 'Head of Product', 'Other'
    ],
    'Marketing & Sales': [
      'Digital Marketing Manager', 'SEO Specialist', 'Content Marketing Manager',
      'Performance Marketing Analyst', 'Brand Manager', 'Sales Executive',
      'Business Development Manager', 'Account Manager', 'Social Media Manager',
      'Marketing Analyst', 'Growth Hacker', 'Other'
    ],
    'Operations': [
      'Operations Manager', 'Supply Chain Manager', 'Logistics Manager',
      'Procurement Manager', 'Inventory Analyst', 'Process Improvement Manager',
      'Business Operations Analyst', 'Vendor Manager', 'Other'
    ],
    'Human Resources': [
      'HR Executive', 'HR Business Partner (HRBP)', 'Talent Acquisition Specialist',
      'HR Manager', 'Learning & Development Manager', 'Compensation & Benefits Analyst',
      'HR Generalist', 'Organizational Development Consultant', 'Other'
    ],
    'Entrepreneurship / Startup': [
      'Founder / Co-Founder', 'Chief of Staff', 'Strategy & Growth Lead',
      'Business Development Lead', 'Product & Operations Lead',
      'VC Analyst', 'Startup Consultant', 'Other'
    ],
    'Consulting': [
      'Management Consultant', 'Strategy Consultant', 'IT Consultant',
      'Financial Consultant', 'HR Consultant', 'Risk Consultant',
      'Operations Consultant', 'McKinsey/BCG/Bain Analyst Track', 'Other'
    ],
  },

  // ── FINANCE & ACCOUNTING ──────────────────────────────────────
  'Finance & Accounting': {
    '_default': [
      'Financial Analyst', 'Accountant', 'Auditor', 'Finance Manager',
      'Chartered Accountant (CA)', 'Cost Accountant', 'Tax Consultant', 'Other'
    ],
    'Financial Analysis': [
      'Financial Analyst', 'Equity Research Analyst', 'Credit Analyst',
      'Portfolio Manager', 'Risk Analyst', 'Corporate Finance Analyst',
      'FP&A Analyst (Financial Planning & Analysis)', 'Other'
    ],
    'Investment Banking': [
      'Investment Banking Analyst', 'M&A Analyst', 'Derivatives Trader',
      'Fixed Income Analyst', 'Quantitative Analyst (Quant)', 'Capital Markets Associate',
      'Private Equity Analyst', 'Hedge Fund Analyst', 'Other'
    ],
    'Auditing': [
      'Internal Auditor', 'External Auditor', 'Statutory Auditor (CA)',
      'Risk & Compliance Analyst', 'Forensic Accountant', 'SOX Compliance Analyst',
      'IT Auditor', 'Other'
    ],
    'Taxation': [
      'Tax Consultant', 'GST Consultant', 'Direct Tax Analyst', 'Transfer Pricing Analyst',
      'Tax Manager', 'International Tax Specialist', 'VAT/GST Auditor', 'Other'
    ],
    'Accounting': [
      'Accountant', 'Senior Accountant', 'Management Accountant',
      'Cost Accountant (ICWA/CMA)', 'Accounts Payable/Receivable Executive',
      'Financial Controller', 'Bookkeeper', 'Other'
    ],
    'Banking & FinTech': [
      'Relationship Manager – Banking', 'Credit Risk Analyst', 'Loan Officer',
      'FinTech Product Manager', 'Digital Payments Analyst',
      'Compliance Officer – Banking', 'Treasury Analyst', 'Other'
    ],
  },

  // ── DESIGN & CREATIVE ─────────────────────────────────────────
  'Design & Creative': {
    '_default': [
      'UX/UI Designer', 'Graphic Designer', 'Visual Designer',
      'Creative Director', 'Illustrator', 'Other'
    ],
    'UI/UX Design': [
      'UX Designer', 'UI Designer', 'Product Designer', 'UX Researcher',
      'Interaction Designer', 'Information Architect', 'UX Writer',
      'Design Systems Designer', 'Prototyping Specialist', 'Other'
    ],
    'Graphic Design': [
      'Graphic Designer', 'Brand Identity Designer', 'Packaging Designer',
      'Print Designer', 'Art Director', 'Visual Communication Designer',
      'Publication Designer', 'Typographer', 'Other'
    ],
    'Motion Design': [
      'Motion Graphics Designer', 'Video Editor', '2D/3D Animator',
      'VFX Artist', 'After Effects Specialist', 'Explainer Video Creator',
      'Broadcast Designer', 'Other'
    ],
    'Industrial Design': [
      'Industrial Designer', 'Product Designer – Consumer Goods', 'Furniture Designer',
      'Packaging Designer', 'UX/Ergonomics Researcher', 'Design Researcher',
      'Design Engineer', 'Other'
    ],
    'Fashion Design': [
      'Fashion Designer', 'Apparel Merchandiser', 'Textile Designer',
      'Pattern Maker', 'Fashion Illustrator', 'Costume Designer',
      'Accessories Designer', 'Retail Fashion Buyer', 'Other'
    ],
    'Architecture & Interior': [
      'Architect', 'Interior Designer', 'Landscape Architect',
      'Urban Designer', 'Space Planner', '3D Visualizer (Architectural)',
      'BIM Coordinator', 'Project Architect', 'Other'
    ],
  },

  // ── SCIENCE & RESEARCH ────────────────────────────────────────
  'Science & Research': {
    '_default': [
      'Research Scientist', 'Lab Technician', 'Research Assistant',
      'Science Writer', 'Policy Researcher', 'Other'
    ],
    'Physics': [
      'Research Physicist', 'Computational Physicist', 'Optics Researcher',
      'Materials Scientist', 'Astrophysicist', 'Nuclear Physicist',
      'Laser Scientist', 'Physics Teacher / Lecturer', 'Other'
    ],
    'Chemistry': [
      'Research Chemist', 'Analytical Chemist', 'Organic Chemist',
      'Polymer Scientist', 'Formulation Scientist', 'QC Chemist – Pharma/Food',
      'Environmental Chemist', 'Process Chemist', 'Other'
    ],
    'Biology / Life Sciences': [
      'Microbiologist', 'Molecular Biologist', 'Biochemist',
      'Biotechnologist', 'Ecologist', 'Geneticist',
      'Immunologist', 'Cell Biologist', 'Lab Scientist', 'Other'
    ],
    'Biotechnology': [
      'Biotech Researcher', 'Bioinformatics Analyst', 'Genetic Engineer',
      'Bioprocess Engineer', 'Clinical Trial Scientist', 'Regulatory Affairs – Biotech',
      'Quality Assurance – Biotech', 'Other'
    ],
    'Mathematics / Statistics': [
      'Data Analyst', 'Statistician', 'Quantitative Analyst (Quant)',
      'Actuarial Analyst', 'Research Mathematician', 'Operations Research Analyst',
      'Biostatistician', 'Financial Modeler', 'Other'
    ],
    'Environmental Science': [
      'Environmental Scientist', 'Climate Researcher', 'Marine Biologist',
      'Wildlife Conservationist', 'GIS Analyst', 'Remote Sensing Analyst',
      'Environmental Consultant', 'Sustainability Manager', 'Other'
    ],
  },

  // ── LAW ───────────────────────────────────────────────────────
  'Law': {
    '_default': [
      'Advocate / Lawyer', 'Legal Counsel', 'Legal Researcher',
      'Compliance Officer', 'Paralegal', 'Other'
    ],
    'Corporate Law': [
      'Corporate Lawyer', 'M&A Legal Analyst', 'Company Secretary (CS)',
      'Contract Manager', 'Legal Compliance Manager', 'IPR Attorney', 'Other'
    ],
    'Criminal Law': [
      'Criminal Defense Advocate', 'Public Prosecutor', 'Litigation Associate',
      'Legal Aid Lawyer', 'Forensic Legal Analyst', 'Other'
    ],
    'Constitutional / Civil Law': [
      'Civil Litigation Lawyer', 'Constitutional Advocate',
      'High Court / Supreme Court Clerk', 'Judiciary Aspirant (Judge)',
      'Government Law Officer', 'Legal Researcher – NGO', 'Other'
    ],
    'Intellectual Property': [
      'Patent Attorney / Agent', 'Trademark Attorney', 'IP Analyst',
      'Copyright Lawyer', 'Technology Transfer Specialist', 'Other'
    ],
    'International Law': [
      'International Law Associate', 'Trade Law Analyst', 'Human Rights Lawyer',
      'Diplomat / Foreign Service Officer', 'UN/INGO Legal Consultant', 'Other'
    ],
  },

  // ── ARCHITECTURE ──────────────────────────────────────────────
  'Architecture': {
    '_default': [
      'Architect', 'Urban Planner', 'Interior Designer',
      'Landscape Architect', '3D Visualizer', 'Other'
    ],
    'Urban Planning': [
      'Urban Planner', 'Town Planner', 'GIS Urban Analyst',
      'Smart City Consultant', 'Regional Planner', 'Other'
    ],
    'Interior Design': [
      'Interior Designer', 'Space Planner', 'Furniture Designer',
      'Lighting Designer', 'Exhibition Designer', 'Stage / Set Designer', 'Other'
    ],
    'Landscape Architecture': [
      'Landscape Architect', 'Horticulturist', 'Park Planner',
      'Environmental Landscape Designer', 'Urban Green Infrastructure Planner', 'Other'
    ],
  },

  // ── EDUCATION & TEACHING ──────────────────────────────────────
  'Education & Teaching': {
    '_default': [
      'Teacher', 'Lecturer', 'Curriculum Developer', 'Education Consultant',
      'Academic Coordinator', 'Other'
    ],
    'School Teaching': [
      'Primary / Elementary Teacher', 'High School Subject Teacher',
      'Special Education Teacher', 'School Counselor',
      'International Baccalaureate (IB) Teacher', 'Physical Education Teacher', 'Other'
    ],
    'Higher Education': [
      'Assistant Professor', 'Associate Professor', 'University Lecturer',
      'Research Faculty', 'Academic Advisor', 'Department Coordinator', 'Other'
    ],
    'EdTech': [
      'Curriculum Designer', 'Instructional Designer', 'Learning Experience Designer (LXD)',
      'EdTech Product Manager', 'Online Tutor / Subject Matter Expert',
      'eLearning Developer', 'Learning & Development Specialist', 'Other'
    ],
    'Training & Development': [
      'Corporate Trainer', 'L&D Specialist', 'HR Training Manager',
      'Technical Trainer', 'Soft Skills Trainer', 'Content Developer – Training', 'Other'
    ],
  },

  // ── MEDIA & COMMUNICATIONS ────────────────────────────────────
  'Media & Communications': {
    '_default': [
      'Journalist', 'Content Creator', 'PR Executive', 'Media Analyst',
      'Copywriter', 'Social Media Manager', 'Other'
    ],
    'Journalism': [
      'Reporter / Journalist', 'News Anchor', 'Investigative Journalist',
      'Feature Writer', 'Photo Journalist', 'Video Journalist (VJ)',
      'Digital News Editor', 'Other'
    ],
    'Public Relations': [
      'PR Executive', 'Brand Communications Manager', 'Media Relations Specialist',
      'Corporate Communications Officer', 'Crisis Communications Manager', 'Other'
    ],
    'Advertising': [
      'Copywriter', 'Creative Director', 'Account Manager – Ad Agency',
      'Media Planner', 'Brand Strategist', 'Performance Marketer', 'Other'
    ],
    'Content Creation': [
      'Content Writer', 'Blogger / Vlogger', 'YouTube Creator',
      'Podcast Host', 'Technical Writer', 'Social Media Influencer',
      'UX Content Strategist', 'Other'
    ],
  },

};

// ─────────────────────────────────────────────────────────────────────────────
//  HELPER: getRolesForProfile — thin wrapper around careerTaxonomy
//  Retained for backwards compatibility; all new code should use careerTaxonomy.
// ─────────────────────────────────────────────────────────────────────────────

export const getRolesForProfile = (field = '', subfield = '') => {
  const { field: f, subfield: s } = normalizeLegacyProfile(field, subfield);
  return getRoles(f, s);
};
