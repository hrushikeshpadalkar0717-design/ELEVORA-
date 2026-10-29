// ─────────────────────────────────────────────────────────────
//  ELEVORA – AI Simulation Service
//  All functions are field + subfield aware with robust taxonomy mapping.
// ─────────────────────────────────────────────────────────────

const delay = (ms = 900) => new Promise((r) => setTimeout(r, ms));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const genericVerbs = [
  'Spearheaded', 'Architected', 'Engineered', 'Optimized', 'Formulated',
  'Synthesized', 'Orchestrated', 'Implemented', 'Revamped', 'Streamlined',
  'Delivered', 'Championed', 'Designed', 'Developed', 'Established'
];

// Universal neutral fallback (never uses mechanical CAD or domain-specific assumptions)
const UNIVERSAL_DEFAULT_CONFIG = {
  verbs: genericVerbs,
  summaries: {
    fresher: (role, skills) => `Goal-oriented and motivated ${role} graduate with foundational expertise in ${skills}. Demonstrated ability to apply core principles to practical challenges, with strong problem-solving skills and a commitment to professional excellence.`,
    intern: (role, skills) => `Dedicated ${role} intern with hands-on project experience in ${skills}. Eager to leverage analytical problem solving, collaborative teamwork, and professional rigor to deliver high-quality outcomes.`,
    experienced: (role, skills) => `Results-driven ${role} with a proven track record in ${skills}. Experienced in cross-functional collaboration, operational efficiency, and delivering measurable results in dynamic environments.`,
  },
  defaultSkills: 'analytical problem solving, project management, cross-functional collaboration',
  bulletPatterns: [
    { match: ['lead', 'manage', 'coordinate'], out: 'Coordinated cross-functional teams to deliver project milestones on time, maintaining quality benchmarks and stakeholder alignment.' },
    { match: ['optimize', 'improve', 'efficiency'], out: 'Streamlined operational processes and eliminated workflow bottlenecks, driving measurable improvements in productivity.' },
    { match: ['report', 'document', 'present'], out: 'Prepared comprehensive technical documentation and executive presentations summarizing key metrics and strategic recommendations.' },
  ],
  atsKeywords: {
    matched: ['Problem Solving', 'Project Management', 'Communication', 'Teamwork', 'Process Optimization'],
    missing: ['Industry Standards', 'Measurable Metrics', 'Certifications'],
  },
  interviewQs: [
    { q: (role) => `Describe a challenging project you contributed to as a ${role} and how you overcame obstacles.`, kp: ['Problem identification', 'Iterative solution design', 'Quantifiable outcome'], ans: 'I defined the core constraints, broke the problem into manageable phases, collaborated closely with stakeholders, and delivered the target outcome.' },
  ],
};

