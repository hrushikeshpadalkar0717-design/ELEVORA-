// ELEVORA -- Centralized Field / Subfield / Role Data
// Single source of truth used across Auth, Profile, Dashboard, Interview Prep, AI Service

export const FIELD_OPTIONS = ["Engineering", "Computer Science & IT", "Healthcare & Medical", "Business & Management", "Finance & Accounting", "Design & Creative", "Science & Research", "Law", "Architecture", "Education & Teaching", "Media & Communications"];

export const SUBFIELD_MAP = {
  "Engineering": ["Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Electronics & Communication", "Computer Engineering", "Aerospace Engineering", "Chemical Engineering", "Biomedical Engineering", "Environmental Engineering", "Industrial Engineering"],
  "Computer Science & IT": ["Software Development", "Data Science & AI", "DevOps & Cloud", "Cybersecurity", "UI/UX & Frontend", "Database & Backend", "Networking", "IT Management"],
  "Healthcare & Medical": ["MBBS / Medicine", "Surgery", "Nursing", "Dentistry", "Pharmacy", "Physiotherapy", "Clinical Research", "Radiology / Imaging", "Public Health"],
  "Business & Management": ["Product Management", "Marketing & Sales", "Operations", "Human Resources", "Entrepreneurship / Startup", "Consulting"],
  "Finance & Accounting": ["Financial Analysis", "Investment Banking", "Auditing", "Taxation", "Accounting", "Banking & FinTech"],
  "Design & Creative": ["UI/UX Design", "Graphic Design", "Motion Design", "Industrial Design", "Fashion Design", "Architecture & Interior"],
  "Science & Research": ["Physics", "Chemistry", "Biology / Life Sciences", "Biotechnology", "Mathematics / Statistics", "Environmental Science"],
  "Law": ["Corporate Law", "Criminal Law", "Constitutional / Civil Law", "Intellectual Property", "International Law"],
  "Architecture": ["Urban Planning", "Interior Design", "Landscape Architecture", "Building & Construction"],
  "Education & Teaching": ["School Teaching", "Higher Education", "EdTech", "Training & Development"],
  "Media & Communications": ["Journalism", "Public Relations", "Advertising", "Content Creation"],
};

