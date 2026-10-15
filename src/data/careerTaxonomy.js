// ─────────────────────────────────────────────────────────────────────────────
//  ELEVORA — Unified Career Taxonomy
//  Single source of truth for fields, sub-fields, and target roles.
//  All pages, forms, AI services, and resume components must import from here.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * careerTaxonomy
 * Structure: { fieldLabel: { label, emoji, subfields: { subfieldLabel: string[] } } }
 */
export const careerTaxonomy = {
  'Engineering': {
    label: 'Engineering',
    emoji: '💻',
    subfields: {
      'CSE': [
        'Software Developer',
        'Frontend Developer',
        'Backend Developer',
        'Full-Stack Developer',
        'Software Test Engineer',
        'AI/ML Engineer',
        'Data Analyst',
        'Cybersecurity Analyst',
      ],
      'IT': [
        'IT Support Engineer',
        'System Administrator',
        'Network Engineer',
        'Cloud Support Engineer',
        'Database Administrator',
        'IT Business Analyst',
        'DevOps Engineer',
        'Cybersecurity Analyst',
      ],
      'E&TC': [
        'Electronics Design Engineer',
        'Embedded Systems Engineer',
        'VLSI Design Engineer',
        'Telecommunications Engineer',
        'IoT Engineer',
        'RF Engineer',
        'Signal Processing Engineer',
        'Hardware Testing Engineer',
      ],
      'Mechanical': [
        'Mechanical Design Engineer',
        'CAD Engineer',
        'Manufacturing Engineer',
        'Production Engineer',
        'Quality Engineer',
        'Automotive Engineer',
        'Thermal Engineer',
        'Maintenance Engineer',
      ],
      'Civil': [
        'Civil Site Engineer',
        'Structural Engineer',
        'Construction Project Engineer',
        'Quantity Surveyor',
        'Planning Engineer',
        'Geotechnical Engineer',
        'Transportation Engineer',
        'Quality Control Engineer',
      ],
      'Electrical': [
        'Electrical Design Engineer',
        'Power Systems Engineer',
        'Control Systems Engineer',
        'Electrical Maintenance Engineer',
        'Automation Engineer',
        'PLC/SCADA Engineer',
        'Renewable Energy Engineer',
        'Protection and Control Engineer',
      ],
    },
  },

  'Medical & Healthcare': {
    label: 'Medical & Healthcare',
    emoji: '🩺',
    subfields: {
      'MBBS': [
        'Medical Officer',
        'Junior Resident',
        'Clinical Research Associate',
        'Medical Writer',
        'Public Health Associate',
        'Clinical Data Management Associate',
        'Healthcare Quality Executive',
      ],
      'BDS': [
        'Dental Clinical Associate',
        'Dental Research Associate',
        'Dental Public Health Associate',
        'Clinical Research Associate',
        'Medical Writer',
        'Dental Practice Coordinator',
      ],
      'B.Pharm': [
        'Pharmacovigilance Associate',
        'Drug Safety Associate',
        'Regulatory Affairs Associate',
        'Pharmaceutical Quality Assurance Associate',
        'Quality Control Analyst',
        'Clinical Research Associate',
        'Medical Representative',
      ],
      'B.Sc Nursing': [
        'Clinical Nurse',
        'ICU Nurse',
        'Emergency Care Nurse',
        'Community Health Nurse',
        'Nursing Research Assistant',
        'Clinical Research Coordinator',
        'Nursing Quality Coordinator',
      ],
    },
  },

  'Commerce & Management': {
    label: 'Commerce & Management',
    emoji: '💼',
    subfields: {
      'B.Com': [
        'Accounts Executive',
        'Accountant',
        'Financial Analyst',
        'Tax Associate',
        'Audit Associate',
        'Banking Associate',
        'Accounts Receivable Executive',
        'Business Analyst',
      ],
      'CA': [
        'Audit Associate',
        'Tax Consultant',
        'Financial Reporting Analyst',
        'Financial Analyst',
        'Internal Audit Associate',
        'Risk Advisory Associate',
        'Finance Manager',
      ],
      'BBA': [
        'Management Trainee',
        'Business Development Executive',
        'Marketing Executive',
        'Sales Executive',
        'HR Executive',
        'Operations Executive',
        'Business Analyst',
        'Customer Success Associate',
      ],
      'MBA': [
        'Business Analyst',
        'Management Consultant',
        'Marketing Manager',
        'Finance Manager',
        'HR Manager',
        'Operations Manager',
        'Product Manager',
        'Business Development Manager',
      ],
      'CS (Company Secretary)': [
        'Company Secretary Trainee',
        'Corporate Compliance Associate',
        'Secretarial Executive',
        'Corporate Governance Associate',
        'Legal Compliance Associate',
        'Company Law Executive',
        'Regulatory Compliance Analyst',
        'Corporate Affairs Executive',
      ],
    },
  },

  'Science & Technology': {
    label: 'Science & Technology',
    emoji: '🔬',
    subfields: {
      'B.Sc Computer Science': [
        'Software Developer Trainee',
        'Junior Programmer',
        'QA/Test Engineer',
        'Junior Data Analyst',
        'Application Support Analyst',
        'Technical Support Engineer',
        'Web Developer',
        'Database Support Associate',
      ],
      'B.Sc IT': [
        'IT Support Analyst',
        'Network Support Engineer',
        'System Support Analyst',
        'Web Developer',
        'Application Support Analyst',
        'Junior Database Administrator',
        'Cloud Support Associate',
        'IT Operations Analyst',
      ],
      'BCA': [
        'Software Developer',
        'Web Developer',
        'Frontend Developer',
        'Backend Developer',
        'QA/Test Engineer',
        'Application Support Engineer',
        'Junior Database Developer',
        'Technical Support Engineer',
      ],
      'MCA': [
        'Software Engineer',
        'Full-Stack Developer',
        'Backend Developer',
        'Application Developer',
        'Cloud Engineer',
        'DevOps Engineer',
        'Data Engineer',
        'Software Test Automation Engineer',
      ],
      'B.Sc Agriculture': [
        'Agricultural Field Officer',
        'Agronomist Trainee',
        'Agriculture Research Assistant',
        'Soil Testing Analyst',
        'Seed Production Associate',
        'Agricultural Quality Executive',
        'Agri-Business Executive',
        'Precision Agriculture Associate',
      ],
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  Derived helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Ordered list of main field labels */
export const MAIN_FIELDS = Object.keys(careerTaxonomy);

/** Returns the field config object (or null) */
export const getFieldConfig = (field) => careerTaxonomy[field] || null;

/** Returns subfield keys for a given main field */
export const getSubfields = (field) => {
  const cfg = careerTaxonomy[field];
  return cfg ? Object.keys(cfg.subfields) : [];
};

/** Returns roles array for a field + subfield combo */
export const getRoles = (field, subfield) => {
  const cfg = careerTaxonomy[field];
  if (!cfg) return ['Other'];
  return cfg.subfields[subfield] || cfg.subfields[Object.keys(cfg.subfields)[0]] || ['Other'];
};

/** Display label including emoji */
export const getFieldDisplayLabel = (field) => {
  const cfg = careerTaxonomy[field];
  if (!cfg) return field;
  return `${cfg.emoji} ${cfg.label}`;
};

// ─────────────────────────────────────────────────────────────────────────────
//  Legacy value migration map
//  Maps old stored field/subfield strings → { field, subfield } in new taxonomy
// ─────────────────────────────────────────────────────────────────────────────
export const LEGACY_FIELD_MAP = {
  // field-level
  'Computer Engineering': { field: 'Engineering', subfield: 'CSE' },
  'Computer Science & IT': { field: 'Engineering', subfield: 'CSE' },
  'Information Technology': { field: 'Engineering', subfield: 'IT' },
  'Mechanical Engineering': { field: 'Engineering', subfield: 'Mechanical' },
  'Electrical Engineering': { field: 'Engineering', subfield: 'Electrical' },
  'Civil Engineering': { field: 'Engineering', subfield: 'Civil' },
  'Electronics & Communication': { field: 'Engineering', subfield: 'E&TC' },
  'Healthcare & Science': { field: 'Medical & Healthcare', subfield: 'MBBS' },
  'Healthcare & Medical': { field: 'Medical & Healthcare', subfield: 'MBBS' },
  'Business & Management': { field: 'Commerce & Management', subfield: 'MBA' },
  'Finance & Accounting': { field: 'Commerce & Management', subfield: 'B.Com' },
  'Science & Research': { field: 'Science & Technology', subfield: 'B.Sc Computer Science' },
};

// Subfield legacy migration (used together with field)
export const LEGACY_SUBFIELD_MAP = {
  'Mechanical Engineering': 'Mechanical',
  'Civil Engineering': 'Civil',
  'Electrical Engineering': 'Electrical',
  'Computer Engineering': 'CSE',
  'Software Development': 'CSE',
  'Data Science & AI': 'CSE',
  'DevOps & Cloud': 'IT',
  'Cybersecurity': 'CSE',
  'Electronics & Communication': 'E&TC',
  'Aerospace Engineering': 'Mechanical',
  'Chemical Engineering': 'Mechanical',
  'Biotechnology': 'B.Sc Agriculture',
  'Clinical Research': 'B.Pharm',
  'Pharmacy': 'B.Pharm',
  'MBBS / Medicine': 'MBBS',
  'Nursing': 'B.Sc Nursing',
  'Dentistry': 'BDS',
  'Product Management': 'MBA',
  'Marketing & Sales': 'BBA',
  'Operations': 'BBA',
  'Human Resources': 'BBA',
  'Financial Analysis': 'B.Com',
  'Auditing': 'CA',
  'Accounting': 'B.Com',
};

/**
 * Normalizes a legacy or new field+subfield pair to the new taxonomy.
 * Returns { field, subfield } guaranteed to exist in careerTaxonomy.
 * Falls back to Engineering/CSE if nothing maps.
 */
export const normalizeLegacyProfile = (rawField = '', rawSubfield = '') => {
  // 1. Already valid in new taxonomy — return as-is
  if (careerTaxonomy[rawField]?.subfields?.[rawSubfield]) {
    return { field: rawField, subfield: rawSubfield };
  }

  // 2. Try migrating rawField via LEGACY_FIELD_MAP
  if (LEGACY_FIELD_MAP[rawField]) {
    const mapped = LEGACY_FIELD_MAP[rawField];
    // If the subfield also needs mapping, try that too
    const resolvedSubfield =
      LEGACY_SUBFIELD_MAP[rawSubfield] && careerTaxonomy[mapped.field]?.subfields?.[LEGACY_SUBFIELD_MAP[rawSubfield]]
        ? LEGACY_SUBFIELD_MAP[rawSubfield]
        : mapped.subfield;
    return { field: mapped.field, subfield: resolvedSubfield };
  }

  // 3. rawField is valid but subfield needs migration
  if (careerTaxonomy[rawField]) {
    const mappedSub = LEGACY_SUBFIELD_MAP[rawSubfield];
    if (mappedSub && careerTaxonomy[rawField].subfields[mappedSub]) {
      return { field: rawField, subfield: mappedSub };
    }
    // Fall back to first subfield of the valid field
    return { field: rawField, subfield: getSubfields(rawField)[0] };
  }

  // 4. Hard fallback
  return { field: 'Engineering', subfield: 'CSE' };
};