// ── Domain configuration keyed by field → subfield ─────────────
const DOMAIN_CONFIG = {

  // ─────────────────────────────────────────────────────────────
  //  ENGINEERING
  // ─────────────────────────────────────────────────────────────
  'Engineering': {
    'CSE': {
      verbs: ['Built', 'Architected', 'Developed', 'Engineered', 'Optimized', 'Deployed', 'Implemented'],
      summaries: {
        fresher: (role, skills) => `Enthusiastic and technically skilled ${role} graduate with strong foundations in ${skills}. Passionate about building responsive applications, writing clean maintainable code, and solving complex algorithmic challenges.`,
        intern: (role, skills) => `Driven ${role} intern with hands-on project experience in ${skills}, RESTful API development, and modern software development workflows. Eager to contribute to agile teams and scale user-centric systems.`,
        experienced: (role, skills) => `Accomplished ${role} with deep expertise in ${skills}. Proven track record in designing scalable systems, optimizing application performance, and delivering robust software solutions in fast-paced production environments.`,
      },
      defaultSkills: 'JavaScript, React, Node.js, Python, SQL',
      bulletPatterns: [
        { match: ['react', 'frontend', 'ui', 'web'], out: 'Built responsive single-page web applications with modern frontend frameworks, optimizing rendering performance and state management.' },
        { match: ['api', 'backend', 'node', 'server', 'database', 'sql'], out: 'Architected scalable RESTful APIs with Node.js and SQL/NoSQL databases, achieving high availability and sub-100ms response times.' },
        { match: ['ml', 'ai', 'data', 'python', 'model'], out: 'Developed predictive machine learning models and automated data processing pipelines in Python, driving measurable analytics insights.' },
        { match: ['test', 'git', 'deploy', 'docker', 'ci'], out: 'Implemented automated testing suites and CI/CD pipelines, increasing code coverage to 85%+ and streamlining deployment cycles.' },
      ],
      atsKeywords: {
        matched: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'REST APIs', 'Data Structures'],
        missing: ['Docker', 'CI/CD Pipelines', 'System Design'],
      },
      interviewQs: [
        { q: (role) => `As a ${role}, how do you approach designing scalable RESTful APIs?`, kp: ['Idempotency & HTTP status codes', 'Pagination & rate limiting', 'Caching with Redis'], ans: 'I adhere to REST conventions, enforce idempotent endpoints, implement cursor-based pagination and rate limiting, and cache hot data in Redis with appropriate TTL.' },
      ],
    },

    'IT': {
      verbs: ['Configured', 'Administered', 'Automated', 'Deployed', 'Monitored', 'Maintained', 'Secured'],
      summaries: {
        fresher: (role, skills) => `Proactive ${role} graduate with comprehensive knowledge of ${skills}. Skilled in infrastructure management, networking protocols, and system administration, with a strong focus on high-availability IT services.`,
        intern: (role, skills) => `Motivated ${role} intern with hands-on exposure to ${skills}, cloud support, and automated system maintenance in enterprise environments.`,
        experienced: (role, skills) => `Experienced ${role} with deep expertise in ${skills}. Track record of maintaining 99.9% system uptime, automating server provisioning, and fortifying enterprise infrastructure security.`,
      },
      defaultSkills: 'Cloud Computing, Linux, Networking, SQL, Docker',
      bulletPatterns: [
        { match: ['cloud', 'aws', 'azure'], out: 'Provisioned and managed cloud infrastructure in AWS/Azure, optimizing resource allocation and reducing operational overhead.' },
        { match: ['linux', 'server', 'admin'], out: 'Administered Linux and Windows server environments, automating recurring maintenance tasks via Shell and PowerShell scripting.' },
        { match: ['network', 'firewall', 'security'], out: 'Configured secure network topologies, VPNs, and firewall rules to protect organizational assets from unauthorized access.' },
      ],
      atsKeywords: {
        matched: ['Linux Administration', 'Cloud Infrastructure', 'Network Security', 'SQL', 'Docker', 'Automation'],
        missing: ['Terraform', 'Kubernetes', 'ITIL Framework'],
      },
      interviewQs: [
        { q: (role) => `How would you troubleshoot high latency on a corporate server as a ${role}?`, kp: ['Resource utilization (CPU/Memory/I/O)', 'Network diagnostics (traceroute/ping)', 'Log inspection'], ans: 'I inspect top/htop for CPU and memory saturation, check disk I/O with iostat, test network latency with traceroute, and review syslog and application logs for recurring errors.' },
      ],
    },

    'E&TC': {
      verbs: ['Designed', 'Tested', 'Programmed', 'Integrated', 'Debugged', 'Simulated', 'Fabricated'],
      summaries: {
        fresher: (role, skills) => `Dedicated ${role} graduate with foundational expertise in ${skills}. Experienced in hardware-software co-design, PCB layout, and embedded firmware development for real-time systems.`,
        intern: (role, skills) => `Electronics engineering intern with practical exposure to ${skills}, circuit testing, and sensor integration in laboratory and prototype environments.`,
        experienced: (role, skills) => `Senior ${role} with extensive background in ${skills}, embedded product development, and telecommunication systems. Proven success in taking hardware concepts from schematic to production.`,
      },
      defaultSkills: 'Embedded C, Microcontrollers, VLSI, IoT, Circuit Design',
      bulletPatterns: [
        { match: ['embedded', 'firmware', 'c', 'microcontroller', 'arduino', 'stm32'], out: 'Developed real-time firmware for STM32 microcontrollers in Embedded C, achieving deterministic sensor acquisition.' },
        { match: ['pcb', 'circuit', 'schematic'], out: 'Designed multi-layer PCB schematics and layouts, conducting signal integrity analysis and reducing board noise by 20%.' },
        { match: ['iot', 'sensor', 'wireless'], out: 'Integrated wireless IoT telemetry modules over MQTT/BLE, reducing transmission power consumption by 30%.' },
      ],
      atsKeywords: {
        matched: ['Embedded C', 'Microcontroller Programming', 'PCB Design', 'IoT', 'VLSI', 'Signal Processing'],
        missing: ['RTOS', 'FPGA Architecture', 'EMC/EMI Compliance'],
      },
      interviewQs: [
        { q: (role) => `How do you handle debounce issues in hardware interrupt buttons as a ${role}?`, kp: ['Hardware RC filtering', 'Software timer delay', 'State machine validation'], ans: 'I use a hardware RC low-pass filter or implement a software timer check that ignores subsequent transitions within a 20-50ms window.' },
      ],
    },

    'Mechanical': {
      verbs: ['Engineered', 'Modelled', 'Fabricated', 'Optimized', 'Simulated', 'Validated', 'Designed'],
      summaries: {
        fresher: (role, skills) => `Results-driven ${role} graduate with hands-on expertise in ${skills}. Proven ability in 3D CAD modeling, structural FEA analysis, and precision manufacturing documentation per ASME GD&T standards.`,
        intern: (role, skills) => `Motivated ${role} intern with practical project experience in ${skills}, prototype fabrication, and stress simulation in engineering environments.`,
        experienced: (role, skills) => `Accomplished ${role} with extensive background in mechanical design lifecycle, CAD/FEA simulation, and DFM/DFA delivery using ${skills}. Reduced assembly costs and shortened prototyping cycles.`,
      },
      defaultSkills: 'SolidWorks, AutoCAD, ANSYS, GD&T, MATLAB',
      bulletPatterns: [
        { match: ['cad', 'drawing', 'model', 'solidworks'], out: 'Engineered parametric 3D CAD assemblies and precision manufacturing drawings per ASME Y14.5 GD&T standards, reducing design rework by 25%.' },
        { match: ['fea', 'ansys', 'stress', 'simulation'], out: 'Performed static stress and fatigue FEA simulations in ANSYS, validating factor of safety under peak operational load conditions.' },
        { match: ['dfm', 'manufacturing', 'machining'], out: 'Collaborated with manufacturing and tooling teams to ensure DFM/DFA compliance, cutting component fabrication time by 15%.' },
      ],
      atsKeywords: {
        matched: ['SolidWorks', 'CAD Modelling', 'FEA Simulation', 'GD&T', 'Mechanical Design', 'AutoCAD', 'ANSYS'],
        missing: ['DFM/DFA', 'Tolerance Stack-up', 'Design of Experiments'],
      },
      interviewQs: [
        { q: (role) => `How do you perform tolerance stack-up analysis when preparing an assembly as a ${role}?`, kp: ['Worst-case vs RSS', 'Thermal expansion', 'Cumulative dimensional drift'], ans: 'I establish a dimensional chain between critical assembly features. For tight safety fits I use 1D WC analysis; for high-volume products I use RSS assuming Gaussian variance.' },
      ],
    },

    'Civil': {
      verbs: ['Designed', 'Surveyed', 'Estimated', 'Supervised', 'Planned', 'Coordinated', 'Inspected'],
      summaries: {
        fresher: (role, skills) => `Driven ${role} graduate with foundational expertise in ${skills}. Hands-on experience in site surveying, structural analysis, and drafting code-compliant engineering layouts.`,
        intern: (role, skills) => `Civil engineering intern with field exposure to ${skills}, quantity estimation, and quality assurance on active construction sites.`,
        experienced: (role, skills) => `Senior ${role} with a strong track record in structural design, site execution, and project management of infrastructure projects using ${skills}.`,
      },
      defaultSkills: 'AutoCAD, STAAD.Pro, Revit, Structural Analysis, Site Supervision',
      bulletPatterns: [
        { match: ['survey', 'layout'], out: 'Conducted precise topographic surveys and site layout using Total Station, reducing rework by 15%.' },
        { match: ['design', 'structure', 'beam', 'column'], out: 'Designed RCC structural members per IS codes, optimizing steel quantities by 12% without compromising load capacity.' },
        { match: ['estimate', 'boq', 'quantity'], out: 'Prepared detailed BOQ and cost estimates for construction projects, maintaining accuracy within 5% of actual expenditure.' },
      ],
      atsKeywords: {
        matched: ['AutoCAD', 'STAAD.Pro', 'Structural Design', 'BOQ', 'Site Supervision', 'IS Codes'],
        missing: ['Revit Structure', 'ETABS', 'Project Scheduling'],
      },
      interviewQs: [
        { q: () => 'How do you handle deviation from the construction drawing on site?', kp: ['RFI process', 'Consultation with design engineer', 'Field documentation'], ans: 'I raise an RFI immediately, document the deviation with site photos, and implement changes only after written approval from the structural engineer.' },
      ],
    },

    'Electrical': {
      verbs: ['Designed', 'Tested', 'Commissioned', 'Configured', 'Analyzed', 'Integrated', 'Programmed'],
      summaries: {
        fresher: (role, skills) => `Driven ${role} graduate with strong foundations in ${skills}. Hands-on experience in electrical schematic design, power system modeling, and industrial automation.`,
        intern: (role, skills) => `Electrical engineering intern proficient in ${skills} with exposure to panel wiring, PLC troubleshooting, and control system testing in industrial settings.`,
        experienced: (role, skills) => `Accomplished ${role} with deep expertise in ${skills}, managing end-to-end electrical design, protection coordination, and energy optimization for industrial systems.`,
      },
      defaultSkills: 'PLC Programming, MATLAB, Power Systems, AutoCAD Electrical, ETAP',
      bulletPatterns: [
        { match: ['plc', 'scada', 'automation'], out: 'Programmed industrial PLCs in Ladder Logic and SCL for automated conveyor and packaging systems, cutting manual downtime by 40%.' },
        { match: ['panel', 'wiring', 'circuit', 'schematic'], out: 'Designed single-line diagrams (SLD) and panel layouts in AutoCAD Electrical complying with IEC standards.' },
        { match: ['power', 'load', 'etap'], out: 'Conducted load flow and short-circuit studies in ETAP, optimizing transformer loading and protection relay coordination.' },
      ],
      atsKeywords: {
        matched: ['AutoCAD Electrical', 'PLC Programming', 'ETAP', 'Power Systems', 'Control Systems', 'Panel Design'],
        missing: ['SCADA Integration', 'Power Electronics', 'Renewable Energy Systems'],
      },
      interviewQs: [
        { q: () => 'Explain how you coordinate protective relays in a power distribution network.', kp: ['Fault calculation', 'Time-current curves', 'Primary vs backup selectivity'], ans: 'I calculate minimum and maximum fault currents at each bus, plot time-current characteristics in ETAP, and ensure downstream breakers clear faults before upstream relays trip.' },
      ],
    },

    '_default': {
      verbs: ['Engineered', 'Optimized', 'Delivered', 'Implemented', 'Analyzed', 'Designed', 'Coordinated'],
      summaries: {
        fresher: (role, skills) => `Enthusiastic and analytical ${role} graduate with solid foundations in ${skills}. Skilled in technical problem solving, engineering principles, and cross-functional project collaboration.`,
        intern: (role, skills) => `Motivated ${role} intern with hands-on project experience in ${skills} and a strong commitment to quality standards and technical execution.`,
        experienced: (role, skills) => `Results-oriented ${role} with a proven record of delivering high-impact engineering solutions using ${skills}. Experienced in technical design, process improvement, and stakeholder alignment.`,
      },
      defaultSkills: 'technical problem solving, engineering analysis, project documentation',
      bulletPatterns: [
        { match: ['design', 'project', 'plan'], out: 'Executed engineering design and analysis workflows, delivering comprehensive project documentation ahead of schedule.' },
        { match: ['test', 'quality', 'inspect'], out: 'Conducted rigorous quality and performance testing, identifying potential failure modes and verifying design robustness.' },
      ],
      atsKeywords: {
        matched: ['Engineering Analysis', 'Project Management', 'Technical Documentation', 'Problem Solving'],
        missing: ['Root Cause Analysis', 'Quality Assurance', 'Process Optimization'],
      },
      interviewQs: [
        { q: (role) => `Describe a complex engineering challenge you resolved as a ${role}.`, kp: ['Problem identification', 'Iterative solution design', 'Quantifiable outcome'], ans: 'I defined the root constraint, created a structured test plan, validated alternatives with simulations, and deployed the optimal solution on schedule.' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────
  //  MEDICAL & HEALTHCARE
  // ─────────────────────────────────────────────────────────────
  'Medical & Healthcare': {
    'MBBS': {
      verbs: ['Diagnosed', 'Treated', 'Managed', 'Assessed', 'Counseled', 'Coordinated', 'Administered'],
      summaries: {
        fresher: (role, skills) => `Dedicated ${role} graduate with comprehensive clinical training across internal medicine, surgery, pediatrics, and emergency care. Proficient in ${skills} with a commitment to compassionate, evidence-based patient outcomes.`,
        intern: (role, skills) => `Medical intern with hands-on rotational experience in high-volume OPD, casualty, and inpatient wards. Skilled in ${skills}, systematic history-taking, and diagnostic evaluation.`,
        experienced: (role, skills) => `Accomplished ${role} with extensive experience in differential diagnosis, protocol-driven clinical care, and patient management using ${skills}.`,
      },
      defaultSkills: 'clinical examination, patient management, differential diagnosis, BLS/ACLS',
      bulletPatterns: [
        { match: ['opd', 'patient', 'consult'], out: 'Managed 50+ OPD and inpatient cases daily, conducting comprehensive physical examinations, diagnostic evaluations, and therapeutic plans.' },
        { match: ['emergency', 'casualty', 'resuscitat', 'icu'], out: 'Provided immediate resuscitation and critical care triage in casualty per ACLS and ATLS protocols.' },
        { match: ['record', 'emr', 'history'], out: 'Maintained meticulous electronic medical records and clinical documentation ensuring continuity of multi-specialty care.' },
      ],
      atsKeywords: {
        matched: ['Clinical Examination', 'Patient Management', 'Differential Diagnosis', 'ACLS', 'EMR Documentation', 'Emergency Care'],
        missing: ['NABH Standards', 'Clinical Research', 'Quality Improvement'],
      },
      interviewQs: [
        { q: () => 'How do you approach a patient presenting with acute chest pain in casualty?', kp: ['Immediate ECG & troponin', 'OLDCART history', 'Aspirin/Nitro & STEMI pathway'], ans: 'I immediately obtain a 12-lead ECG, assess ABCs, administer aspirin, check cardiac enzymes, and activate the catheterization lab protocol if STEMI is confirmed.' },
      ],
    },

    'BDS': {
      verbs: ['Diagnosed', 'Treated', 'Performed', 'Restored', 'Extracted', 'Managed', 'Educated'],
      summaries: {
        fresher: (role, skills) => `Skilled ${role} with clinical training in ${skills}. Experienced in dental examinations, restorative procedures, and patient education in high-volume dental clinics.`,
        intern: (role, skills) => `Dental intern proficient in ${skills}, radiograph interpretation, and chairside procedure assistance under specialist supervision.`,
        experienced: (role, skills) => `Accomplished ${role} with expertise in ${skills}, advanced restorative procedures, and delivering comprehensive, pain-free dental care.`,
      },
      defaultSkills: 'dental diagnostics, restorative dentistry, oral prophylaxis, patient care',
      bulletPatterns: [
        { match: ['restor', 'filling', 'composite'], out: 'Performed aesthetic composite restorations and root canal treatments with rotary instrumentation, restoring full masticatory function.' },
        { match: ['x-ray', 'radiograph', 'opg'], out: 'Interpreted intraoral periapical (IOPA) and panoramic radiographs to formulate comprehensive treatment plans.' },
        { match: ['patient', 'hygiene', 'counsel'], out: 'Conducted preventive oral hygiene counseling, scaling, and root planing for pediatric and adult patients.' },
      ],
      atsKeywords: {
        matched: ['Dental Diagnostics', 'Restorative Dentistry', 'Oral Surgery', 'Patient Management', 'Radiograph Interpretation'],
        missing: ['Digital Dentistry (CAD/CAM)', 'Implantology', 'Cosmetic Dentistry'],
      },
      interviewQs: [
        { q: () => 'How do you manage patients with severe dental anxiety during invasive procedures?', kp: ['Tell-Show-Do technique', 'Rapport building', 'Local anesthesia optimization'], ans: 'I explain every step using the Tell-Show-Do method, verify profound local anesthesia, establish hand-signals for breaks, and maintain a calm, reassuring chairside manner.' },
      ],
    },

    'B.Pharm': {
      verbs: ['Analyzed', 'Formulated', 'Monitored', 'Audited', 'Evaluated', 'Documented', 'Ensured'],
      summaries: {
        fresher: (role, skills) => `Detail-oriented ${role} graduate with strong academic grounding in ${skills}. Knowledgeable in GMP standards, clinical safety reporting, and drug regulatory frameworks.`,
        intern: (role, skills) => `Pharmacy intern with hands-on experience in ${skills}, pharmaceutical analysis, and adverse drug reaction reporting in regulated environments.`,
        experienced: (role, skills) => `Seasoned ${role} with extensive background in ${skills}, ensuring strict compliance with FDA/ICH guidelines, drug safety audits, and product quality standards.`,
      },
      defaultSkills: 'pharmacovigilance, drug safety, regulatory compliance, quality control',
      bulletPatterns: [
        { match: ['safety', 'pharmacovigilance', 'adr'], out: 'Evaluated and processed adverse drug reaction (ADR) reports per ICH E2B guidelines, maintaining 100% regulatory reporting compliance.' },
        { match: ['qc', 'quality', 'assay', 'hplc'], out: 'Performed raw material and finished product assays using HPLC and spectrophotometry under strict cGMP protocols.' },
        { match: ['regulatory', 'dossier', 'compliance'], out: 'Assisted in preparing regulatory dossiers and stability data documentation for statutory drug authority submissions.' },
      ],
      atsKeywords: {
        matched: ['Pharmacovigilance', 'Drug Safety', 'Regulatory Affairs', 'Quality Assurance', 'GMP Compliance', 'Clinical Research'],
        missing: ['MedDRA Coding', 'ICH Guidelines', 'Audit Preparedness'],
      },
      interviewQs: [
        { q: () => 'How do you triage and assess causality for an unexpected adverse drug reaction?', kp: ['Naranjo algorithm', 'De-challenge / Re-challenge', 'Expedited regulatory timelines'], ans: 'I apply the Naranjo algorithm to evaluate causality, check for de-challenge outcomes, cross-reference the prescribing monograph, and log expedited reporting within 15 days if serious.' },
      ],
    },

    'B.Sc Nursing': {
      verbs: ['Administered', 'Monitored', 'Assessed', 'Coordinated', 'Educated', 'Documented', 'Cared'],
      summaries: {
        fresher: (role, skills) => `Compassionate and highly trained ${role} with clinical proficiency in ${skills}. Committed to patient safety, ethical bedside care, and collaborative interdisciplinary practice.`,
        intern: (role, skills) => `Nursing intern with practical experience in ${skills}, ICU hemodynamic monitoring, and acute care support in tertiary hospital settings.`,
        experienced: (role, skills) => `Dedicated ${role} with proven track record in ${skills}. Experienced in managing high-acuity wards, mentoring junior nurses, and upholding zero-error medication safety.`,
      },
      defaultSkills: 'patient assessment, vital signs monitoring, medication administration, wound care',
      bulletPatterns: [
        { match: ['medication', 'dose', 'drug'], out: 'Administered IV/oral medications following the 5 Rights protocol, maintaining zero medication errors across shifts.' },
        { match: ['vital', 'icu', 'monitor'], out: 'Monitored hemodynamic parameters in high-acuity wards, detecting clinical decompensation early and initiating rapid escalation.' },
        { match: ['wound', 'dressing', 'sterile'], out: 'Executed sterile wound dressings and surgical drain care, reducing postoperative infection rates.' },
      ],
      atsKeywords: {
        matched: ['Patient Assessment', 'Medication Administration', 'Vital Signs Monitoring', 'Wound Care', 'BLS Certification', 'EMR'],
        missing: ['Critical Care Nursing', 'Infection Control Protocols', 'Triage Management'],
      },
      interviewQs: [
        { q: () => 'How do you prioritize patient care when managing multiple unstable patients?', kp: ['ABCs & acuity triage', 'Delegation & SBAR communication', 'Rapid response protocol'], ans: 'I prioritize based on airway, breathing, and circulatory instability, delegate routine tasks to support staff, and communicate urgent status changes to attending physicians using SBAR.' },
      ],
    },

    '_default': {
      verbs: ['Treated', 'Managed', 'Assessed', 'Coordinated', 'Documented', 'Performed'],
      summaries: {
        fresher: (role, skills) => `Dedicated healthcare professional with comprehensive training in ${skills}. Committed to delivering evidence-based patient care, safety compliance, and interdisciplinary collaboration.`,
        intern: (role, skills) => `Healthcare intern with practical clinical experience in ${skills} and exposure to multifaceted hospital workflows.`,
        experienced: (role, skills) => `Accomplished healthcare professional with proven expertise in ${skills} and a strong record of delivering high-quality, patient-centric outcomes in clinical environments.`,
      },
      defaultSkills: 'patient-centered care, clinical documentation, health assessment',
      bulletPatterns: [
        { match: ['patient', 'care', 'support'], out: 'Delivered compassionate, patient-centered care and adhered strictly to clinical documentation protocols.' },
      ],
      atsKeywords: {
        matched: ['Patient Care', 'Clinical Documentation', 'Evidence-Based Practice', 'Healthcare Safety'],
        missing: ['Quality Improvement', 'NABH Protocols', 'Infection Control'],
      },
      interviewQs: [
        { q: (role) => `How do you ensure patient safety and error prevention in your daily duties as a ${role}?`, kp: ['Double verification checks', 'Clear communication', 'Strict protocol adherence'], ans: 'I use two-identifier verification, cross-check orders, maintain meticulous documentation, and maintain open communication across clinical teams.' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────
  //  COMMERCE & MANAGEMENT
  // ─────────────────────────────────────────────────────────────
  'Commerce & Management': {
    'B.Com': {
      verbs: ['Reconciled', 'Analyzed', 'Audited', 'Prepared', 'Managed', 'Reported', 'Calculated'],
      summaries: {
        fresher: (role, skills) => `Analytical ${role} graduate with solid expertise in ${skills}. Proficient in bookkeeping, balance sheet reconciliation, and GST/TDS statutory filings, with keen attention to detail.`,
        intern: (role, skills) => `Accounting intern with practical experience in ${skills}, ledger scrutiny, and financial statement verification in fast-paced corporate environments.`,
        experienced: (role, skills) => `Results-oriented ${role} with strong background in ${skills}. Skilled in streamlining accounting operations, ensuring 100% tax compliance, and delivering accurate monthly financial closes.`,
      },
      defaultSkills: 'financial accounting, Tally, GST compliance, taxation, MS Excel',
      bulletPatterns: [
        { match: ['reconcil', 'bank', 'ledger'], out: 'Performed monthly bank, debtor, and creditor reconciliations across 100+ accounts, identifying and resolving discrepancies.' },
        { match: ['gst', 'tax', 'tds', 'filing'], out: 'Prepared and filed monthly GST (GSTR-1, 3B) and quarterly TDS returns, ensuring 100% compliance with statutory deadlines.' },
        { match: ['tally', 'journal', 'entry', 'books'], out: 'Managed primary daybooks and ledger entries in Tally Prime, generating monthly P&L and balance sheet reports.' },
      ],
      atsKeywords: {
        matched: ['Financial Accounting', 'Tally Prime', 'GST Compliance', 'Taxation', 'Bank Reconciliation', 'Advanced Excel'],
        missing: ['ERP Systems (SAP/Oracle)', 'Statutory Audit', 'Variance Analysis'],
      },
      interviewQs: [
        { q: () => 'Explain how you reconcile input tax credit (ITC) between GSTR-2B and purchase registers.', kp: ['Invoice matching', 'Mismatch resolution with vendors', 'Eligible vs ineligible ITC'], ans: 'I export GSTR-2B from the GST portal, use Excel VLOOKUP to match invoice numbers and amounts against our purchase register, and notify non-compliant vendors immediately.' },
      ],
    },

    'CA': {
      verbs: ['Audited', 'Modeled', 'Advised', 'Evaluated', 'Restructured', 'Ensured', 'Formulated'],
      summaries: {
        fresher: (role, skills) => `Committed ${role} with in-depth knowledge of ${skills}. Experienced in statutory and internal audits, complex tax planning, and rigorous financial analysis.`,
        intern: (role, skills) => `Articled assistant and ${role} aspirant with hands-on exposure to ${skills}, statutory audit procedures, and tax assessment filings across diverse industries.`,
        experienced: (role, skills) => `Senior ${role} with demonstrated excellence in ${skills}. Proven track record in corporate restructuring, risk mitigation, and advisory for multi-crore enterprises.`,
      },
      defaultSkills: 'statutory audit, direct & indirect taxation, IFRS/GAAP, financial reporting, risk advisory',
      bulletPatterns: [
        { match: ['audit', 'statutory', 'internal'], out: 'Conducted statutory and tax audits for corporate clients per Standards on Auditing, ensuring complete regulatory compliance.' },
        { match: ['ifrs', 'gaap', 'financial statement'], out: 'Drafted complete financial statements and notes to accounts complying with Ind AS and IFRS frameworks.' },
        { match: ['tax', 'assessment', 'planning'], out: 'Formulated tax planning strategies and represented corporate clients during assessment proceedings, mitigating tax exposure.' },
      ],
      atsKeywords: {
        matched: ['Statutory Audit', 'Direct & Indirect Tax', 'IFRS / Ind AS', 'Financial Reporting', 'Internal Controls', 'Risk Advisory'],
        missing: ['Forensic Accounting', 'Due Diligence', 'M&A Valuation'],
      },
      interviewQs: [
        { q: () => 'How do you assess internal financial controls (IFC) during a statutory audit?', kp: ['Walkthrough tests', 'Design vs operating effectiveness', 'Material weakness reporting'], ans: 'I map core business processes, test control design via walkthroughs, perform sample testing for operating effectiveness, and report identified deficiencies to the audit committee.' },
      ],
    },

    'BBA': {
      verbs: ['Accelerated', 'Managed', 'Coordinated', 'Executed', 'Promoted', 'Negotiated', 'Streamlined'],
      summaries: {
        fresher: (role, skills) => `Energetic ${role} graduate with a strong foundation in ${skills}. Adept at identifying market opportunities, executing strategic sales initiatives, and cultivating key client partnerships.`,
        intern: (role, skills) => `Business administration intern skilled in ${skills}, competitive market analysis, and CRM pipeline management.`,
        experienced: (role, skills) => `Dynamic ${role} with proven success in ${skills}. Experienced in scaling operational efficiency, driving revenue expansion, and managing cross-functional teams.`,
      },
      defaultSkills: 'business development, operations management, market research, client relations, sales',
      bulletPatterns: [
        { match: ['lead', 'sales', 'business development'], out: 'Generated 40+ qualified enterprise B2B leads monthly, expanding business pipeline by 35% through targeted outbound outreach.' },
        { match: ['client', 'relationship', 'crm'], out: 'Managed 50+ key client accounts in CRM, maintaining a 94% client satisfaction rate and driving renewal growth.' },
        { match: ['market', 'research', 'competitor'], out: 'Conducted comprehensive competitor benchmarking and market sizing studies that guided product pricing strategies.' },
      ],
      atsKeywords: {
        matched: ['Business Development', 'Market Research', 'Client Relationship Management', 'Sales Strategy', 'Operations Management'],
        missing: ['Financial Modeling', 'Data Analytics', 'Agile Methodologies'],
      },
      interviewQs: [
        { q: (role) => `As a ${role}, how do you qualify new business opportunities?`, kp: ['BANT framework (Budget, Authority, Need, Timeline)', 'Pain-point discovery', 'Value proposition alignment'], ans: 'I use the BANT framework to assess budget, decision authority, core pain-point severity, and implementation timeline before advancing leads into formal proposals.' },
      ],
    },

    'MBA': {
      verbs: ['Spearheaded', 'Strategized', 'Scaled', 'Optimized', 'Led', 'Directed', 'Formulated'],
      summaries: {
        fresher: (role, skills) => `Strategic and results-driven ${role} graduate with expertise in ${skills}. Skilled in market sizing, financial modeling, and translating qualitative insights into high-impact business strategies.`,
        intern: (role, skills) => `Management intern with hands-on experience in ${skills}, cross-functional roadmap alignment, and executive data presentation.`,
        experienced: (role, skills) => `Accomplished ${role} with extensive track record in ${skills}. Successfully launched 0-to-1 initiatives, accelerated P&L growth, and guided cross-functional teams to exceed corporate OKRs.`,
      },
      defaultSkills: 'business strategy, project management, financial analysis, stakeholder management, analytics',
      bulletPatterns: [
        { match: ['strategy', 'growth', 'roadmap'], out: 'Formulated 12-month business expansion roadmap, aligning cross-functional leadership and accelerating divisional ARR by 24%.' },
        { match: ['product', 'launch', 'feature'], out: 'Spearheaded end-to-end product feature launches, conducting user discovery and driving a 30% increase in active user adoption.' },
        { match: ['cost', 'p&l', 'revenue', 'financial'], out: 'Analyzed divisional P&L statements and unit economics, identifying operational efficiencies that saved $450K annually.' },
      ],
      atsKeywords: {
        matched: ['Business Strategy', 'Stakeholder Management', 'P&L Management', 'KPI Tracking', 'Product Roadmap', 'Financial Analysis'],
        missing: ['Design Thinking', 'Change Management', 'Go-To-Market (GTM) Strategy'],
      },
      interviewQs: [
        { q: (role) => `How do you resolve conflicting priorities among key stakeholders as a ${role}?`, kp: ['Data-driven framework (e.g. RICE)', 'Alignment with business OKRs', 'Transparent trade-off communication'], ans: 'I evaluate initiatives using a quantitative framework tied to executive OKRs, present trade-offs transparently with data, and guide stakeholders toward consensus on maximum business value.' },
      ],
    },

    'CS (Company Secretary)': {
      verbs: ['Drafted', 'Advised', 'Ensured', 'Filed', 'Monitored', 'Reviewed', 'Liaised'],
      summaries: {
        fresher: (role, skills) => `Meticulous ${role} with rigorous training in ${skills}. Proficient in MCA e-filings, secretarial standards, and ensuring strict adherence to the Companies Act.`,
        intern: (role, skills) => `Secretarial trainee skilled in ${skills}, preparing board minutes, and managing statutory register documentation.`,
        experienced: (role, skills) => `Senior ${role} with deep command of ${skills}, SEBI compliance, and advising corporate boards on legal risk management and ethical governance.`,
      },
      defaultSkills: 'corporate governance, company law compliance, secretarial audit, regulatory filings',
      bulletPatterns: [
        { match: ['mca', 'filing', 'compliance'], out: 'Executed statutory MCA e-filings (MGT-7, AOC-4, DIR-12) with 100% adherence to Companies Act statutory deadlines.' },
        { match: ['board', 'meeting', 'minute', 'resolution'], out: 'Drafted formal board meeting notices, agendas, resolutions, and minutes compliant with Secretarial Standards (SS-1, SS-2).' },
        { match: ['register', 'share', 'transfer'], out: 'Maintained and audited statutory registers, share transfer documentation, and charge records for corporate entities.' },
      ],
      atsKeywords: {
        matched: ['Corporate Governance', 'Company Law Compliance', 'Secretarial Standards', 'MCA Filings', 'Board Resolutions', 'Due Diligence'],
        missing: ['SEBI LODR Compliance', 'Insolvency & Bankruptcy Code', 'Cross-border Regulatory Compliance'],
      },
      interviewQs: [
        { q: () => 'What is the procedure for convening and recording an extraordinary general meeting (EGM)?', kp: ['21-day clear notice or shorter consent', 'Quorum verification', 'Secretarial Standard SS-2 compliance'], ans: 'I prepare the notice with explanatory statement under Section 102, dispatch 21 clear days in advance, verify quorum at meeting commencement, and record minutes within 30 days per SS-2.' },
      ],
    },

    '_default': {
      verbs: ['Led', 'Managed', 'Delivered', 'Strategized', 'Optimized', 'Collaborated'],
      summaries: {
        fresher: (role, skills) => `Ambitious and analytical ${role} graduate with strong competency in ${skills}. Eager to drive business growth, streamline organizational workflows, and deliver measurable commercial results.`,
        intern: (role, skills) => `Business intern with practical experience in ${skills}, analytical reporting, and supporting core enterprise operations.`,
        experienced: (role, skills) => `Accomplished ${role} with proven track record in ${skills}. Experienced in operational management, driving revenue improvements, and optimizing cross-departmental collaboration.`,
      },
      defaultSkills: 'business analysis, operational planning, stakeholder communication, financial acumen',
      bulletPatterns: [
        { match: ['business', 'operation', 'process'], out: 'Analyzed core business workflows, implementing improvements that reduced operational turnaround time by 20%.' },
      ],
      atsKeywords: {
        matched: ['Business Analysis', 'Operational Planning', 'Financial Acumen', 'Project Management'],
        missing: ['KPI Optimization', 'Risk Mitigation', 'Strategic Leadership'],
      },
      interviewQs: [
        { q: (role) => `Tell me about a time you optimized a business workflow as a ${role}.`, kp: ['Bottleneck identification', 'Process change implementation', 'Measurable ROI'], ans: 'I mapped the existing process to identify redundant handoffs, automated reporting via dashboards, and reduced turnaround time by 30%.' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────
  //  SCIENCE & TECHNOLOGY
  // ─────────────────────────────────────────────────────────────
  'Science & Technology': {
    'B.Sc Computer Science': {
      verbs: ['Built', 'Programmed', 'Tested', 'Optimized', 'Implemented', 'Developed', 'Maintained'],
      summaries: {
        fresher: (role, skills) => `Technically agile ${role} graduate with solid programming fundamentals in ${skills}. Passionate about software development, algorithm optimization, and building robust digital applications.`,
        intern: (role, skills) => `Computer science intern with hands-on project experience in ${skills}, application debugging, and modern version control workflows.`,
        experienced: (role, skills) => `Skilled ${role} with strong background in ${skills}. Proven record of engineering reliable software modules, writing maintainable code, and optimizing computational performance.`,
      },
      defaultSkills: 'Python, Java, Web Development, SQL, Data Structures',
      bulletPatterns: [
        { match: ['python', 'script', 'automation'], out: 'Developed modular Python applications and automated scripts, cutting manual data processing time by 60%.' },
        { match: ['web', 'html', 'css', 'javascript'], out: 'Built interactive and responsive web interfaces using JavaScript and modern styling, ensuring cross-browser compatibility.' },
        { match: ['sql', 'database', 'query'], out: 'Designed relational database schemas and optimized SQL queries for high-throughput transactional storage.' },
      ],
      atsKeywords: {
        matched: ['Python', 'Java', 'SQL', 'Data Structures', 'Web Development', 'Git', 'Algorithms'],
        missing: ['Cloud Platforms', 'Containerization (Docker)', 'Automated Unit Testing'],
      },
      interviewQs: [
        { q: (role) => `How do you analyze the time and space complexity of an algorithm as a ${role}?`, kp: ['Big-O notation', 'Worst-case vs average-case', 'Auxiliary space trade-offs'], ans: 'I use Big-O asymptotic notation to evaluate how runtime scales with input size n, analyze nested loops or recursions, and evaluate auxiliary memory requirements against performance needs.' },
      ],
    },

    'B.Sc IT': {
      verbs: ['Configured', 'Maintained', 'Supported', 'Administered', 'Resolved', 'Implemented', 'Monitored'],
      summaries: {
        fresher: (role, skills) => `Detail-oriented ${role} graduate with foundational expertise in ${skills}. Skilled in database operations, network setup, and providing dependable IT system support.`,
        intern: (role, skills) => `IT systems intern proficient in ${skills}, technical troubleshooting, and supporting enterprise infrastructure uptime.`,
        experienced: (role, skills) => `Competent ${role} with extensive experience in ${skills}. Experienced in managing corporate network infrastructure, database administration, and rapid incident resolution.`,
      },
      defaultSkills: 'Database Management, System Administration, Networking, Cloud Basics, SQL',
      bulletPatterns: [
        { match: ['network', 'lan', 'wan', 'router'], out: 'Configured and maintained local network infrastructure, VLANs, and routers ensuring seamless connectivity and high security.' },
        { match: ['database', 'backup', 'admin'], out: 'Administered MySQL and SQL Server databases, scheduling automated backups and optimizing query indices.' },
        { match: ['support', 'ticket', 'troubleshoot'], out: 'Resolved 300+ technical IT support tickets adhering to strict SLA response times and high user satisfaction.' },
      ],
      atsKeywords: {
        matched: ['Database Management', 'System Administration', 'Network Protocols', 'SQL', 'IT Troubleshooting', 'Cloud Fundamentals'],
        missing: ['Cybersecurity Best Practices', 'Infrastructure as Code', 'ITIL Service Management'],
      },
      interviewQs: [
        { q: () => 'Explain how DNS resolution works when a user types a web address.', kp: ['Browser cache & OS hosts', 'Recursive resolver & root servers', 'Authoritative nameservers & A records'], ans: 'The browser checks cache and OS resolver, queries the recursive DNS server, traverses root and TLD servers, and queries the authoritative nameserver to obtain the corresponding IP address.' },
      ],
    },

    'BCA': {
      verbs: ['Developed', 'Built', 'Designed', 'Implemented', 'Integrated', 'Tested', 'Deployed'],
      summaries: {
        fresher: (role, skills) => `Enthusiastic ${role} graduate with practical capabilities in ${skills}. Passionate about designing dynamic web interfaces, database-backed applications, and modern user experiences.`,
        intern: (role, skills) => `Application development intern with hands-on experience in ${skills}, API integration, and front-to-back web development workflows.`,
        experienced: (role, skills) => `Accomplished ${role} with proven track record in ${skills}. Skilled in delivering end-to-end web applications, improving UI responsiveness, and integrating secure database solutions.`,
      },
      defaultSkills: 'JavaScript, Python, Web Development, Database Management, OOP',
      bulletPatterns: [
        { match: ['web', 'react', 'javascript', 'frontend'], out: 'Developed responsive frontend interfaces with modern JavaScript libraries, delivering intuitive UI and fast page load times.' },
        { match: ['backend', 'php', 'node', 'database'], out: 'Engineered backend application logic and connected relational databases to serve dynamic content securely.' },
        { match: ['project', 'fullstack', 'crud'], out: 'Built complete full-stack CRUD applications featuring authentication, role-based access control, and form validation.' },
      ],
      atsKeywords: {
        matched: ['Web Development', 'JavaScript', 'Database Management', 'Python', 'Object-Oriented Programming', 'SQL'],
        missing: ['REST API Architecture', 'Cloud Deployment', 'Version Control / Git'],
      },
      interviewQs: [
        { q: (role) => `How do you prevent SQL injection vulnerabilities in web applications as a ${role}?`, kp: ['Parameterized queries / Prepared statements', 'Input sanitization & validation', 'ORM abstraction'], ans: 'I always use parameterized queries or prepared statements, enforce server-side input validation, and use modern ORMs that automatically escape parameter values.' },
      ],
    },

    'MCA': {
      verbs: ['Architected', 'Engineered', 'Shipped', 'Deployed', 'Optimized', 'Refactored', 'Built'],
      summaries: {
        fresher: (role, skills) => `Technically proficient ${role} graduate with strong command of ${skills}. Experienced in designing full-stack software architectures, cloud deployment, and scalable backend services.`,
        intern: (role, skills) => `Software engineering post-graduate intern skilled in ${skills}, microservices integration, and test-driven development in collaborative agile teams.`,
        experienced: (role, skills) => `Seasoned ${role} with extensive background in ${skills}. Led development of high-throughput web applications, cut cloud infrastructure costs, and enforced rigorous code quality standards.`,
      },
      defaultSkills: 'Full-Stack Development, Cloud Architecture, DevOps, REST APIs, Microservices',
      bulletPatterns: [
        { match: ['fullstack', 'react', 'node', 'microservice'], out: 'Architected microservices-based full-stack web platforms with React and Node.js, supporting 100K+ monthly active users.' },
        { match: ['cloud', 'aws', 'docker', 'devops'], out: 'Containerized application components with Docker and configured automated CI/CD deployment pipelines on AWS.' },
        { match: ['database', 'performance', 'nosql', 'mongo'], out: 'Designed hybrid SQL/NoSQL database architectures, implementing connection pooling and reducing query p95 times by 40%.' },
      ],
      atsKeywords: {
        matched: ['Full-Stack Development', 'REST APIs', 'Cloud Computing', 'Database Design', 'Microservices', 'Docker', 'Agile'],
        missing: ['Kubernetes Orchestration', 'CI/CD Pipeline Automation', 'High-Level System Design'],
      },
      interviewQs: [
        { q: (role) => `How would you design a distributed caching layer for a high-traffic web application as a ${role}?`, kp: ['Cache-aside vs write-through', 'Eviction policies (LRU)', 'Cache invalidation & stampede prevention'], ans: 'I use Redis with a cache-aside strategy, configure LRU eviction, set randomized TTLs to prevent cache stampedes, and handle distributed cache misses gracefully.' },
      ],
    },

    'B.Sc Agriculture': {
      verbs: ['Researched', 'Managed', 'Implemented', 'Assessed', 'Cultivated', 'Analyzed', 'Optimized'],
      summaries: {
        fresher: (role, skills) => `Dedicated ${role} graduate with scientific training in ${skills}. Eager to apply modern agronomic practices, soil health diagnostics, and sustainable farm management techniques.`,
        intern: (role, skills) => `Agricultural field intern with hands-on experience in ${skills}, crop scouting, and conducting farmer advisory programs.`,
        experienced: (role, skills) => `Accomplished ${role} with demonstrated success in ${skills}. Proven ability to enhance crop yields, implement precision agriculture systems, and optimize commercial agribusiness operations.`,
      },
      defaultSkills: 'Agronomy, Soil Testing, Crop Management, Agri-Business, Precision Farming',
      bulletPatterns: [
        { match: ['soil', 'testing', 'nutrient'], out: 'Conducted comprehensive soil testing and nutrient profiling, delivering fertilizer recommendations that boosted crop yield by 18%.' },
        { match: ['crop', 'protection', 'pest', 'disease'], out: 'Formulated integrated pest management (IPM) protocols, reducing chemical pesticide dependency by 25% while preserving crop health.' },
        { match: ['farm', 'advisory', 'agribusiness'], out: 'Led agricultural extension workshops for 500+ local farmers on climate-resilient crop varieties and precision irrigation.' },
      ],
      atsKeywords: {
        matched: ['Agronomy', 'Soil Testing', 'Crop Management', 'Agribusiness', 'Farm Advisory', 'Precision Agriculture'],
        missing: ['GIS in Agriculture', 'Sustainable Farm Certification', 'Agricultural Supply Chain'],
      },
      interviewQs: [
        { q: () => 'How do you formulate an integrated pest management (IPM) strategy for a commercial crop?', kp: ['Economic threshold level (ETL)', 'Biological vs cultural vs chemical control', 'Resistance prevention'], ans: 'I establish economic threshold levels (ETL) through regular field scouting, prioritize cultural and biological controls, and apply targeted chemical treatments only as a last resort.' },
      ],
    },

    '_default': {
      verbs: ['Analyzed', 'Developed', 'Researched', 'Tested', 'Implemented', 'Optimized'],
      summaries: {
        fresher: (role, skills) => `Analytical ${role} graduate with strong grounding in ${skills}. Motivated to solve technological challenges, leverage computational tools, and drive innovative solutions.`,
        intern: (role, skills) => `Science and technology intern with practical project experience in ${skills} and collaborative problem solving.`,
        experienced: (role, skills) => `Results-oriented ${role} with extensive expertise in ${skills}. Skilled in applying scientific methodologies, software solutions, and continuous technical improvement.`,
      },
      defaultSkills: 'scientific analysis, software fundamentals, analytical problem solving',
      bulletPatterns: [
        { match: ['analysis', 'data', 'research'], out: 'Applied systematic scientific analysis and computational tools to evaluate experimental and technical datasets.' },
      ],
      atsKeywords: {
        matched: ['Scientific Analysis', 'Technical Problem Solving', 'Software Fundamentals', 'Data Analysis'],
        missing: ['Experimental Design', 'Research Methodology', 'Quality Control'],
      },
      interviewQs: [
        { q: (role) => `How do you approach validating a new technological solution as a ${role}?`, kp: ['Hypothesis definition', 'Controlled testing', 'Objective metric evaluation'], ans: 'I formulate testable hypotheses, set up controlled experiments with baseline comparisons, measure performance against objective KPIs, and document findings.' },
      ],
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  HELPER: resolve domain config with graceful fallback & taxonomy aliasing
// ─────────────────────────────────────────────────────────────────────────────
const FIELD_ALIASES = {
  // Medical aliases
  'Healthcare & Medical': 'Medical & Healthcare',
  'Medical & Healthcare': 'Medical & Healthcare',
  'Medical': 'Medical & Healthcare',
  'Healthcare': 'Medical & Healthcare',

  // Commerce aliases
  'Business & Management': 'Commerce & Management',
  'Commerce & Management': 'Commerce & Management',
  'Finance & Accounting': 'Commerce & Management',
  'Commerce': 'Commerce & Management',
  'Management': 'Commerce & Management',

  // Science aliases
  'Computer Science & IT': 'Science & Technology',
  'Science & Technology': 'Science & Technology',
  'Science & Research': 'Science & Technology',
  'Science': 'Science & Technology',

  // Engineering
  'Engineering': 'Engineering',
};

const SUBFIELD_ALIASES = {
  // Engineering subfields
  'CSE': 'CSE',
  'Computer Science': 'CSE',
  'Computer Engineering': 'CSE',
  'Software Development': 'CSE',
  'IT': 'IT',
  'Information Technology': 'IT',
  'DevOps & Cloud': 'IT',
  'E&TC': 'E&TC',
  'Electronics': 'E&TC',
  'Electronics & Communication': 'E&TC',
  'Mechanical': 'Mechanical',
  'Mechanical Engineering': 'Mechanical',
  'Civil': 'Civil',
  'Civil Engineering': 'Civil',
  'Electrical': 'Electrical',
  'Electrical Engineering': 'Electrical',

  // Medical subfields
  'MBBS': 'MBBS',
  'Medicine': 'MBBS',
  'MBBS / Medicine': 'MBBS',
  'BDS': 'BDS',
  'Dentistry': 'BDS',
  'B.Pharm': 'B.Pharm',
  'Pharmacy': 'B.Pharm',
  'B.Sc Nursing': 'B.Sc Nursing',
  'Nursing': 'B.Sc Nursing',

  // Commerce subfields
  'B.Com': 'B.Com',
  'CA': 'CA',
  'Chartered Accountant': 'CA',
  'BBA': 'BBA',
  'MBA': 'MBA',
  'Product Management': 'MBA',
  'Marketing & Sales': 'BBA',
  'CS': 'CS (Company Secretary)',
  'CS (Company Secretary)': 'CS (Company Secretary)',

  // Science subfields
  'B.Sc Computer Science': 'B.Sc Computer Science',
  'B.Sc CS': 'B.Sc Computer Science',
  'B.Sc IT': 'B.Sc IT',
  'BCA': 'BCA',
  'MCA': 'MCA',
  'B.Sc Agriculture': 'B.Sc Agriculture',
  'Agriculture': 'B.Sc Agriculture',
};

function getDomainConfig(field, subfield, role) {
  const resolvedField = FIELD_ALIASES[field] || field || 'Engineering';
  let resolvedSubfield = SUBFIELD_ALIASES[subfield] || subfield;

  // If subfield is missing or not provided, infer from role if possible
  if (!resolvedSubfield && role) {
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes('software') || lowerRole.includes('frontend') || lowerRole.includes('backend') || lowerRole.includes('full-stack') || lowerRole.includes('developer') || lowerRole.includes('programmer')) {
      resolvedSubfield = resolvedField === 'Science & Technology' ? 'B.Sc Computer Science' : 'CSE';
    } else if (lowerRole.includes('cloud') || lowerRole.includes('devops') || lowerRole.includes('system admin') || lowerRole.includes('network')) {
      resolvedSubfield = resolvedField === 'Science & Technology' ? 'B.Sc IT' : 'IT';
    } else if (lowerRole.includes('mechanical') || lowerRole.includes('cad') || lowerRole.includes('solidworks') || lowerRole.includes('fea')) {
      resolvedSubfield = 'Mechanical';
    } else if (lowerRole.includes('civil') || lowerRole.includes('structural') || lowerRole.includes('site engineer')) {
      resolvedSubfield = 'Civil';
    } else if (lowerRole.includes('electrical') || lowerRole.includes('plc') || lowerRole.includes('power systems')) {
      resolvedSubfield = 'Electrical';
    } else if (lowerRole.includes('doctor') || lowerRole.includes('physician') || lowerRole.includes('medical') || lowerRole.includes('clinical')) {
      resolvedSubfield = 'MBBS';
    } else if (lowerRole.includes('dental') || lowerRole.includes('dentist')) {
      resolvedSubfield = 'BDS';
    } else if (lowerRole.includes('pharmac') || lowerRole.includes('drug')) {
      resolvedSubfield = 'B.Pharm';
    } else if (lowerRole.includes('nurse') || lowerRole.includes('nursing')) {
      resolvedSubfield = 'B.Sc Nursing';
    } else if (lowerRole.includes('account') || lowerRole.includes('tax') || lowerRole.includes('audit')) {
      resolvedSubfield = 'B.Com';
    }
  }

  const fieldMap = DOMAIN_CONFIG[resolvedField];
  if (fieldMap) {
    if (resolvedSubfield && fieldMap[resolvedSubfield]) {
      return fieldMap[resolvedSubfield];
    }
    // Case-insensitive or partial match within this specific field
    const lowerSub = (resolvedSubfield || '').toLowerCase();
    const matchedKey = Object.keys(fieldMap).find((k) => k.toLowerCase() === lowerSub || k.toLowerCase().includes(lowerSub));
    if (matchedKey && fieldMap[matchedKey]) {
      return fieldMap[matchedKey];
    }
    // Field-specific default
    if (fieldMap['_default']) {
      return fieldMap['_default'];
    }
  }

  // Universal neutral fallback (never uses mechanical CAD or unrelated technical claims)
  return UNIVERSAL_DEFAULT_CONFIG;
}

// ─────────────────────────────────────────────────────────────────────────────
//  HELPER: pick field-appropriate skills from user's stored skills
//  If user's top skills look unrelated to their field, use domain defaults.
// ─────────────────────────────────────────────────────────────────────────────
function pickRelevantSkills(skills, field, subfield, cfg) {
  const stored = skills?.technical || [];

  if (stored.length > 0) {
    // Collect domain keywords from cfg
    const domainKeywords = [
      ...(cfg.atsKeywords?.matched || []),
      ...(cfg.atsKeywords?.missing || []),
      ...(cfg.defaultSkills ? cfg.defaultSkills.split(',').map((s) => s.trim()) : [])
    ].map((k) => k.toLowerCase());

    // Check if user's skills contain domain-matching skills
    const matchingSkills = stored.filter((userSkill) => {
      const lower = userSkill.toLowerCase();
      return domainKeywords.some((dk) => lower.includes(dk) || dk.includes(lower));
    });

    if (matchingSkills.length >= 2) {
      return matchingSkills.slice(0, 4).join(', ');
    }

    // Check if user skills contain obvious cross-domain mechanical pollution in a non-mechanical field
    const isMechanicalPollution = stored.some((s) => {
      const low = s.toLowerCase();
      const nonMechanicalSubfields = [
        'CSE', 'IT', 'MBBS', 'BDS', 'B.Pharm', 'B.Sc Nursing',
        'B.Com', 'CA', 'BBA', 'MBA', 'CS (Company Secretary)',
        'B.Sc Computer Science', 'B.Sc IT', 'BCA', 'MCA', 'B.Sc Agriculture'
      ];
      if (nonMechanicalSubfields.includes(subfield) || (field && field !== 'Engineering')) {
        return ['solidworks', 'ansys', 'fea', 'gd&t', 'catia', 'autocad mechanical'].includes(low);
      }
      return false;
    });

    if (!isMechanicalPollution && stored.length > 0) {
      return stored.slice(0, 4).join(', ');
    }
  }

  // User's stored skills don't match or are empty / polluted — use domain defaults
  return cfg.defaultSkills;
}

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────
export const aiService = {
  /**
   * Generates a professional summary tailored to field, subfield, career stage,
   * and actual user experience.
   */
  async generateSummary({ role, stage, skills, experience, projects: _projects, field, subfield }) {
    await delay(900);
    const cfg = getDomainConfig(field, subfield, role);
    const topSkills = pickRelevantSkills(skills, field, subfield, cfg);
    const mainRole = role || subfield || field || 'Professional';
    const stageKey = (stage === 'Student' || stage === 'Fresher') ? 'fresher'
      : stage === 'Intern' ? 'intern'
        : 'experienced';

    // Check for actual user-provided work experience
    const validExp = Array.isArray(experience)
      ? experience.filter((e) => e && e.company !== 'Tata Technologies' && (e.company?.trim() || e.role?.trim()))
      : [];

    if (stageKey === 'experienced' && validExp.length > 0) {
      const primaryExp = validExp[0];
      const comp = primaryExp.company ? ` at ${primaryExp.company}` : '';
      return `Results-driven ${mainRole} with hands-on experience${comp} and strong expertise in ${topSkills}. Proven track record in collaborating cross-functionally, optimizing workflows, and delivering measurable impact in production environments.`;
    }

    if (stageKey === 'intern' && validExp.length > 0) {
      const primaryExp = validExp[0];
      const comp = primaryExp.company ? ` at ${primaryExp.company}` : '';
      return `Motivated ${mainRole} with practical internship experience${comp} and applied skills in ${topSkills}. Eager to contribute technical diligence, collaborative problem solving, and rapid learning to forward-thinking initiatives.`;
    }

    return cfg.summaries[stageKey](mainRole, topSkills);
  },

  /**
   * Enhances a bullet point using domain-specific patterns, then generic fallback.
   */
  async enhanceBulletPoint(text, role, field, subfield) {
    await delay(750);
    const trimmed = text.trim();
    if (!trimmed) return text;
    const lower = trimmed.toLowerCase();
    const cfg = getDomainConfig(field, subfield, role);

    for (const pattern of cfg.bulletPatterns || []) {
      if (pattern.match.some((kw) => lower.includes(kw))) {
        return pattern.out;
      }
    }

    // Generic cross-field fallbacks
    if (lower.includes('website') || lower.includes('web')) {
      return 'Developed and deployed responsive web application, achieving 98% uptime and improving user engagement metrics by 30%.';
    }
    if (lower.includes('team') || lower.includes('collaborat')) {
      return 'Collaborated with cross-functional teams to deliver project milestones on time, maintaining stakeholder alignment and exceeding quality benchmarks.';
    }
    if (lower.includes('report') || lower.includes('document') || lower.includes('present')) {
      return 'Prepared comprehensive documentation and executive-level presentations summarizing project outcomes and strategic recommendations for senior leadership.';
    }

    const verb = pick(cfg.verbs || genericVerbs);
    return `${verb} ${trimmed.replace(/^(i |we |worked on |did |helped |assisted )/i, '')}, delivering measurable improvements in quality and operational efficiency.`;
  },

  /**
   * Performs dynamic ATS analysis tailored to the actual resume content, domain, and role.
   */
  async analyzeResume(resumeData, targetRole, field, subfield) {
    await delay(600);

    const cfg = getDomainConfig(field, subfield, targetRole);
    const roleLabel = targetRole || subfield || field || 'your target role';

    // 1. Evaluate Profile & Contact Info (Max 15)
    let contactScore = 0;
    const p = resumeData?.profile || {};
    if (p.fullName && p.fullName.trim().length > 2) contactScore += 3;
    if (p.email && p.email.includes('@')) contactScore += 3;
    if (p.phone && p.phone.trim().length >= 8) contactScore += 3;
    if (p.location && p.location.trim().length > 2) contactScore += 2;
    if (p.linkedin || p.portfolio || p.github) contactScore += 4;

    // 2. Evaluate Professional Summary (Max 15)
    let summaryScore = 0;
    const summary = resumeData?.careerGoal?.summary || '';
    const wordCount = summary.trim() ? summary.trim().split(/\s+/).length : 0;
    if (wordCount >= 40) summaryScore = 15;
    else if (wordCount >= 20) summaryScore = 11;
    else if (wordCount > 5) summaryScore = 6;
    else summaryScore = 0;

    // 3. Evaluate Skills (Max 25)
    let skillsScore = 0;
    const techSkills = resumeData?.skills?.technical || [];
    const softSkills = resumeData?.skills?.soft || [];
    const languages = resumeData?.skills?.languages || [];

    if (techSkills.length >= 8) skillsScore += 20;
    else if (techSkills.length >= 5) skillsScore += 16;
    else if (techSkills.length >= 3) skillsScore += 11;
    else if (techSkills.length >= 1) skillsScore += 6;

    if (softSkills.length >= 3) skillsScore += 3;
    if (languages.length >= 1) skillsScore += 2;

    // 4. Evaluate Projects (Max 25)
    let projectsScore = 0;
    const projects = resumeData?.projects || [];
    if (projects.length >= 3) projectsScore += 18;
    else if (projects.length === 2) projectsScore += 15;
    else if (projects.length === 1) projectsScore += 9;

    const hasProjectTech = projects.some((pr) => pr.technologies && pr.technologies.length > 0);
    if (hasProjectTech) projectsScore += 4;

    const hasProjectLinks = projects.some((pr) => pr.github || pr.liveUrl || pr.link);
    if (hasProjectLinks) projectsScore += 3;

    // 5. Evaluate Work Experience (Max 10)
    let experienceScore = 0;
    const experience = (resumeData?.experience || []).filter(
      (e) => e && e.company !== 'Tata Technologies' && (e.company?.trim() || e.role?.trim())
    );
    if (experience.length >= 2) experienceScore += 8;
    else if (experience.length === 1) experienceScore += 6;
    else experienceScore += 2; // fresher default

    // Check for quantifiable metrics (%, numbers) in experience and projects
    const allText = [
      summary,
      ...projects.map((pr) => `${pr.name} ${pr.description} ${(pr.keyFeatures || []).join(' ')}`),
      ...experience.map((ex) => `${ex.role} ${ex.company} ${(ex.responsibilities || []).join(' ')}`),
      ...techSkills,
    ].join(' ').toLowerCase();

    const hasMetrics = /\d+%|\d+\s*(k|m|users|requests|ms|seconds|hours|clients|reduction|increase|improvement|accuracy)/i.test(allText);
    if (hasMetrics) experienceScore += 2;

    // 6. Evaluate Education & Certifications (Max 10)
    let eduCertScore = 0;
    const education = resumeData?.education || [];
    const certs = resumeData?.certifications || [];
    if (education.length > 0 && education[0].college) eduCertScore += 6;
    if (certs.length >= 2) eduCertScore += 4;
    else if (certs.length === 1) eduCertScore += 2;

    // Total Score (out of 100)
    const rawTotal = contactScore + summaryScore + skillsScore + projectsScore + experienceScore + eduCertScore;
    const score = Math.min(98, Math.max(38, rawTotal));

    // Keyword Analysis against domain keywords
    const domainKeywordCandidates = [
      ...(cfg.atsKeywords?.matched || []),
      ...(cfg.atsKeywords?.missing || []),
      ...(cfg.defaultSkills ? cfg.defaultSkills.split(',').map((s) => s.trim()) : [])
    ];
    const uniqueDomainKeywords = Array.from(new Set(domainKeywordCandidates));

    const matchedKeywords = [];
    const missingKeywords = [];

    uniqueDomainKeywords.forEach((kw) => {
      if (allText.includes(kw.toLowerCase())) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    // Also include top user technical skills in matchedKeywords if matched
    techSkills.slice(0, 4).forEach((sk) => {
      if (!matchedKeywords.some((m) => m.toLowerCase() === sk.toLowerCase())) {
        matchedKeywords.unshift(sk);
      }
    });

    // Calculate dynamic Keyword Match percentage
    const matchRatio = uniqueDomainKeywords.length > 0
      ? (matchedKeywords.length / (matchedKeywords.length + missingKeywords.length))
      : 0.75;
    const keywordMatch = Math.min(97, Math.max(45, Math.round(matchRatio * 100)));

    // Generate Dynamic, Tailored Improvement Suggestions
    const suggestions = [];

    if (!p.linkedin && !p.portfolio && !p.github) {
      suggestions.push(`Add your LinkedIn profile or portfolio link to boost recruiter contact rate and online visibility.`);
    }

    if (techSkills.length < 5) {
      const suggestedAdditions = missingKeywords.slice(0, 3).join(', ') || 'industry-standard tools';
      suggestions.push(`Expand your technical skills for ${roleLabel}. Consider adding relevant keywords such as: ${suggestedAdditions}.`);
    }

    if (projects.length < 2) {
      suggestions.push(`Add at least 2 detailed projects showcasing hands-on experience in ${roleLabel}.`);
    }

    if (!hasMetrics) {
      suggestions.push(`Include measurable metrics (e.g. "% improvement", "reduced execution time by 30%") in your project or experience bullets to satisfy automated ATS filters.`);
    }

    if (wordCount < 20) {
      suggestions.push(`Craft a strong 2-3 sentence professional summary targeted specifically toward ${roleLabel}.`);
    }

    if (certs.length === 0) {
      suggestions.push(`Add an industry-recognized certification relevant to ${roleLabel} to enhance candidate competitiveness.`);
    }

    if (suggestions.length === 0) {
      suggestions.push(`Great resume! Maintain up-to-date project metrics and tailor your keywords to specific job descriptions.`);
    }

    // Status description
    let status = 'Needs Polish';
    if (score >= 90) status = 'Exceptional ATS Match';
    else if (score >= 80) status = 'Strong ATS Match';
    else if (score >= 65) status = 'Good ATS Match';
    else status = 'Needs Improvement';

    return {
      score,
      keywordMatch,
      suggestionsCount: suggestions.length,
      status,
      matchedKeywords: matchedKeywords.slice(0, 8),
      missingKeywords: missingKeywords.slice(0, 6),
      formattingFeedback: [
        p.linkedin || p.portfolio ? 'Clean ATS-friendly contact and portfolio links detected.' : 'Standard single-column header hierarchy.',
        projects.length > 0 ? 'Project stack tags and structured bullet points validated.' : 'Chronological format adhering to ATS parsing standards.',
        hasMetrics ? 'Quantifiable accomplishments and percentage metrics identified.' : 'Action verbs used effectively in responsibilities.',
      ],
      improvementSuggestions: suggestions.slice(0, 3),
    };
  },

  /**
   * Generates a domain-specific interview question on the fly.
   */
  async generateInterviewQuestion(role, category, field, subfield) {
    await delay(800);
    const cfg = getDomainConfig(field, subfield, role);
    const qs = cfg.interviewQs || [];

    if (qs.length === 0) {
      return {
        id: 'gen-' + Date.now(),
        category: category || 'General',
        difficulty: 'Medium',
        question: `Describe a challenging project in your ${subfield || field || 'field'} and how you overcame the obstacles.`,
        keyPoints: ['Problem identification', 'Your specific contribution', 'Quantifiable outcome'],
        suggestedAnswer: 'Use the STAR framework: Situation, Task, Action, Result with measurable metrics.',
        roleSpecific: true,
      };
    }

    const selected = pick(qs);
    return {
      id: 'gen-' + Date.now(),
      category: category || 'Technical',
      difficulty: 'Medium',
      question: selected.q(role || subfield || field || 'professional'),
      keyPoints: selected.kp,
      suggestedAnswer: selected.ans,
      roleSpecific: true,
    };
  },
};
