// ─────────────────────────────────────────────────────────────
//  ResumeAI – AI Simulation Service
//  All functions are field + subfield aware.
// ─────────────────────────────────────────────────────────────

const delay = (ms = 900) => new Promise((r) => setTimeout(r, ms));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const genericVerbs = [
  'Spearheaded', 'Architected', 'Engineered', 'Optimized', 'Formulated',
  'Synthesized', 'Orchestrated', 'Implemented', 'Revamped', 'Streamlined',
  'Delivered', 'Championed', 'Designed', 'Developed', 'Established'
];

// ── Domain configuration keyed by field → subfield ─────────────
const DOMAIN_CONFIG = {
  'Engineering': {
    'Mechanical Engineering': {
      verbs: ['Engineered','Modelled','Fabricated','Optimized','Validated','Designed','Simulated'],
      summaries: {
        fresher: (role, skills) => `Results-driven ${role} graduate with hands-on expertise in ${skills}. Proven track record in rapid prototyping, structural verification, and machine vision inspection. Adept at translating complex engineering requirements into robust, manufacturable designs while maintaining precision and standard compliance.`,
        intern: (role, skills) => `Motivated ${role} professional with practical project experience in ${skills}. Eager to leverage technical rigor in 3D modeling, stress analysis, and cross-functional design collaboration to accelerate product development cycles.`,
        experienced: (role, skills) => `Accomplished ${role} with extensive background in product design lifecycle, FEA simulation, and CAD modeling using ${skills}. Demonstrated success in optimizing mechanical assemblies, reducing material costs by up to 18%, and collaborating with fabrication teams to ensure DFM/DFA delivery.`,
      },
      defaultSkills: 'SolidWorks, AutoCAD, MATLAB',
      bulletPatterns: [
        { match: ['cad','drawing','model'], out: 'Engineered parametric 3D CAD assemblies and precision manufacturing drawings per ASME Y14.5 GD&T standards, reducing design rework by 25%.' },
        { match: ['solidworks'], out: 'Modelled high-precision mechanical components in SolidWorks, validating structural integrity with static stress FEA simulations.' },
        { match: ['defect','inspect','test'], out: 'Spearheaded automated inspection protocols, boosting defect identification accuracy to 92% and accelerating QA throughput.' },
        { match: ['team','collaborat'], out: 'Partnered cross-functionally with fabrication leads to align prototyping benchmarks and ensure strict DFM compliance.' },
      ],
      atsKeywords: {
        matched: ['SolidWorks','CAD Modelling','FEA Simulation','GD&T','Mechanical Design','AutoCAD','ANSYS'],
        missing: ['DFM/DFA','Tolerance Stack-up','Design of Experiments'],
      },
      interviewQs: [
        { q: (role) => `How do you perform tolerance stack-up analysis when preparing an assembly for mass manufacturing as a ${role}?`, kp: ['Worst-case vs RSS','Thermal expansion','Cumulative dimensional drift'], ans: 'I establish a dimensional chain between critical assembly features. For tight safety fits I use 1D WC analysis; for high-volume products I use RSS assuming Gaussian variance.' },
      ],
    },
    'Civil Engineering': {
      verbs: ['Designed','Surveyed','Estimated','Planned','Coordinated','Executed','Analyzed'],
      summaries: {
        fresher: (role, skills) => `Driven ${role} graduate with foundational expertise in ${skills}. Hands-on experience in site surveying, structural analysis, and AutoCAD drafting. Committed to delivering safe, code-compliant infrastructure projects.`,
        intern: (role, skills) => `Emerging ${role} with internship experience in ${skills}, site supervision, and quantity estimation. Skilled at translating design drawings into actionable field instructions.`,
        experienced: (role, skills) => `Senior ${role} with a strong track record in design, execution, and project management of infrastructure projects using ${skills}. Delivered multi-crore projects on time and within budget.`,
      },
      defaultSkills: 'AutoCAD, STAAD.Pro, Revit',
      bulletPatterns: [
        { match: ['survey','layout'], out: 'Conducted precise topographic surveys and site layout using Total Station, reducing rework by 15%.' },
        { match: ['design','structure','beam','column'], out: 'Designed RCC structural members per IS 456:2000, optimizing steel quantities by 12% without compromising load capacity.' },
        { match: ['estimate','bom','quantity'], out: 'Prepared detailed BOQ and cost estimates for multi-crore construction projects, ensuring accuracy within 5% of final costs.' },
        { match: ['team','site','coordinate'], out: 'Coordinated 20+ on-site workers and sub-contractors maintaining project schedule adherence above 95%.' },
      ],
      atsKeywords: {
        matched: ['AutoCAD','STAAD.Pro','Structural Design','BOQ','Site Supervision','IS Codes'],
        missing: ['Revit Structure','ETABS','RERA Compliance'],
      },
      interviewQs: [
        { q: () => 'How do you handle deviation from the construction drawing on site?', kp: ['RFI process','Consultation with design engineer','Field engineering'], ans: 'I raise an RFI immediately, document the deviation, and implement field changes only after written approval from the structural engineer.' },
      ],
    },
    'Electrical Engineering': {
      verbs: ['Designed','Tested','Commissioned','Configured','Analyzed','Integrated','Optimized'],
      summaries: {
        fresher: (role, skills) => `Driven ${role} graduate with strong foundations in ${skills}. Completed projects spanning power system design, PCB layout, and control system simulation.`,
        intern: (role, skills) => `Electrical engineering intern proficient in ${skills} with exposure to industrial automation, PLC programming, and panel wiring in live plant environments.`,
        experienced: (role, skills) => `Accomplished ${role} with expertise in ${skills}, managing end-to-end electrical design for large-scale industrial and commercial projects. Delivered solutions reducing energy consumption by 20%.`,
      },
      defaultSkills: 'AutoCAD Electrical, MATLAB, PLC, ETAP',
      bulletPatterns: [
        { match: ['plc','scada','automation'], out: 'Programmed Siemens S7-1500 PLC in Ladder Logic and SCL for automated conveyor system, reducing manual intervention by 70%.' },
        { match: ['panel','wiring','circuit'], out: 'Designed and commissioned 11kV switchgear panels per IEC 61439 standards, ensuring zero NCRs during third-party inspection.' },
        { match: ['power','load','analysis'], out: 'Performed load flow and short-circuit analysis using ETAP for a 33kV substation upgrade, ensuring protection coordination compliance.' },
      ],
      atsKeywords: {
        matched: ['AutoCAD Electrical','PLC Programming','ETAP','Power Systems','Control Systems','Panel Design'],
        missing: ['Renewable Energy Systems','Power Electronics','SCADA Integration'],
      },
      interviewQs: [
        { q: () => 'Explain how you would perform a protection coordination study for an industrial plant.', kp: ['Fault current calculation','Time-current curves','Selectivity and backup'], ans: 'I calculate maximum and minimum fault currents at each bus, plot TCC for all protective devices in ETAP, and verify selectivity such that the device closest to the fault operates first while upstream devices provide backup.' },
      ],
    },
    'Computer Engineering': {
      verbs: ['Built','Architected','Implemented','Optimized','Integrated','Deployed','Engineered'],
      summaries: {
        fresher: (role, skills) => `Technically strong ${role} with skills in ${skills}. Developed embedded systems projects and contributed to full-stack and hardware-software integration work.`,
        intern: (role, skills) => `Computer engineering intern with exposure to ${skills}, firmware development, and hardware debugging in a professional lab environment.`,
        experienced: (role, skills) => `Versatile ${role} with deep expertise in ${skills}, delivering high-performance embedded and software solutions. Led architecture decisions for IoT platforms serving 100K+ devices.`,
      },
      defaultSkills: 'C/C++, Python, FPGA, Embedded Linux, Verilog',
      bulletPatterns: [
        { match: ['embedded','firmware','microcontroller','arduino','stm32'], out: 'Developed real-time firmware for STM32 microcontroller using FreeRTOS, achieving deterministic response times under 5ms for sensor data acquisition.' },
        { match: ['fpga','verilog','vhdl'], out: 'Implemented AES-128 encryption module in Verilog on Xilinx Artix-7 FPGA, achieving 1.2 Gbps throughput with 60% LUT utilization.' },
        { match: ['iot','sensor','protocol'], out: 'Designed IoT sensor network using MQTT over LTE-M, reducing telemetry latency from 2s to 180ms while cutting power consumption by 35%.' },
      ],
      atsKeywords: {
        matched: ['Embedded Systems','C/C++','FPGA','Python','Linux','RTOS','Hardware Debugging'],
        missing: ['RISC-V Architecture','Yocto Linux Build','Functional Safety (IEC 61508)'],
      },
      interviewQs: [
        { q: (role) => `As a ${role}, how would you debug a hard fault in an ARM Cortex-M based system?`, kp: ['Fault Status Registers (SCB->HFSR)','Stack frame analysis','JTAG/SWD debugger'], ans: 'I read SCB->HFSR and SCB->CFSR to identify fault type, inspect the stacked PC at time of fault via debugger, check for stack overflow using canary patterns, and use ITM trace to replay the execution path.' },
      ],
    },
    '_default': {
      verbs: genericVerbs,
      summaries: {
        fresher: (role, skills) => `Enthusiastic ${role} graduate with strong fundamentals in ${skills}. Experienced in project-based learning, technical problem solving, and cross-disciplinary collaboration.`,
        intern: (role, skills) => `Motivated ${role} intern with applied knowledge in ${skills} and a strong aptitude for analytical and design challenges.`,
        experienced: (role, skills) => `Results-oriented ${role} with a proven record of delivering high-impact engineering solutions using ${skills}. Skilled in stakeholder management and process optimization.`,
      },
      defaultSkills: 'engineering fundamentals, technical analysis',
      bulletPatterns: [],
      atsKeywords: { matched: ['Engineering Analysis','Project Management','Technical Documentation'], missing: ['Industry Standards','Root Cause Analysis'] },
      interviewQs: [
        { q: (role) => `Describe a challenging project as a ${role} and how you overcame obstacles.`, kp: ['Problem identification','Solution design','Outcome'], ans: 'I identify the core constraint, break it into sub-tasks, iterate with stakeholders, and document lessons learned.' },
      ],
    },
  },

  'Computer Science & IT': {
    'Software Development': {
      verbs: ['Built','Architected','Shipped','Refactored','Deployed','Optimized','Integrated'],
      summaries: {
        fresher: (role, skills) => `Passionate ${role} with strong command of ${skills}. Built full-stack applications and contributed to open-source projects. Focused on clean code, scalability, and test-driven development.`,
        intern: (role, skills) => `Software engineering intern with hands-on exposure to ${skills}, REST API design, and Agile workflows. Quick learner with a keen interest in system design and performance.`,
        experienced: (role, skills) => `Seasoned ${role} with ${skills} expertise, delivering scalable microservices and cloud-native applications. Reduced system latency by 40% and shipped high-quality code in CI/CD environments.`,
      },
      defaultSkills: 'React, Node.js, Python, SQL, Docker',
      bulletPatterns: [
        { match: ['api','rest','endpoint'], out: 'Architected RESTful APIs with Node.js and Express serving 50K+ daily requests, achieving 99.9% uptime SLA.' },
        { match: ['react','frontend','ui'], out: 'Built responsive React SPA with Redux, reducing page load time by 35% via code splitting and lazy loading.' },
        { match: ['database','sql','query'], out: 'Optimized PostgreSQL queries with indexing and connection pooling, cutting p95 latency from 800ms to 120ms.' },
        { match: ['deploy','docker','ci','cd'], out: 'Containerized microservices with Docker and automated CI/CD via GitHub Actions, cutting deployment cycle from 4 hours to 18 minutes.' },
        { match: ['test','unit','jest'], out: 'Implemented comprehensive unit and integration test suites with Jest and Cypress, achieving 87% code coverage.' },
        { match: ['team','collaborat','agile'], out: 'Collaborated in a 12-engineer Scrum team; consistently delivered sprint goals with less than 5% carryover.' },
      ],
      atsKeywords: {
        matched: ['React','Node.js','REST APIs','Docker','CI/CD','Git','Agile','SQL'],
        missing: ['Kubernetes','System Design','GraphQL'],
      },
      interviewQs: [
        { q: (role) => `How would you design a URL shortener service as a ${role}?`, kp: ['Base62 hashing','Horizontal scaling','Redis caching'], ans: 'Use Base62 encoding on an auto-increment ID, store mappings in PostgreSQL, cache hot URLs in Redis with TTL, and scale the API layer horizontally behind a load balancer.' },
        { q: () => 'What strategies do you use to ensure code quality in a fast-moving environment?', kp: ['Code reviews','Automated testing','Linting pipelines'], ans: 'Mandatory PR reviews with 1 approver, ESLint/Prettier enforced via pre-commit hooks, Jest coverage gates in CI, and regular refactoring sessions.' },
      ],
    },
    'Data Science & AI': {
      verbs: ['Modeled','Trained','Analyzed','Deployed','Engineered','Benchmarked','Implemented'],
      summaries: {
        fresher: (role, skills) => `Analytically driven ${role} with expertise in ${skills}. Developed predictive models for real-world datasets and passionate about transforming raw data into actionable business intelligence.`,
        intern: (role, skills) => `Data science intern skilled in ${skills}, exploratory data analysis, and ML model training. Strong grasp of statistical learning with hands-on project experience.`,
        experienced: (role, skills) => `Senior ${role} with deep expertise in ${skills}, delivering production ML systems that drive measurable outcomes. Improved model accuracy by 22% and reduced inference latency by 60%.`,
      },
      defaultSkills: 'Python, TensorFlow, scikit-learn, SQL, Pandas',
      bulletPatterns: [
        { match: ['model','train','predict'], out: 'Trained gradient-boosting classifier on 2M+ records achieving 94.3% precision, deployed via FastAPI with sub-50ms inference.' },
        { match: ['data','clean','preprocess','pipeline'], out: 'Engineered end-to-end data pipeline processing 10GB/day, reducing missing-value rate from 12% to 0.3% using imputation strategies.' },
        { match: ['dashboard','visual','tableau','power bi'], out: 'Built interactive Tableau dashboards surfacing KPIs for C-suite, reducing manual reporting effort by 8 hours/week.' },
        { match: ['nlp','text','sentiment','bert'], out: 'Fine-tuned BERT-based NLP model on domain-specific corpus, achieving 91% F1-score on sentiment classification.' },
        { match: ['accuracy','auc','f1','metric'], out: 'Improved model AUC-ROC from 0.78 to 0.91 via feature engineering, Optuna hyperparameter tuning, and ensemble stacking.' },
      ],
      atsKeywords: {
        matched: ['Python','Machine Learning','Pandas','scikit-learn','TensorFlow','SQL','Data Visualization'],
        missing: ['MLflow','Feature Store','A/B Testing Framework'],
      },
      interviewQs: [
        { q: (role) => `As a ${role}, how would you handle severe class imbalance in a fraud detection dataset?`, kp: ['SMOTE oversampling','Class weights in loss','Precision-Recall vs AUC-ROC'], ans: 'Combine SMOTE for minority class with class-weighted cross-entropy, evaluate on Precision-Recall AUC, and tune decision threshold based on business cost of false negatives.' },
        { q: () => 'How do you validate and prevent overfitting in a production ML model?', kp: ['Train/val/test split','Cross-validation','Regularization'], ans: 'Stratified k-fold CV during training, held-out test set until final evaluation, L2 regularization and dropout, and ongoing monitoring via shadow A/B testing.' },
      ],
    },
    'Cybersecurity': {
      verbs: ['Secured','Audited','Mitigated','Hardened','Investigated','Configured','Monitored'],
      summaries: {
        fresher: (role, skills) => `Security-focused ${role} with expertise in ${skills} and hands-on CTF experience. Certified in fundamental security domains and committed to proactive threat mitigation.`,
        intern: (role, skills) => `Cybersecurity intern proficient in ${skills}, vulnerability scanning, and SIEM alert triage. Passionate about ethical hacking and defensive security.`,
        experienced: (role, skills) => `Accomplished ${role} with ${skills} background. Led Red Team exercises identifying 40+ critical vulnerabilities. Expert in threat modeling, incident response, and enterprise security architecture.`,
      },
      defaultSkills: 'Kali Linux, Nmap, Burp Suite, SIEM, Python',
      bulletPatterns: [
        { match: ['pentest','exploit','vulnerability','scan'], out: 'Conducted OWASP Top 10 penetration test across 3 web applications, identifying 14 critical vulnerabilities and delivering remediation playbooks.' },
        { match: ['siem','alert','monitor','log'], out: 'Triaged 200+ daily SIEM alerts in Splunk, reducing mean-time-to-detect (MTTD) from 4 hours to 37 minutes.' },
        { match: ['firewall','network','ips','ids'], out: 'Configured Next-Gen Firewall rules and IDS/IPS policies, blocking 98.4% of known malicious traffic patterns.' },
        { match: ['incident','response','breach','forensic'], out: 'Led incident response for a ransomware event, containing the breach within 2 hours and recovering 100% of affected data.' },
      ],
      atsKeywords: {
        matched: ['Penetration Testing','SIEM','Vulnerability Assessment','Firewalls','Incident Response','OWASP'],
        missing: ['ISO 27001','SOC 2 Compliance','Threat Intelligence Platforms'],
      },
      interviewQs: [
        { q: (role) => `As a ${role}, how do you approach a black-box web application penetration test?`, kp: ['Reconnaissance','OWASP Top 10 testing','CVSS-scored report'], ans: 'Passive recon (OSINT, Google dorks), active enumeration (directory busting, port scanning), test all OWASP Top 10, deliver report with CVSS scores and remediation steps.' },
      ],
    },
    'DevOps & Cloud': {
      verbs: ['Deployed','Automated','Orchestrated','Provisioned','Monitored','Optimized','Migrated'],
      summaries: {
        fresher: (role, skills) => `Cloud-native ${role} with expertise in ${skills}. Built CI/CD pipelines, Dockerized applications, and provisioned infrastructure with IaC tools.`,
        intern: (role, skills) => `DevOps intern skilled in ${skills}, container orchestration, and monitoring stack setup. Experience supporting production deployments in AWS/GCP environments.`,
        experienced: (role, skills) => `Seasoned ${role} with ${skills} expertise. Architected multi-region Kubernetes clusters serving 1M+ requests/day, achieved 99.99% uptime, and reduced cloud costs by 30%.`,
      },
      defaultSkills: 'Kubernetes, Docker, Terraform, AWS, CI/CD',
      bulletPatterns: [
        { match: ['kubernetes','k8s','pod','cluster'], out: 'Orchestrated 200-service microservices platform on Kubernetes (EKS), achieving zero-downtime deployments and 99.99% uptime SLA.' },
        { match: ['terraform','iac','infrastructure'], out: 'Provisioned cloud infrastructure with Terraform across 3 AWS regions, reducing manual provisioning time by 85% and enabling full IaC reproducibility.' },
        { match: ['pipeline','ci','cd','jenkins','github actions'], out: 'Built end-to-end CI/CD pipelines with GitHub Actions, reducing average deployment time from 2 hours to 12 minutes with automated rollback on failure.' },
        { match: ['monitor','alert','grafana','prometheus'], out: 'Implemented Prometheus + Grafana monitoring stack, setting 50+ SLO-based alerts that reduced MTTR from 45 minutes to 8 minutes.' },
      ],
      atsKeywords: {
        matched: ['Kubernetes','Docker','Terraform','AWS','CI/CD','Prometheus','Grafana'],
        missing: ['Service Mesh (Istio)','GitOps (ArgoCD/Flux)','FinOps / Cloud Cost Optimization'],
      },
      interviewQs: [
        { q: () => 'Explain how you would achieve zero-downtime deployment in Kubernetes.', kp: ['Rolling update strategy','Readiness probes','PodDisruptionBudget'], ans: 'Use RollingUpdate strategy with maxUnavailable=0 and maxSurge=1, configure readiness probes so traffic is only routed to healthy pods, and set PodDisruptionBudget to prevent simultaneous evictions.' },
      ],
    },
    '_default': {
      verbs: ['Built','Developed','Implemented','Deployed','Optimized','Engineered'],
      summaries: {
        fresher: (role, skills) => `Technically strong ${role} with proficiency in ${skills}. Experienced in building software solutions and solving real-world problems with code.`,
        intern: (role, skills) => `CS intern with skills in ${skills}, software development best practices, and team collaboration using Agile methodologies.`,
        experienced: (role, skills) => `Experienced ${role} with hands-on expertise in ${skills}. Delivered robust software products across multiple domains with a focus on reliability, performance, and security.`,
      },
      defaultSkills: 'programming, software development, data structures',
      bulletPatterns: [],
      atsKeywords: { matched: ['Programming','Software Development','Problem Solving','Git','Agile'], missing: ['System Design','Cloud Architecture'] },
      interviewQs: [
        { q: (role) => `Describe a technically challenging project you worked on as a ${role}.`, kp: ['Technical design decisions','Trade-offs made','Impact achieved'], ans: 'Design architecture considering trade-offs, implement incrementally with tests, and measure impact post-deployment.' },
      ],
    },
  },

  'Healthcare & Medical': {
    'MBBS / Medicine': {
      verbs: ['Diagnosed','Treated','Managed','Counseled','Assessed','Performed','Coordinated'],
      summaries: {
        fresher: (role, skills) => `Dedicated ${role} with clinical training across internal medicine, surgery, obstetrics, and pediatrics. Proficient in ${skills}. Committed to evidence-based patient care and continuous medical education.`,
        intern: (role, skills) => `Medical intern with hands-on rotational experience in high-volume OPD, casualty, and ICU settings. Skilled in ${skills}, patient history-taking, and clinical documentation.`,
        experienced: (role, skills) => `Senior ${role} with extensive experience in differential diagnosis, protocol-driven management, and clinical leadership. Expertise in ${skills} and cross-specialty collaboration in tertiary care.`,
      },
      defaultSkills: 'clinical examination, differential diagnosis, patient management',
      bulletPatterns: [
        { match: ['opd','consult','patient'], out: 'Managed 80+ OPD patients daily in a tertiary care setting, performing evidence-based history-taking, examination, and treatment planning.' },
        { match: ['diagnosis','investigate','lab'], out: 'Applied systematic clinical reasoning to diagnose complex multi-system presentations, reducing time-to-diagnosis by 30% through structured investigation protocols.' },
        { match: ['emergency','casualty','resuscitat'], out: 'Handled 30+ emergency cases daily in casualty, including ACLS-guided cardiac resuscitation and trauma triage per ATLS protocol.' },
        { match: ['counsel','education','explain'], out: 'Delivered structured patient health education sessions, improving medication adherence rates by 25% in chronic disease cohorts.' },
      ],
      atsKeywords: {
        matched: ['Clinical Examination','Patient Management','Differential Diagnosis','ACLS','EMR Documentation','OPD'],
        missing: ['NABH Standards','Telemedicine','Research Publication'],
      },
      interviewQs: [
        { q: () => 'How do you approach a patient presenting with sudden onset chest pain?', kp: ['STEMI rule-out','OLDCART history','Immediate ECG + troponin'], ans: 'Obtain 12-lead ECG and troponin immediately; give aspirin 325mg and sublingual nitro if BP allows. Take OLDCART history, review risk factors, and activate cath lab if STEMI confirmed.' },
        { q: () => 'Describe your approach to managing a patient in septic shock.', kp: ['Sepsis-3 criteria','Hour-1 bundle','Antibiotic stewardship'], ans: 'Identify septic shock by Sepsis-3. Initiate hour-1 bundle: blood cultures, broad-spectrum antibiotics, 30mL/kg IV crystalloid, vasopressors if MAP <65, lactate measurement.' },
      ],
    },
    'Nursing': {
      verbs: ['Administered','Monitored','Assessed','Educated','Coordinated','Documented','Assisted'],
      summaries: {
        fresher: (role, skills) => `Compassionate ${role} with clinical training in ${skills}. Skilled in patient assessment, medication administration, and holistic nursing care. Committed to patient safety and evidence-based practice.`,
        intern: (role, skills) => `Nursing intern with hands-on experience in ${skills}, vital sign monitoring, and wound care. Adept at collaborating with interdisciplinary teams for optimal patient outcomes.`,
        experienced: (role, skills) => `Senior ${role} with expertise in ${skills} and leadership experience in high-acuity settings. Consistently maintained patient safety standards and mentored junior nursing staff.`,
      },
      defaultSkills: 'patient assessment, medication administration, wound care',
      bulletPatterns: [
        { match: ['medication','drug','administer'], out: 'Administered medications to 20+ patients per shift following the 5 Rights framework, maintaining zero medication errors over 2 years.' },
        { match: ['vital','monitor','assess'], out: 'Monitored hemodynamic parameters for ICU patients, detecting early clinical deterioration and escalating per rapid response protocols.' },
        { match: ['wound','dress','care'], out: 'Performed advanced wound care using evidence-based dressing techniques, reducing surgical site infection rates by 18%.' },
      ],
      atsKeywords: {
        matched: ['Patient Assessment','Medication Administration','Vital Signs Monitoring','Wound Care','EMR Documentation','BLS'],
        missing: ['ACLS Certification','Critical Care Nursing','Charge Nurse Experience'],
      },
      interviewQs: [
        { q: () => 'How do you prioritize care when managing multiple critically ill patients?', kp: ['Triage by acuity','Delegation','SBAR communication'], ans: 'Triage by clinical acuity—airway, hemodynamic instability, acute pain first. Delegate appropriate tasks to nursing assistants and use SBAR to escalate concerns.' },
      ],
    },
    'Dentistry': {
      verbs: ['Performed','Diagnosed','Treated','Managed','Restored','Extracted','Counseled'],
      summaries: {
        fresher: (role, skills) => `Skilled ${role} with clinical training in ${skills}. Experienced in diagnostics, restorative procedures, and patient communication in high-volume clinical settings.`,
        intern: (role, skills) => `Dental intern proficient in ${skills}, dental radiograph interpretation, and chairside patient management under specialist supervision.`,
        experienced: (role, skills) => `Accomplished ${role} with expertise in ${skills} and a growing practice managing 25+ patients daily. Skilled in complex restorations, implant prosthetics, and patient retention strategies.`,
      },
      defaultSkills: 'dental diagnosis, restorative dentistry, oral surgery',
      bulletPatterns: [
        { match: ['patient','opd','consult'], out: 'Managed 25+ dental patients per day covering diagnostics, restorations, extractions, and preventive counseling.' },
        { match: ['implant','prosthetic','crown'], out: 'Placed and restored 50+ dental implants achieving 97% osseointegration success rate over 18-month follow-up.' },
        { match: ['root canal','endo'], out: 'Performed 100+ endodontic treatments with rotary NiTi instrumentation, reducing procedural time by 30% compared to manual technique baseline.' },
      ],
      atsKeywords: {
        matched: ['Dental Diagnosis','Restorative Dentistry','Oral Surgery','Radiograph Interpretation','Patient Management'],
        missing: ['CAD/CAM Dentistry (CEREC)','Lasers in Dentistry','Digital Smile Design'],
      },
      interviewQs: [
        { q: () => 'How do you manage a patient with severe dental anxiety?', kp: ['Tell-Show-Do technique','Anxiolysis options','Rapport building'], ans: 'I use the Tell-Show-Do technique, explain each step calmly, offer breaks on patient request, and discuss conscious sedation or nitrous oxide for high-anxiety cases after proper consent.' },
      ],
    },
    '_default': {
      verbs: ['Treated','Managed','Assessed','Coordinated','Documented','Performed'],
      summaries: {
        fresher: (role, skills) => `Dedicated healthcare professional with clinical training in ${skills}. Committed to patient-centered care and evidence-based practice.`,
        intern: (role, skills) => `Healthcare intern with practical experience in ${skills} and exposure to multidisciplinary clinical teams.`,
        experienced: (role, skills) => `Experienced ${role} with ${skills} expertise and a proven record of delivering high-quality, compassionate patient care in fast-paced clinical environments.`,
      },
      defaultSkills: 'clinical assessment, patient care, documentation',
      bulletPatterns: [],
      atsKeywords: { matched: ['Patient Care','Clinical Documentation','Evidence-Based Practice','Team Collaboration'], missing: ['Quality Improvement','NABH Standards'] },
      interviewQs: [
        { q: (role) => `As a ${role}, describe how you handle rapid patient deterioration.`, kp: ['Early warning signs','Escalation protocol','Team communication'], ans: 'Activate rapid response team, initiate ABCs, communicate via SBAR, and document actions with timestamps.' },
      ],
    },
  },

  'Business & Management': {
    'Product Management': {
      verbs: ['Launched','Roadmapped','Prioritized','Defined','Shipped','Strategized','Scaled'],
      summaries: {
        fresher: (role, skills) => `Analytically-minded ${role} with experience in ${skills}, user research, and Agile product development. Skilled at bridging user needs with business goals.`,
        intern: (role, skills) => `Product intern with skills in ${skills}, A/B testing, and cross-functional collaboration. Experienced in writing clear PRDs and working with engineering and design teams.`,
        experienced: (role, skills) => `Accomplished ${role} with a track record of ${skills}-driven product launches generating measurable revenue growth. Led 0-to-1 products and scaled features to 1M+ users.`,
      },
      defaultSkills: 'product strategy, Agile, user research, data analysis',
      bulletPatterns: [
        { match: ['launch','feature','ship','product'], out: 'Launched 3 core product features in 2 quarters, driving 28% uplift in user retention and contributing $1.2M in new ARR.' },
        { match: ['user research','interview','persona','feedback'], out: 'Conducted 40+ customer discovery interviews and synthesized insights into 5 actionable user personas that realigned the product roadmap.' },
        { match: ['a/b test','experiment','conversion'], out: 'Ran 12 A/B experiments on onboarding flow, improving conversion from signup to first activation by 34%.' },
        { match: ['roadmap','prioritiz','backlog','sprint'], out: 'Maintained 6-month product roadmap using RICE prioritization, aligning engineering, design, and sales stakeholders.' },
      ],
      atsKeywords: {
        matched: ['Product Roadmap','Agile / Scrum','User Stories','A/B Testing','KPIs','PRD','Stakeholder Management'],
        missing: ['OKR Framework','Product-led Growth (PLG)','Platform Strategy'],
      },
      interviewQs: [
        { q: (role) => `As a ${role}, how do you decide what to build next?`, kp: ['RICE scoring','Customer research','OKR alignment'], ans: 'I use RICE scoring (Reach × Impact × Confidence / Effort), validate assumptions via customer interviews and usage data, then align top picks with quarterly OKRs.' },
        { q: () => 'How do you handle stakeholder conflict about feature priority?', kp: ['Data-driven arbitration','RICE scoring','Executive escalation'], ans: 'I bring stakeholders into a structured RICE prioritization tied to OKRs. If consensus isn\'t reached, I escalate with a data-backed recommendation to the executive sponsor.' },
      ],
    },
    'Marketing & Sales': {
      verbs: ['Grew','Scaled','Launched','Optimized','Generated','Drove','Increased'],
      summaries: {
        fresher: (role, skills) => `Creative and data-driven ${role} with expertise in ${skills}. Managed social media growth campaigns delivering measurable engagement improvements.`,
        intern: (role, skills) => `Marketing intern skilled in ${skills}, content creation, and digital analytics. Experience running paid and organic campaigns on Google, Meta, and LinkedIn.`,
        experienced: (role, skills) => `Senior ${role} with extensive ${skills} expertise. Scaled brands to 100K+ followers, managed large ad budgets, and delivered 3x ROAS consistently.`,
      },
      defaultSkills: 'digital marketing, SEO, Google Analytics, Meta Ads',
      bulletPatterns: [
        { match: ['seo','organic','keyword','search'], out: 'Executed technical SEO strategy growing organic traffic from 5K to 80K monthly sessions in 8 months.' },
        { match: ['ad','campaign','paid','meta','google'], out: 'Managed Rs 45L/month Google and Meta ad campaigns achieving 3.8x ROAS through audience segmentation and creative A/B testing.' },
        { match: ['social','instagram','linkedin','follower'], out: 'Grew brand LinkedIn page from 2K to 28K followers in 6 months via data-driven content calendar and employee advocacy programs.' },
        { match: ['email','newsletter','campaign'], out: 'Designed automated email nurture sequences achieving 42% open rate and 11% CTR, converting 18% of leads to qualified opportunities.' },
      ],
      atsKeywords: {
        matched: ['SEO','Google Ads','Meta Ads','Content Marketing','Google Analytics 4','CRM','Email Marketing'],
        missing: ['Marketing Automation (HubSpot)','Product-led Growth','Attribution Modelling'],
      },
      interviewQs: [
        { q: (role) => `As a ${role}, how do you measure campaign success?`, kp: ['ROAS, CAC, LTV','Attribution model','North Star Metric'], ans: 'I define ROAS, CAC, and CTR before launch, use multi-touch attribution in GA4, and evaluate cohort LTV to ensure CAC payback period is acceptable.' },
      ],
    },
    '_default': {
      verbs: ['Led','Managed','Delivered','Strategized','Optimized','Collaborated','Scaled'],
      summaries: {
        fresher: (role, skills) => `Ambitious ${role} graduate with a strong foundation in ${skills}. Skilled at problem-solving, cross-functional collaboration, and driving business outcomes.`,
        intern: (role, skills) => `Business intern with exposure to ${skills}, data-driven decision making, and stakeholder management.`,
        experienced: (role, skills) => `Experienced ${role} with ${skills} expertise and a track record of strategic business impact, team management, and scalable process building.`,
      },
      defaultSkills: 'business analysis, strategic planning, stakeholder management',
      bulletPatterns: [],
      atsKeywords: { matched: ['Business Analysis','Strategic Planning','Stakeholder Management','Project Management'], missing: ['OKR Framework','P&L Management'] },
      interviewQs: [
        { q: (role) => `Tell me about a time you drove significant business impact as a ${role}.`, kp: ['Situation','Your specific actions','Quantifiable result'], ans: 'Use the STAR framework with specific metrics.' },
      ],
    },
  },

  'Finance & Accounting': {
    '_default': {
      verbs: ['Analyzed','Modeled','Audited','Forecasted','Reconciled','Managed','Reported'],
      summaries: {
        fresher: (role, skills) => `Analytical ${role} with expertise in ${skills} and strong foundations in financial modeling, accounting principles, and regulatory compliance.`,
        intern: (role, skills) => `Finance intern proficient in ${skills}, financial statement analysis, and Excel modeling. Exposure to valuation, budgeting, and reconciliation workflows.`,
        experienced: (role, skills) => `Accomplished ${role} with ${skills} expertise. Led audits, built DCF models for M&A transactions, and managed P&L reporting for multi-crore business units.`,
      },
      defaultSkills: 'Excel, financial modeling, accounting standards, Tally',
      bulletPatterns: [
        { match: ['model','dcf','valuation'], out: 'Built 3-statement financial model and DCF valuation for a Rs 120Cr acquisition, influencing board-level investment decision.' },
        { match: ['audit','compliance','reconcil'], out: 'Conducted statutory audit for 3 corporate clients, identifying Rs 18L in unreported liabilities and ensuring full IGAAP compliance.' },
        { match: ['budget','forecast','variance'], out: 'Led annual budgeting cycle for 4 business units, reducing forecast variance from 14% to 4% through bottom-up modeling.' },
        { match: ['tax','gst','tds','compliance'], out: 'Filed 24 GST returns and managed TDS reconciliation for 300+ vendor accounts, maintaining 100% regulatory compliance record.' },
      ],
      atsKeywords: {
        matched: ['Financial Modelling','Excel','GAAP/IFRS','Budgeting','Audit','GST','Tally'],
        missing: ['Power BI Dashboards','ERP (SAP/Oracle)','Advanced Valuation (LBO)'],
      },
      interviewQs: [
        { q: (role) => `As a ${role}, walk me through building a 3-statement financial model.`, kp: ['Assumptions sheet','IS to BS to CF linkage','Interest circularity'], ans: 'Build assumptions sheet first, then IS (revenue, COGS, EBIT), link retained earnings to balance sheet equity, and construct cash flow from IS + BS changes. Use an iteration switch for interest circularity.' },
      ],
    },
  },

  'Design & Creative': {
    'UI/UX Design': {
      verbs: ['Designed','Prototyped','Researched','Iterated','Delivered','Improved','Built'],
      summaries: {
        fresher: (role, skills) => `User-centric ${role} proficient in ${skills}. Crafted design solutions grounded in user research, usability testing, and design systems thinking.`,
        intern: (role, skills) => `UX design intern with skills in ${skills}, journey mapping, and high-fidelity prototyping. Delivered redesigns improving usability scores by 25%.`,
        experienced: (role, skills) => `Seasoned ${role} with ${skills} expertise. Led end-to-end design for 10+ shipped digital products, improving NPS by 30+ points and reducing support tickets by 40%.`,
      },
      defaultSkills: 'Figma, user research, prototyping, design systems',
      bulletPatterns: [
        { match: ['figma','wireframe','prototype'], out: 'Designed interactive high-fidelity Figma prototype (120+ screens) for fintech mobile app, validated with 15-participant usability study.' },
        { match: ['user research','interview','usability'], out: 'Conducted 20 user interviews and synthesized insights into affinity maps, identifying 3 critical pain points driving the Q2 redesign roadmap.' },
        { match: ['design system','component','library'], out: 'Built a 150-component Figma design system adopted by 8 product teams, reducing design-to-dev handoff time by 45%.' },
        { match: ['conversion','engagement','retention','metric'], out: 'Redesigned checkout flow via A/B testing, achieving 22% increase in purchase completion and 18% reduction in cart abandonment.' },
      ],
      atsKeywords: {
        matched: ['Figma','UX Research','Prototyping','Design Systems','Usability Testing','Information Architecture'],
        missing: ['Accessibility (WCAG 2.1)','Motion Design','Design Tokens'],
      },
      interviewQs: [
        { q: (role) => `As a ${role}, walk me through your design process for a new feature.`, kp: ['Double Diamond','Research methods','Testing and iteration'], ans: 'Discover (interviews, competitive analysis), Define (problem statement, personas), Develop (wireframes, prototype), Deliver (usability testing, developer handoff, success metrics).' },
      ],
    },
    '_default': {
      verbs: ['Designed','Created','Crafted','Delivered','Developed','Illustrated'],
      summaries: {
        fresher: (role, skills) => `Creative ${role} with a strong portfolio in ${skills}. Passionate about translating complex ideas into clear, beautiful visual communications.`,
        intern: (role, skills) => `Design intern with hands-on experience in ${skills}, brand identity, and creative collaboration across digital and print mediums.`,
        experienced: (role, skills) => `Accomplished ${role} with ${skills} expertise and a portfolio of brand-defining creative work. Led design strategy for campaigns reaching 5M+ impressions.`,
      },
      defaultSkills: 'Adobe Creative Suite, visual design, typography',
      bulletPatterns: [],
      atsKeywords: { matched: ['Adobe Illustrator','Photoshop','Brand Design','Typography','Color Theory'], missing: ['Motion Design','Design Systems'] },
      interviewQs: [
        { q: (role) => `How do you handle feedback that conflicts with your design vision as a ${role}?`, kp: ['Data over opinion','User testing evidence','Collaborative iteration'], ans: 'I separate personal preference from user needs, present design rationale tied to research, and incorporate valid feedback into a revised iteration tested with real users.' },
      ],
    },
  },

  'Science & Research': {
    '_default': {
      verbs: ['Investigated','Analyzed','Synthesized','Published','Developed','Collaborated','Validated'],
      summaries: {
        fresher: (role, skills) => `Research-driven scientist with expertise in ${skills}. Conducted independent projects resulting in actionable insights and academic contributions.`,
        intern: (role, skills) => `Research intern proficient in ${skills} and laboratory methodologies. Experienced in experimental design, data collection, and scientific writing.`,
        experienced: (role, skills) => `Senior researcher with deep expertise in ${skills}. Published 8 peer-reviewed papers, secured 2 research grants, and mentored graduate students in advanced experimental methodologies.`,
      },
      defaultSkills: 'experimental design, data analysis, scientific writing, MATLAB',
      bulletPatterns: [
        { match: ['publish','paper','journal','article'], out: 'Published 3 peer-reviewed articles in Q1 journals (Impact Factor >4.0), advancing state-of-the-art in the domain.' },
        { match: ['experiment','protocol','lab','test'], out: 'Designed and executed 150+ controlled experiments, reducing protocol error rate by 35% through standardized SOPs.' },
        { match: ['data','analysis','statistic','matlab'], out: 'Performed multivariate statistical analysis on 50K+ data points, identifying 4 statistically significant correlations (p<0.05).' },
        { match: ['grant','funding','proposal'], out: 'Co-authored research grant proposal awarded Rs 25L from DST-SERB for 3-year material characterization project.' },
      ],
      atsKeywords: {
        matched: ['Research Methodology','Data Analysis','Scientific Writing','MATLAB','Python','Statistical Analysis'],
        missing: ['Grant Writing','Peer Review Experience','Spectroscopy Methods'],
      },
      interviewQs: [
        { q: (role) => `As a ${role}, how do you ensure reproducibility and rigor in your research?`, kp: ['Preregistration','Lab notebooks','Statistical power analysis'], ans: 'Preregister hypotheses, maintain detailed lab notebooks, power-analyze before data collection, and share data/code on OSF for reproducibility.' },
      ],
    },
  },

  'Law': {
    '_default': {
      verbs: ['Argued','Drafted','Advised','Researched','Negotiated','Represented','Reviewed'],
      summaries: {
        fresher: (role, skills) => `Diligent ${role} with expertise in ${skills} and strong foundations in legal research, contract drafting, and moot court advocacy.`,
        intern: (role, skills) => `Legal intern proficient in ${skills}, case research via SCC/Manupatra, and drafting pleadings under senior advocate supervision.`,
        experienced: (role, skills) => `Accomplished ${role} with ${skills} expertise. Represented clients in 150+ matters across trial and appellate courts, specializing in ${skills}-related disputes.`,
      },
      defaultSkills: 'legal research, contract drafting, SCC Online, Manupatra',
      bulletPatterns: [
        { match: ['draft','contract','agreement','plead'], out: 'Drafted 40+ legal agreements including NDAs, SLAs, and employment contracts compliant with applicable statutory frameworks.' },
        { match: ['research','case law','brief','manupatra','scc'], out: 'Conducted exhaustive case law research on SCC Online and Manupatra, producing legal memoranda cited in 8 High Court proceedings.' },
        { match: ['client','counsel','advise'], out: 'Counseled 30+ corporate clients on regulatory compliance risks, enabling proactive restructuring that avoided Rs 2Cr in potential penalties.' },
        { match: ['court','hearing','argue','represent'], out: 'Appeared as junior counsel in 25+ District Court hearings, obtaining interim relief in 80% of contested injunction applications.' },
      ],
      atsKeywords: {
        matched: ['Legal Research','Contract Drafting','Litigation','SCC Online','Manupatra','Regulatory Compliance'],
        missing: ['Arbitration','Due Diligence','Data Protection Law (DPDP Act)'],
      },
      interviewQs: [
        { q: (role) => `As a ${role}, how do you approach due diligence for a corporate M&A transaction?`, kp: ['Legal, financial, tax DD','Red flag identification','Representations and warranties'], ans: 'I organize DD into streams (title, regulatory, litigation, IP, employment). Red flags are compiled into a risk matrix with mitigation recommendations.' },
      ],
    },
  },

  'Education & Teaching': {
    '_default': {
      verbs: ['Taught','Designed','Developed','Mentored','Assessed','Facilitated','Implemented'],
      summaries: {
        fresher: (role, skills) => `Passionate educator with expertise in ${skills}. Skilled in lesson planning, differentiated instruction, and creating inclusive learning environments.`,
        intern: (role, skills) => `Teaching intern with hands-on experience in ${skills}, classroom management, and curriculum adaptation for diverse learners.`,
        experienced: (role, skills) => `Accomplished ${role} with ${skills} expertise and a record of improving student outcomes by 30%. Led curriculum redesign and mentored 10+ junior educators.`,
      },
      defaultSkills: 'curriculum design, lesson planning, classroom management',
      bulletPatterns: [
        { match: ['teach','lesson','class','student'], out: 'Taught 35+ students per class using differentiated instructional strategies, improving average test scores by 22% over one academic year.' },
        { match: ['curriculum','syllabus','design','develop'], out: 'Redesigned CBSE Grade 10 Mathematics curriculum integrating real-world applications, resulting in 95% board exam pass rate.' },
        { match: ['mentor','coach','guide','support'], out: 'Mentored 15 at-risk students through personalized academic support plans, reducing dropout rate in the cohort by 40%.' },
        { match: ['technology','lms','online','digital'], out: 'Designed and delivered 30-hour online course on LMS reaching 800+ students with a 4.8/5.0 learner satisfaction rating.' },
      ],
      atsKeywords: {
        matched: ['Curriculum Design','Lesson Planning','Student Assessment','Differentiated Instruction','Classroom Management'],
        missing: ["Bloom's Taxonomy Application",'IEP Development','EdTech Integration'],
      },
      interviewQs: [
        { q: (role) => `As a ${role}, how do you address diverse learning needs in a single classroom?`, kp: ['UDL framework','Differentiated instruction','Formative assessment'], ans: 'I use UDL principles—multiple means of representation, engagement, and expression—and run weekly formative assessments to identify gaps and differentiate via tiered tasks.' },
      ],
    },
  },

  'Architecture': {
    '_default': {
      verbs: ['Designed','Planned','Coordinated','Drafted','Visualized','Modeled','Delivered'],
      summaries: {
        fresher: (role, skills) => `Creative ${role} with expertise in ${skills}. Developed architectural projects from concept to construction documentation, with a strong foundation in design principles and building codes.`,
        intern: (role, skills) => `Architecture intern proficient in ${skills}, 3D rendering, and working drawing preparation under licensed architect supervision.`,
        experienced: (role, skills) => `Senior ${role} with ${skills} expertise and a portfolio of successfully delivered residential, commercial, and institutional projects. Led design teams and managed client relationships on projects valued up to Rs 50Cr.`,
      },
      defaultSkills: 'AutoCAD, Revit, SketchUp, 3ds Max',
      bulletPatterns: [
        { match: ['design','concept','layout','plan'], out: 'Developed concept and schematic design for 5,000 sqft commercial complex, integrating sustainable passive cooling strategies reducing AC load by 22%.' },
        { match: ['revit','bim','model','3d'], out: 'Created detailed BIM model in Revit for a 15-storey residential tower, enabling clash detection that identified 120+ MEP conflicts before construction.' },
        { match: ['permit','approval','noc','drawing'], out: 'Prepared complete set of statutory drawings and obtained building permits from MCGM within 45 days, against average 90-day timeline.' },
      ],
      atsKeywords: {
        matched: ['AutoCAD','Revit','BIM','SketchUp','Building Codes','Construction Documentation'],
        missing: ['LEED/Green Building','Parametric Design (Rhino/Grasshopper)','Project Management (PMI)'],
      },
      interviewQs: [
        { q: () => 'How do you balance aesthetic vision with practical construction constraints?', kp: ['Buildability review','Structural engineer collaboration','Value engineering'], ans: 'I involve the structural engineer and contractor early in design development. I use value engineering workshops to identify cost-optimized alternatives that maintain design intent.' },
      ],
    },
  },

  'Media & Communications': {
    '_default': {
      verbs: ['Reported','Created','Produced','Edited','Launched','Grew','Published'],
      summaries: {
        fresher: (role, skills) => `Creative ${role} with expertise in ${skills}. Produced engaging content across digital and print platforms, and conducted impactful journalistic and communications work.`,
        intern: (role, skills) => `Media intern with experience in ${skills}, content production, and audience analytics. Contributed to editorial and social media teams in fast-paced environments.`,
        experienced: (role, skills) => `Accomplished ${role} with ${skills} expertise. Led editorial teams, produced campaigns reaching 10M+ impressions, and built media brands from inception to market leadership.`,
      },
      defaultSkills: 'content creation, social media, editorial writing, Adobe Suite',
      bulletPatterns: [
        { match: ['article','write','publish','story'], out: 'Published 150+ investigative and feature articles with average 50K+ page views, contributing to a 35% increase in website traffic.' },
        { match: ['social','follower','engagement','instagram'], out: 'Grew brand Instagram account from 8K to 120K followers in 10 months through strategic content calendar and influencer collaborations.' },
        { match: ['video','youtube','produce','edit'], out: 'Produced and edited 30-episode YouTube documentary series that accumulated 2M+ views and 80K+ subscribers within 6 months of launch.' },
        { match: ['pr','press','media','release'], out: 'Secured 20+ earned media placements in national publications through targeted PR outreach, generating Rs 60L equivalent media value.' },
      ],
      atsKeywords: {
        matched: ['Content Creation','Social Media Strategy','Editorial Writing','SEO','Adobe Premiere','Analytics'],
        missing: ['Podcast Production','Data Journalism','Audience Monetization Strategies'],
      },
      interviewQs: [
        { q: (role) => `As a ${role}, how do you ensure factual accuracy in a breaking news situation?`, kp: ['Source verification (2-source rule)','Fact-checking tools','Editorial review'], ans: 'I apply the two-source rule for all factual claims, use fact-checking databases (FactCheck, Snopes for viral claims), and flag uncertain information for senior editorial review before publication.' },
      ],
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  HELPER: resolve domain config with graceful fallback
// ─────────────────────────────────────────────────────────────────────────────
function getDomainConfig(field, subfield) {
  const fieldMap = DOMAIN_CONFIG[field];
  if (!fieldMap) return DOMAIN_CONFIG['Engineering']['_default'];
  return fieldMap[subfield] || fieldMap['_default'] || DOMAIN_CONFIG['Engineering']['_default'];
}

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────
export const aiService = {
  /**
   * Generates a professional summary tailored to field, subfield, and career stage.
   */
  async generateSummary({ role, stage, skills, experience, projects, field, subfield }) {
    await delay(900);
    const cfg = getDomainConfig(field, subfield);
    const topSkills = skills?.technical?.slice(0, 3)?.join(', ') || cfg.defaultSkills;
    const mainRole = role || `${subfield || field || 'Professional'}`;
    const stageKey = (stage === 'Student' || stage === 'Fresher') ? 'fresher'
      : stage === 'Intern' ? 'intern'
      : 'experienced';
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
    const cfg = getDomainConfig(field, subfield);

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
   * Performs ATS analysis with domain-specific matched/missing keywords.
   */
  async analyzeResume(resumeData, targetRole, field, subfield) {
    await delay(1100);
    const technicalSkillsCount = resumeData?.skills?.technical?.length || 0;
    const projectsCount = resumeData?.projects?.length || 0;
    const experienceCount = resumeData?.experience?.length || 0;
    const hasCert = (resumeData?.certifications?.length || 0) > 0;

    let baseScore = 75;
    if (technicalSkillsCount >= 5) baseScore += 8;
    if (projectsCount >= 2) baseScore += 7;
    if (experienceCount >= 1) baseScore += 5;
    if (hasCert) baseScore += 4;

    const score = Math.min(96, Math.max(82, baseScore));
    const keywordMatch = Math.min(94, Math.max(78, score - 4));
    const cfg = getDomainConfig(field, subfield);
    const roleLabel = targetRole || subfield || field || 'your target role';

    return {
      score,
      keywordMatch,
      suggestionsCount: 2,
      status: score >= 90 ? 'Great match!' : 'Good match',
      matchedKeywords: cfg.atsKeywords.matched,
      missingKeywords: cfg.atsKeywords.missing,
      formattingFeedback: [
        'ATS-compliant single-column header hierarchy detected.',
        'Contact info, LinkedIn, and portfolio links properly structured for parsing.',
        'Chronological order validated without career gaps.',
      ],
      improvementSuggestions: [
        `Add quantifiable metrics (e.g. "% improvement", "cost saved") to your experience bullets to strengthen ATS ranking for ${roleLabel}.`,
        `Include missing industry keywords: ${cfg.atsKeywords.missing.join(', ')} to exceed 95% ATS screening algorithms.`,
      ],
    };
  },

  /**
   * Generates a domain-specific interview question on the fly.
   */
  async generateInterviewQuestion(role, category, field, subfield) {
    await delay(800);
    const cfg = getDomainConfig(field, subfield);
    const qs = cfg.interviewQs || [];

    if (qs.length === 0) {
      return {
        id: 'gen-' + Date.now(),
        category: category || 'General',
        difficulty: 'Medium',
        question: `Describe a challenging project in your ${subfield || field || 'field'} and how you overcame the obstacles.`,
        keyPoints: ['Problem identification','Your specific contribution','Quantifiable outcome'],
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



    if (stage === 'Student' || stage === 'Fresher') {
      return `Results-driven ${mainRole} graduate with hands-on expertise in ${topSkills}. Proven track record in rapid prototyping, structural verification, and machine vision inspection. Adept at translating complex engineering requirements into robust, manufacturable designs while maintaining high precision and standard compliance.`;
    } else if (stage === 'Intern') {
      return `Motivated ${mainRole} professional with practical project experience in ${topSkills}. Eager to leverage technical rigor in 3D modeling, stress analysis, and cross-functional design collaboration to accelerate product development cycles.`;
    } else {
      return `Accomplished ${mainRole} with extensive background in product design lifecycle, FEA simulation, and CAD modeling using ${topSkills}. Demonstrated success in optimizing mechanical assemblies, reducing material costs by up to 18%, and collaborating with fabrication teams to ensure seamless DFM/DFA delivery.`;
    }
  },

  /**
   * Enhances a single bullet point into an ATS-optimized action statement
   */
  async enhanceBulletPoint(text, role = 'Mechanical Design Engineer') {
    await new Promise(r => setTimeout(r, 750));

    const trimmed = text.trim();
    if (!trimmed) return text;

    // Check common patterns
    const lower = trimmed.toLowerCase();

    if (lower.includes('website') || lower.includes('web')) {
      return 'Developed and optimized responsive web interfaces using modern frontend technologies, improving user engagement and page responsiveness.';
    }

    if (lower.includes('cad') || lower.includes('drawing') || lower.includes('model')) {
      return 'Engineered parametric 3D CAD assemblies and precision manufacturing drawings according to ASME Y14.5 GD&T standards, reducing design rework by 25%.';
    }

    if (lower.includes('solidworks') || lower.includes('part')) {
      return 'Modelled high-precision mechanical components in SolidWorks, validating structural integrity with static stress FEA simulations.';
    }

    if (lower.includes('defect') || lower.includes('inspect') || lower.includes('test')) {
      return 'Spearheaded automated inspection protocols, boosting defect identification accuracy to 92% and accelerating quality verification throughput.';
    }

    if (lower.includes('team') || lower.includes('collaborat') || lower.includes('help')) {
      return 'Partnered cross-functionally with senior engineering teams and fabrication leads to align prototyping benchmarks and ensure strict DFM compliance.';
    }

    // Default enhanced structure
    const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
    return `${randomVerb} key engineering deliverables for ${trimmed.replace(/^(i |we |worked on |did )/i, '')}, elevating system reliability and project milestone delivery.`;
  },

  /**
   * Performs ATS Analysis against target role and profile
   */
  async analyzeResume(resumeData, targetRole = 'Mechanical Design Engineer') {
    await new Promise(r => setTimeout(r, 1100));

    const technicalSkillsCount = resumeData?.skills?.technical?.length || 0;
    const projectsCount = resumeData?.projects?.length || 0;
    const experienceCount = resumeData?.experience?.length || 0;
    const hasCert = (resumeData?.certifications?.length || 0) > 0;

    let baseScore = 75;
    if (technicalSkillsCount >= 5) baseScore += 8;
    if (projectsCount >= 2) baseScore += 7;
    if (experienceCount >= 1) baseScore += 5;
    if (hasCert) baseScore += 4;

    const score = Math.min(96, Math.max(82, baseScore));
    const keywordMatch = Math.min(94, Math.max(78, score - 4));

    const roleKeywordsMap = {
      'Mechanical Design Engineer': {
        matched: ['SolidWorks', 'CAD Modelling', 'Simulation', 'Mechanical Design', 'OpenCV', 'Python', 'Quality Control', 'Documentation'],
        missing: ['FEA Analysis', 'GD&T', 'DFM/DFA'],
      },
      'CAD Engineer': {
        matched: ['AutoCAD', 'SolidWorks', '3D Modeling', 'Drafting', 'Assemblies'],
        missing: ['Parametric Design', 'BOM Management'],
      },
      'R&D Engineer': {
        matched: ['Prototyping', 'MATLAB', 'Testing', 'Python', 'Analysis'],
        missing: ['Design of Experiments (DoE)', 'Failure Analysis'],
      }
    };

    const currentMapping = roleKeywordsMap[targetRole] || roleKeywordsMap['Mechanical Design Engineer'];

    return {
      score,
      keywordMatch,
      suggestionsCount: 2,
      status: score >= 90 ? 'Great match!' : 'Good match',
      matchedKeywords: currentMapping.matched,
      missingKeywords: currentMapping.missing,
      formattingFeedback: [
        'ATS-compliant standard single-column header hierarchy detected.',
        'Contact info, LinkedIn, and GitHub links properly structured for parsing.',
        'Chronological order validated without career gaps.'
      ],
      improvementSuggestions: [
        'Incorporate quantifiable metrics (e.g. "% efficiency gained", "cost reduction") into Tata Technologies experience bullets.',
        `Include missing industry keywords: ${currentMapping.missing.join(', ')} to surpass 95% ATS screening algorithms.`
      ]
    };
  },

  /**
   * Generates a new interview question on the fly
   */
  async generateInterviewQuestion(role, category) {
    await new Promise(r => setTimeout(r, 800));

    const newQuestions = [
      {
        id: 'gen-' + Date.now(),
        category: category || 'Technical',
        difficulty: 'Medium',
        question: `How do you perform tolerance stack-up analysis when preparing an assembly for mass manufacturing as a ${role}?`,
        keyPoints: [
          'Worst-case analysis (WC) vs Statistical (RSS - Root Sum Square)',
          'Accounting for thermal expansion variations',
          'Minimizing cumulative dimensional drift across mating components'
        ],
        suggestedAnswer: 'I start by establishing a dimensional chain between the critical assembly interface features. For tight, critical safety fits I run a 1D Worst-Case tolerance stack-up. For high-volume consumer goods where worst-case would drive manufacturing costs too high, I use Root Sum of Squares (RSS) assuming normal Gaussian variance. I also ensure datum references reflect actual fixture and manufacturing clamping sequences.',
        roleSpecific: true
      },
      {
        id: 'gen-' + (Date.now() + 1),
        category: 'Role-specific',
        difficulty: 'Hard',
        question: `What steps do you take when designing parts for injection molding vs sheet metal stamping in ${role}?`,
        keyPoints: [
          'Draft angles (1-2 deg) and uniform nominal wall thickness for injection molding',
          'Bend radius and K-factor calculation for sheet metal',
          'Relief notches to prevent tearing during stamping operations'
        ],
        suggestedAnswer: 'For injection molding, I strictly design for uniform wall thickness with gentle transitions, cored-out thick sections, ribs at 60% wall thickness to prevent sink marks, and 1-2 degree draft angles. For sheet metal, I account for the material K-factor, ensure bend reliefs are placed at corners to eliminate stress fractures, and keep hole-to-edge distances at least 2x sheet thickness.',
        roleSpecific: true
      }
    ];

    return newQuestions[Math.floor(Math.random() * newQuestions.length)];
  }
};