export const ROLES_BY_FIELD = {
  "Engineering": {
    "_default": ["Design Engineer", "Project Engineer", "Quality Engineer", "R&D Engineer", "Maintenance Engineer", "Production Engineer", "Process Engineer", "Safety Engineer", "Test Engineer", "Other"],
    "Mechanical Engineering": ["Mechanical Design Engineer", "Product Design Engineer", "CAD Engineer", "R&D Engineer", "Production Engineer", "Quality Engineer", "Automotive Engineer", "Manufacturing Engineer", "Thermal Engineer", "Robotics Engineer", "Process Engineer", "Simulation/FEA Engineer", "Other"],
    "Civil Engineering": ["Structural Engineer", "Site Engineer", "Project Manager - Construction", "Geotechnical Engineer", "Transportation Engineer", "Environmental Engineer", "Highway Engineer", "Urban Planner", "Quantity Surveyor", "Water Resources Engineer", "Construction Manager", "Other"],
    "Electrical Engineering": ["Electrical Design Engineer", "Power Systems Engineer", "Control Systems Engineer", "Instrumentation Engineer", "Embedded Systems Engineer", "PCB Design Engineer", "Automation Engineer", "High Voltage Engineer", "Renewable Energy Engineer", "Protection & Relay Engineer", "Other"],
    "Electronics & Communication": ["Electronics Design Engineer", "VLSI Design Engineer", "RF Engineer", "Embedded Systems Engineer", "Signal Processing Engineer", "IoT Engineer", "Telecom Engineer", "Hardware Engineer", "Firmware Developer", "Other"],
    "Computer Engineering": ["Software Engineer", "Embedded Software Engineer", "Hardware Engineer", "Systems Architect", "FPGA Engineer", "Computer Vision Engineer", "IoT Developer", "Firmware Engineer", "Full Stack Developer", "Machine Learning Engineer", "Other"],
    "Aerospace Engineering": ["Aerospace Design Engineer", "Propulsion Engineer", "Avionics Engineer", "Structures Engineer", "Flight Test Engineer", "Systems Engineer", "CFD Engineer", "Mission Planning Engineer", "Other"],
    "Chemical Engineering": ["Process Engineer", "Chemical Process Designer", "Plant Engineer", "Quality Control Chemist", "Petroleum Engineer", "Polymer Engineer", "Safety Engineer", "Other"],
    "Biomedical Engineering": ["Biomedical Engineer", "Medical Device Design Engineer", "Clinical Engineer", "Biomechanics Researcher", "Regulatory Affairs Specialist", "Healthcare IT Engineer", "Other"],
    "Environmental Engineering": ["Environmental Engineer", "Water Treatment Engineer", "Waste Management Engineer", "Air Quality Engineer", "Sustainability Consultant", "EHS Manager", "Other"],
    "Industrial Engineering": ["Industrial Engineer", "Lean Manufacturing Engineer", "Operations Research Analyst", "Supply Chain Engineer", "Six Sigma Specialist", "Manufacturing Planner", "Other"],
  },
  "Computer Science & IT": {
    "_default": ["Software Developer", "Backend Developer", "Frontend Developer", "Full Stack Developer", "DevOps Engineer", "QA Engineer", "IT Support Engineer", "Systems Analyst", "Other"],
    "Software Development": ["Software Engineer", "Full Stack Developer", "Backend Developer", "Frontend Developer", "Mobile App Developer (Android/iOS)", "React Developer", "Node.js Developer", "Python Developer", "Java Developer", "Game Developer", "Other"],
    "Data Science & AI": ["Data Scientist", "Machine Learning Engineer", "AI Researcher", "Data Analyst", "NLP Engineer", "Computer Vision Engineer", "Deep Learning Engineer", "Business Intelligence Analyst", "Data Engineer", "MLOps Engineer", "Other"],
    "DevOps & Cloud": ["DevOps Engineer", "Cloud Engineer (AWS/GCP/Azure)", "Site Reliability Engineer (SRE)", "Platform Engineer", "Infrastructure Engineer", "Kubernetes Engineer", "CI/CD Engineer", "Cloud Architect", "Systems Administrator", "Other"],
    "Cybersecurity": ["Cybersecurity Analyst", "Penetration Tester (Ethical Hacker)", "Security Operations Engineer (SOC)", "Cloud Security Engineer", "Vulnerability Researcher", "Incident Response Analyst", "Application Security Engineer", "Other"],
    "Database & Backend": ["Database Administrator (DBA)", "Backend Engineer", "SQL Developer", "NoSQL Engineer", "Data Warehouse Engineer", "API Developer", "Microservices Developer", "ETL Developer", "Other"],
    "UI/UX & Frontend": ["Frontend Developer", "UI Developer", "UX Engineer", "React Developer", "Angular Developer", "Vue.js Developer", "Web Designer", "Motion Designer", "Interaction Designer", "Other"],
    "Networking": ["Network Engineer", "Network Administrator", "Wireless Engineer", "Telecom Network Engineer", "Network Security Engineer", "SD-WAN Engineer", "VoIP Engineer", "Other"],
    "IT Management": ["IT Project Manager", "IT Manager", "CTO", "IT Consultant", "Business Analyst (IT)", "ERP Consultant", "Other"],
  },
  "Healthcare & Medical": {
    "_default": ["Healthcare Professional", "Clinical Researcher", "Medical Consultant", "Hospital Administrator", "Public Health Officer", "Other"],
    "MBBS / Medicine": ["General Physician", "Junior Resident Doctor", "Medical Officer", "Emergency Medicine Doctor", "Public Health Doctor", "Government Medical Officer", "Clinical Research Associate", "House Surgeon", "Other"],
    "Surgery": ["General Surgeon", "Neurosurgeon", "Cardiothoracic Surgeon", "Orthopedic Surgeon", "Laparoscopic Surgeon", "Plastic Surgeon", "Surgical Resident", "Other"],
    "Nursing": ["Staff Nurse", "ICU Nurse", "OT Nurse", "Pediatric Nurse", "Oncology Nurse", "Community Health Nurse", "Head Nurse", "Nursing Educator", "Other"],
    "Dentistry": ["Dental Surgeon", "Orthodontist", "Endodontist", "Periodontist", "Oral & Maxillofacial Surgeon", "Dental Implantologist", "Pediatric Dentist", "Other"],
    "Pharmacy": ["Pharmacist", "Clinical Pharmacist", "Regulatory Affairs Executive", "Medical Sales Representative", "Drug Safety Associate", "QA Executive - Pharma", "Hospital Pharmacist", "Other"],
    "Physiotherapy": ["Physiotherapist", "Sports Physiotherapist", "Pediatric Physiotherapist", "Neurological Physiotherapist", "Occupational Therapist", "Other"],
    "Clinical Research": ["Clinical Research Associate (CRA)", "Clinical Research Coordinator", "Drug Safety Associate", "Regulatory Affairs Specialist", "Pharmacovigilance Analyst", "Medical Writer", "Biostatistician", "Other"],
    "Radiology / Imaging": ["Radiologist (MD/DNB)", "Radiographer / X-Ray Technician", "CT Scan Technician", "MRI Technician", "Ultrasound Technician", "Other"],
    "Public Health": ["Public Health Officer", "Epidemiologist", "Health Program Manager", "Community Health Worker", "Health Policy Analyst", "Biostatistician", "Other"],
  },
  "Business & Management": {
    "_default": ["Business Analyst", "Operations Manager", "Consultant", "Project Manager", "Strategy Manager", "Business Development Executive", "Other"],
    "Product Management": ["Product Manager", "Associate Product Manager (APM)", "Technical Product Manager", "Product Analyst", "Growth Product Manager", "Product Owner (Scrum)", "Head of Product", "Other"],
    "Marketing & Sales": ["Digital Marketing Manager", "SEO Specialist", "Content Marketing Manager", "Performance Marketing Analyst", "Brand Manager", "Sales Executive", "Business Development Manager", "Account Manager", "Social Media Manager", "Growth Hacker", "Other"],
    "Operations": ["Operations Manager", "Supply Chain Manager", "Logistics Manager", "Procurement Manager", "Inventory Analyst", "Business Operations Analyst", "Vendor Manager", "Other"],
    "Human Resources": ["HR Executive", "HR Business Partner (HRBP)", "Talent Acquisition Specialist", "HR Manager", "Learning & Development Manager", "Compensation & Benefits Analyst", "HR Generalist", "Other"],
    "Entrepreneurship / Startup": ["Founder / Co-Founder", "Chief of Staff", "Strategy & Growth Lead", "Business Development Lead", "VC Analyst", "Startup Consultant", "Other"],
    "Consulting": ["Management Consultant", "Strategy Consultant", "IT Consultant", "Financial Consultant", "HR Consultant", "Operations Consultant", "Other"],
  },
  "Finance & Accounting": {
    "_default": ["Financial Analyst", "Accountant", "Auditor", "Finance Manager", "Chartered Accountant (CA)", "Cost Accountant", "Tax Consultant", "Other"],
    "Financial Analysis": ["Financial Analyst", "Equity Research Analyst", "Credit Analyst", "Portfolio Manager", "Risk Analyst", "FP&A Analyst", "Other"],
    "Investment Banking": ["Investment Banking Analyst", "M&A Analyst", "Derivatives Trader", "Quantitative Analyst (Quant)", "Capital Markets Associate", "Private Equity Analyst", "Hedge Fund Analyst", "Other"],
    "Auditing": ["Internal Auditor", "External Auditor", "Statutory Auditor (CA)", "Risk & Compliance Analyst", "Forensic Accountant", "IT Auditor", "Other"],
    "Taxation": ["Tax Consultant", "GST Consultant", "Direct Tax Analyst", "Transfer Pricing Analyst", "Tax Manager", "International Tax Specialist", "Other"],
    "Accounting": ["Accountant", "Senior Accountant", "Management Accountant", "Cost Accountant (ICWA/CMA)", "Financial Controller", "Bookkeeper", "Other"],
    "Banking & FinTech": ["Relationship Manager - Banking", "Credit Risk Analyst", "Loan Officer", "FinTech Product Manager", "Digital Payments Analyst", "Compliance Officer - Banking", "Treasury Analyst", "Other"],
  },
  "Design & Creative": {
    "_default": ["UX/UI Designer", "Graphic Designer", "Visual Designer", "Creative Director", "Illustrator", "Other"],
    "UI/UX Design": ["UX Designer", "UI Designer", "Product Designer", "UX Researcher", "Interaction Designer", "UX Writer", "Design Systems Designer", "Other"],
    "Graphic Design": ["Graphic Designer", "Brand Identity Designer", "Packaging Designer", "Print Designer", "Art Director", "Visual Communication Designer", "Other"],
    "Motion Design": ["Motion Graphics Designer", "Video Editor", "2D/3D Animator", "VFX Artist", "After Effects Specialist", "Broadcast Designer", "Other"],
    "Industrial Design": ["Industrial Designer", "Product Designer - Consumer Goods", "Furniture Designer", "Packaging Designer", "Other"],
    "Fashion Design": ["Fashion Designer", "Apparel Merchandiser", "Textile Designer", "Pattern Maker", "Fashion Illustrator", "Costume Designer", "Other"],
    "Architecture & Interior": ["Architect", "Interior Designer", "Landscape Architect", "Urban Designer", "Space Planner", "3D Visualizer (Architectural)", "BIM Coordinator", "Project Architect", "Other"],
  },
  "Science & Research": {
    "_default": ["Research Scientist", "Lab Technician", "Research Assistant", "Science Writer", "Policy Researcher", "Other"],
    "Physics": ["Research Physicist", "Computational Physicist", "Optics Researcher", "Materials Scientist", "Astrophysicist", "Physics Teacher / Lecturer", "Other"],
    "Chemistry": ["Research Chemist", "Analytical Chemist", "Organic Chemist", "Polymer Scientist", "QC Chemist - Pharma/Food", "Process Chemist", "Other"],
    "Biology / Life Sciences": ["Microbiologist", "Molecular Biologist", "Biochemist", "Biotechnologist", "Geneticist", "Immunologist", "Lab Scientist", "Other"],
    "Biotechnology": ["Biotech Researcher", "Bioinformatics Analyst", "Genetic Engineer", "Bioprocess Engineer", "Clinical Trial Scientist", "Other"],
    "Mathematics / Statistics": ["Data Analyst", "Statistician", "Quantitative Analyst (Quant)", "Actuarial Analyst", "Research Mathematician", "Biostatistician", "Other"],
    "Environmental Science": ["Environmental Scientist", "Climate Researcher", "Marine Biologist", "GIS Analyst", "Remote Sensing Analyst", "Sustainability Manager", "Other"],
  },
  "Law": {
    "_default": ["Advocate / Lawyer", "Legal Counsel", "Legal Researcher", "Compliance Officer", "Paralegal", "Other"],
    "Corporate Law": ["Corporate Lawyer", "M&A Legal Analyst", "Company Secretary (CS)", "Contract Manager", "Legal Compliance Manager", "IPR Attorney", "Other"],
    "Criminal Law": ["Criminal Defense Advocate", "Public Prosecutor", "Litigation Associate", "Forensic Legal Analyst", "Other"],
    "Constitutional / Civil Law": ["Civil Litigation Lawyer", "Constitutional Advocate", "Judiciary Aspirant (Judge)", "Government Law Officer", "Other"],
    "Intellectual Property": ["Patent Attorney / Agent", "Trademark Attorney", "IP Analyst", "Copyright Lawyer", "Technology Transfer Specialist", "Other"],
    "International Law": ["International Law Associate", "Trade Law Analyst", "Human Rights Lawyer", "Diplomat / Foreign Service Officer", "Other"],
  },
  "Architecture": {
    "_default": ["Architect", "Urban Planner", "Interior Designer", "Landscape Architect", "3D Visualizer", "Other"],
    "Urban Planning": ["Urban Planner", "Town Planner", "GIS Urban Analyst", "Smart City Consultant", "Regional Planner", "Other"],
    "Interior Design": ["Interior Designer", "Space Planner", "Furniture Designer", "Lighting Designer", "Exhibition Designer", "Other"],
    "Landscape Architecture": ["Landscape Architect", "Horticulturist", "Park Planner", "Environmental Landscape Designer", "Other"],
    "Building & Construction": ["Project Architect", "BIM Coordinator", "Construction Manager", "Quantity Surveyor", "Site Architect", "Other"],
  },
  "Education & Teaching": {
    "_default": ["Teacher", "Lecturer", "Curriculum Developer", "Education Consultant", "Academic Coordinator", "Other"],
    "School Teaching": ["Primary / Elementary Teacher", "High School Subject Teacher", "Special Education Teacher", "School Counselor", "Physical Education Teacher", "Other"],
    "Higher Education": ["Assistant Professor", "Associate Professor", "University Lecturer", "Research Faculty", "Academic Advisor", "Department Coordinator", "Other"],
    "EdTech": ["Curriculum Designer", "Instructional Designer", "Learning Experience Designer (LXD)", "EdTech Product Manager", "Online Tutor / Subject Matter Expert", "eLearning Developer", "Other"],
    "Training & Development": ["Corporate Trainer", "L&D Specialist", "HR Training Manager", "Technical Trainer", "Content Developer - Training", "Other"],
  },
  "Media & Communications": {
    "_default": ["Journalist", "Content Creator", "PR Executive", "Copywriter", "Social Media Manager", "Other"],
    "Journalism": ["Reporter / Journalist", "News Anchor", "Investigative Journalist", "Feature Writer", "Photo Journalist", "Digital News Editor", "Other"],
    "Public Relations": ["PR Executive", "Brand Communications Manager", "Media Relations Specialist", "Corporate Communications Officer", "Crisis Communications Manager", "Other"],
    "Advertising": ["Copywriter", "Creative Director", "Account Manager - Ad Agency", "Media Planner", "Brand Strategist", "Performance Marketer", "Other"],
    "Content Creation": ["Content Writer", "Blogger / Vlogger", "YouTube Creator", "Podcast Host", "Technical Writer", "UX Content Strategist", "Other"],
  },
};

export const getRolesForProfile = (field = '', subfield = '') => {
  const fieldMap = ROLES_BY_FIELD[field];
  if (!fieldMap) return ['Analyst','Consultant','Manager','Specialist','Executive','Team Lead','Project Manager','Other'];
  return fieldMap[subfield] || fieldMap['_default'] || ['Other'];
};