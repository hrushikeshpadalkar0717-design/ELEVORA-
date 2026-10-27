// ELEVORA -- Field-Aware Interview Question Bank
// Questions organized by role. Keys match role names from ROLES_BY_FIELD.

export const defaultInterviewQuestions = {

  // === COMPUTER SCIENCE & IT ===================================================

  'Frontend Developer': [
    {
      id: 'fe-1', category: 'Technical', difficulty: 'Medium', roleSpecific: true,
      question: 'Explain the difference between CSS Flexbox and Grid. When would you use each?',
      keyPoints: ['Flexbox: 1D layout (row or column)','Grid: 2D layout (rows AND columns)','Flexbox for nav bars/toolbars, Grid for page-level layouts'],
      suggestedAnswer: 'Flexbox handles one-dimensional layouts along a single axis. Grid handles two dimensions (rows and columns). Use Flexbox for components like navbars and button groups; use Grid for full page layouts and card grids where both axes matter.'
    },
    {
      id: 'fe-2', category: 'Technical', difficulty: 'Hard', roleSpecific: true,
      question: 'What are JavaScript closures and how can they cause memory leaks?',
      keyPoints: ['Closure retains access to outer scope variables after function returns','Event handlers that hold large objects can prevent garbage collection','Always remove event listeners on component unmount'],
      suggestedAnswer: 'A closure is formed when an inner function retains access to its outer scope even after the outer function returns. This is powerful for encapsulation but can cause memory leaks when closures in event listeners hold large object references that cannot be garbage-collected. Best practice: remove event listeners when components unmount.'
    },
    {
      id: 'fe-3', category: 'Technical', difficulty: 'Medium', roleSpecific: true,
      question: 'How does React reconciliation work and why is the key prop important in lists?',
      keyPoints: ['React diffs Virtual DOM trees to find minimal DOM changes','key prop identifies which list items changed/were added/removed','Avoid array index as key when list order can change'],
      suggestedAnswer: 'React uses a diffing algorithm to compare previous and new Virtual DOM trees, applying only the minimal set of DOM changes. The key prop uniquely identifies list elements, enabling React to match old and new items correctly. Without stable keys, React may unnecessarily destroy and recreate DOM nodes, causing bugs and performance issues.'
    },
    {
      id: 'fe-4', category: 'Technical', difficulty: 'Medium', roleSpecific: false,
      question: 'What are Core Web Vitals and how do you optimize for them?',
      keyPoints: ['LCP (Largest Contentful Paint) < 2.5s — optimize images, CDN','INP (Interaction to Next Paint) — reduce JS blocking time','CLS (Cumulative Layout Shift) — reserve space for images/ads'],
      suggestedAnswer: 'Core Web Vitals measure user experience. LCP (loading) is improved via lazy loading, image compression, and CDN. INP (interactivity) is improved by deferring non-critical JS and minimizing main-thread blocking. CLS (visual stability) is prevented by always setting explicit width/height on images and avoiding inserting content above existing elements dynamically.'
    },
    {
      id: 'fe-5', category: 'Behavioral', difficulty: 'Medium', roleSpecific: false,
      question: 'Tell me about a frontend feature you built that required complex state management.',
      keyPoints: ['STAR method','Choice between local state, Context, Redux, or Zustand','Trade-offs and outcome'],
      suggestedAnswer: 'For a multi-step checkout form, I needed state shared across 5 steps with back-navigation support. I chose React Context + useReducer over Redux to avoid boilerplate while still centralizing state. Each step mapped its data to a shared reducer, allowing clean navigation without re-mount issues. This reduced form abandonment by 18%.'
    },
    {
      id: 'fe-6', category: 'HR', difficulty: 'Easy', roleSpecific: false,
      question: 'How do you stay current with rapidly changing frontend technologies?',
      keyPoints: ['Official documentation and release notes','Community resources (JSConf, React Newsletter)','Side projects for hands-on learning'],
      suggestedAnswer: 'I follow official release notes for React and browser APIs, subscribe to JavaScript Weekly, and watch conference talks from JSConf and ReactConf. I maintain a personal project where I explore new features before using them in production.'
    },
    {
      id: 'fe-7', category: 'Role-specific', difficulty: 'Hard', roleSpecific: true,
      question: 'How would you implement code splitting and lazy loading in a large React application?',
      keyPoints: ['React.lazy() and Suspense for component-level splitting','Route-based splitting with dynamic imports','Analyze bundle with webpack-bundle-analyzer'],
      suggestedAnswer: 'I use React.lazy() with dynamic import() for route-level and heavy component splitting, wrapped in Suspense with a skeleton fallback. I analyze bundle composition with webpack-bundle-analyzer to identify heavy libraries and replace them with lighter alternatives or load them only when needed.'
    }
  ],

  'Backend Developer': [
    {
      id: 'be-1', category: 'Technical', difficulty: 'Medium', roleSpecific: true,
      question: 'What is the difference between REST and GraphQL? When would you choose one over the other?',
      keyPoints: ['REST: multiple endpoints, fixed response shapes, easy caching','GraphQL: single endpoint, client specifies data needs, reduces over/under-fetching','Choose GraphQL for complex nested data or multi-client APIs'],
      suggestedAnswer: 'REST uses multiple endpoints with fixed response shapes — simple, cacheable, and standardized. GraphQL uses a single endpoint where clients specify exactly the data they need, avoiding over-fetching and under-fetching. I choose GraphQL when mobile and web clients have different data needs for the same resources. I prefer REST for simple public APIs where HTTP caching and standards compliance matter more.'
    },
    {
      id: 'be-2', category: 'Technical', difficulty: 'Hard', roleSpecific: true,
      question: 'How would you design a rate-limiting system for a high-traffic public API?',
      keyPoints: ['Token bucket or sliding window counter algorithm','Redis for distributed atomic counters with TTL','Return HTTP 429 with Retry-After header'],
      suggestedAnswer: 'I would use a sliding window counter backed by Redis INCR with EXPIRE for atomic operations. Each request increments a key (user ID + time window). Exceeding the limit returns HTTP 429 with Retry-After. For burst tolerance, a token bucket algorithm allows short bursts while maintaining long-term averages. In distributed systems, Redis ensures no race conditions across multiple API instances.'
    },
    {
      id: 'be-3', category: 'Technical', difficulty: 'Hard', roleSpecific: true,
      question: 'Explain database indexing strategies and when indexes can hurt performance.',
      keyPoints: ['B-tree indexes for range queries, Hash indexes for equality','Composite index column order matters — most selective first','Indexes slow INSERT/UPDATE/DELETE and consume storage'],
      suggestedAnswer: 'Indexes create sorted data structures enabling O(log n) lookup instead of full table scans. For composite indexes, put the most selective, frequently queried column first. However, indexes slow write operations since they are updated on every INSERT/UPDATE/DELETE. I audit slow query logs using EXPLAIN ANALYZE, add only high-impact indexes, and regularly remove unused ones to minimize write overhead.'
    },
    {
      id: 'be-4', category: 'Technical', difficulty: 'Medium', roleSpecific: false,
      question: 'How do you implement secure authentication and authorization in a REST API?',
      keyPoints: ['JWT access token (short-lived) + refresh token rotation','Bcrypt for password hashing, never store plain text','Role-based access control (RBAC) middleware pattern'],
      suggestedAnswer: 'I use short-lived JWT access tokens (15 min) and longer-lived refresh tokens (7 days) with rotation — when a refresh token is used, it is invalidated and a new one issued. Passwords are hashed with bcrypt (cost factor 12+). Authorization uses RBAC middleware that checks JWT claims against a permission map before each protected route. HTTPS is mandatory; tokens are stored in httpOnly cookies to prevent XSS theft.'
    },
    {
      id: 'be-5', category: 'Behavioral', difficulty: 'Medium', roleSpecific: false,
      question: 'Describe a production incident you handled. What was your debugging process?',
      keyPoints: ['Systematic log analysis and metric correlation','Root cause identification — not just symptom treatment','Blameless post-mortem and prevention measures'],
      suggestedAnswer: 'A memory leak in a Node.js service after a deployment caused a gradual 500 error increase. I correlated log timestamps with the deployment, took heap dumps to identify the leak — an uncleaned event listener in a database connection pool. We rolled back, fixed the cleanup logic, added memory monitoring alerts, and documented the detection gap in a blameless post-mortem.'
    },
    {
      id: 'be-6', category: 'HR', difficulty: 'Easy', roleSpecific: false,
      question: 'How do you approach API versioning for backward compatibility?',
      keyPoints: ['URL path versioning (/v1/, /v2/) for discoverability','Classify breaking vs non-breaking changes','Deprecation headers (Deprecation, Sunset) and usage metrics'],
      suggestedAnswer: 'I prefer URL path versioning (/api/v1/) for discoverability. I maintain both versions during a deprecation period (6-12 months), returning Deprecation and Sunset headers. I only remove old versions after usage metrics confirm all clients have migrated. Breaking changes (field removal, type change) always increment the major version; additive changes (optional fields) do not.'
    },
    {
      id: 'be-7', category: 'Role-specific', difficulty: 'Hard', roleSpecific: true,
      question: 'How would you architect a system to handle 1 million concurrent users?',
      keyPoints: ['Stateless horizontally scalable API behind load balancer','Redis for session/cache, database read replicas + connection pooling','CDN for static assets, message queues for async processing'],
      suggestedAnswer: 'Stateless API servers behind a load balancer allow horizontal scaling. Redis manages sessions and caching so any instance can serve any request. Database reads go through read replicas with PgBouncer for connection pooling. Write-heavy operations are queued via Kafka for async processing. Static assets on CDN. Auto-scaling groups handle traffic spikes. Circuit breakers and health checks prevent cascade failures.'
    }
  ],

  'Machine Learning Engineer': [
    {
      id: 'ml-1', category: 'Technical', difficulty: 'Medium', roleSpecific: true,
      question: 'Explain the bias-variance tradeoff and how you address it in practice.',
      keyPoints: ['High bias = underfitting (model too simple)','High variance = overfitting (model memorizes noise)','Balance via cross-validation, regularization, ensemble methods'],
      suggestedAnswer: 'Bias is error from incorrect assumptions (underfitting). Variance is sensitivity to training data fluctuations (overfitting). I monitor train vs validation loss curves. High bias: add complexity or features. High variance: add regularization (L1/L2, dropout), more data, or simplify the model. Cross-validation gives a reliable generalization estimate.'
    },
    {
      id: 'ml-2', category: 'Technical', difficulty: 'Hard', roleSpecific: true,
      question: 'How do you handle class imbalance in a binary classification problem?',
      keyPoints: ['Use F1, AUC-ROC, PR curve — not accuracy','SMOTE oversampling or random undersampling','class_weight=balanced or Focal Loss for DL models'],
      suggestedAnswer: 'First I choose the right metric — accuracy is misleading with imbalanced classes. I use F1, AUC-ROC, and the precision-recall curve. Techniques: SMOTE or random oversampling of the minority class, undersampling the majority class, or setting class_weight=balanced. For deep learning, Focal Loss focuses training on hard examples. I validate with stratified k-fold to maintain class ratios across folds.'
    },
    {
      id: 'ml-3', category: 'Technical', difficulty: 'Hard', roleSpecific: true,
      question: 'How do you deploy a machine learning model to production and monitor it?',
      keyPoints: ['Containerize with Docker, serve via FastAPI REST endpoint','CI/CD pipeline for automated retraining and deployment','Monitor data drift, concept drift, and business metrics (Evidently AI, MLflow)'],
      suggestedAnswer: 'I containerize the trained model in Docker and expose it via FastAPI REST API, deployed on Kubernetes. A CI/CD pipeline triggers retraining when new data exceeds a threshold and auto-deploys if evaluation metrics improve. For monitoring, I track prediction distributions, feature drift with Evidently AI, and business metrics in Grafana. Alerts trigger investigation when drift exceeds thresholds.'
    },
    {
      id: 'ml-4', category: 'Technical', difficulty: 'Medium', roleSpecific: false,
      question: 'What is cross-validation and why is it preferred over a single train/test split?',
      keyPoints: ['K-fold trains K times on different subsets','Average metric more reliable than a single split','Stratified k-fold for classification preserves class proportions'],
      suggestedAnswer: 'Cross-validation (k-fold) splits data into k subsets. The model trains k times, each using k-1 folds for training and 1 fold for validation. The final metric is averaged across all k runs, providing a more robust generalization estimate than any single split. Stratified k-fold is essential for imbalanced classification to maintain class proportions in each fold.'
    },
    {
      id: 'ml-5', category: 'Behavioral', difficulty: 'Medium', roleSpecific: false,
      question: 'Describe an ML project where the model did not initially perform as expected. How did you debug it?',
      keyPoints: ['STAR method','Error analysis: confusion matrix, misclassified sample inspection','Feature importance analysis and data quality investigation'],
      suggestedAnswer: 'A fraud detection model showed high training accuracy but poor recall on real fraud. Error analysis revealed model bias toward the majority class. Examining misclassified fraud cases showed subtle pattern gaps. I applied SMOTE, added domain-driven feature engineering (transaction velocity, time-of-day ratios), switched to XGBoost with balanced class weights — improving recall from 42% to 78% while keeping precision above 70%.'
    },
    {
      id: 'ml-6', category: 'HR', difficulty: 'Easy', roleSpecific: false,
      question: 'What is your preferred ML framework and how do you choose between frameworks?',
      keyPoints: ['PyTorch for research/DL, sklearn for classical ML, XGBoost for tabular','TensorFlow Serving for specific production ecosystems','Framework choice driven by problem type, team, and deployment target'],
      suggestedAnswer: 'I primarily use PyTorch for deep learning due to its dynamic computation graph and research-friendly design. For tabular data and classical ML, scikit-learn and XGBoost. My choice is driven by problem type, team expertise, and deployment environment. I prioritize the tool that minimizes friction for the specific task rather than any framework loyalty.'
    },
    {
      id: 'ml-7', category: 'Role-specific', difficulty: 'Hard', roleSpecific: true,
      question: 'Explain the Transformer architecture and why it surpassed RNNs for NLP tasks.',
      keyPoints: ['Self-attention: each token attends to all others in O(n^2)','Fully parallelizable training — no sequential RNN bottleneck','Positional encodings replace recurrence for sequence order'],
      suggestedAnswer: 'Transformers use self-attention: each token computes attention weights against all other tokens, capturing long-range dependencies that RNNs miss due to vanishing gradients. Multi-head attention runs multiple attention operations in parallel for richer representations. Critically, Transformers are fully parallelizable during training — unlike RNNs which process sequences step-by-step — enabling training on massive datasets (GPT, BERT). Positional encodings inject order information.'
    }
  ],

  'Cybersecurity Analyst': [
    {
      id: 'cya-1', category: 'Technical', difficulty: 'Medium', roleSpecific: true,
      question: 'What is the CIA Triad and how does it shape security architecture decisions?',
      keyPoints: ['Confidentiality: encryption, access controls','Integrity: hashing, digital signatures, checksums','Availability: redundancy, DDoS protection, backups'],
      suggestedAnswer: 'The CIA Triad is the foundation of information security. Confidentiality ensures data is accessible only to authorized parties (AES encryption, RBAC, MFA). Integrity ensures data has not been tampered with (SHA-256 hashing, PKI signatures). Availability ensures systems are accessible when needed (HA clusters, DDoS scrubbing, backups). Security architecture involves trade-offs between these pillars — overly strict access controls may impact availability if not designed with redundancy.'
    },
    {
      id: 'cya-2', category: 'Technical', difficulty: 'Hard', roleSpecific: true,
      question: 'Walk me through investigating a suspected SQL injection attack on a web application.',
      keyPoints: ['Analyze web server, WAF, and database logs for SQL metacharacters','Identify payload patterns (UNION SELECT, OR 1=1)','Assess impact: data exfiltration, auth bypass, privilege escalation'],
      suggestedAnswer: 'I start with web server and WAF logs, filtering for anomalous query strings containing SQL metacharacters (quotes, UNION, SELECT, --). I correlate with database query logs to identify unauthorized queries or unusual data volumes. I assess impact: which tables were accessed, was auth bypassed, were admin functions executed? Immediately apply parameterized queries and WAF rules, preserve forensic evidence, document the timeline.'
    },
    {
      id: 'cya-3', category: 'Technical', difficulty: 'Medium', roleSpecific: true,
      question: 'What is the OWASP Top 10? Which vulnerabilities are most commonly exploited?',
      keyPoints: ['Injection, Broken Auth, XSS remain top risks','SSRF and misconfigurations gaining in cloud environments','Remediation: parameterized queries, MFA, output encoding, CSP headers'],
      suggestedAnswer: 'OWASP Top 10 lists the most critical web application risks. SQL Injection is mitigated by parameterized queries and ORMs. Broken Authentication is fixed with MFA, secure session management, and account lockout. XSS is prevented by output encoding and Content Security Policy headers. SSRF (increasingly critical in cloud) is mitigated by network segmentation and strict egress allowlisting.'
    },
    {
      id: 'cya-4', category: 'Technical', difficulty: 'Hard', roleSpecific: false,
      question: 'How does a SIEM system work and what patterns do you look for in SOC monitoring?',
      keyPoints: ['Aggregates logs from endpoints, network, cloud, applications','Correlation rules + UEBA for anomaly detection','Triage: focus on lateral movement, privilege escalation, C2 beaconing'],
      suggestedAnswer: 'A SIEM aggregates and normalizes logs from all sources (firewalls, EDR, cloud). Correlation rules (multiple failed logins followed by success) trigger alerts. UEBA establishes behavioral baselines and flags deviations. In SOC monitoring, I prioritize chains of events over isolated alerts: lateral movement indicators, privilege escalation attempts, C2 beacon patterns (regular outbound intervals), and impossible travel (login from two geographies within minutes).'
    },
    {
      id: 'cya-5', category: 'Behavioral', difficulty: 'Medium', roleSpecific: false,
      question: 'Describe a time you discovered a critical security vulnerability. How did you handle responsible disclosure?',
      keyPoints: ['CVSS severity assessment and impact documentation','Responsible disclosure: report privately, allow remediation time','Verify fix before any public disclosure'],
      suggestedAnswer: 'During a penetration test, I discovered an unauthenticated API endpoint exposing PII. I stopped testing to avoid further exposure, documented the vulnerability with a CVSS score (9.1 Critical) and proof-of-concept (without extracting real data), and reported privately to the security team. I provided a recommended remediation, verified the fix, and included it in the final report. I followed coordinated disclosure principles throughout.'
    },
    {
      id: 'cya-6', category: 'HR', difficulty: 'Easy', roleSpecific: false,
      question: 'How do you prioritize vulnerabilities when remediation resources are limited?',
      keyPoints: ['CVSS + EPSS (exploitability probability)','CISA KEV catalog for active exploitation','Business criticality of affected asset'],
      suggestedAnswer: 'I combine CVSS severity with EPSS (Exploit Prediction Scoring System) to estimate real-world exploit likelihood, not just theoretical impact. I cross-reference with CISA Known Exploited Vulnerabilities catalog for active exploitation. Asset criticality determines final priority — a medium vulnerability on a public-facing payment system outranks a critical one on an isolated internal server. I present a risk-ranked list in business impact language for resource allocation.'
    },
    {
      id: 'cya-7', category: 'Role-specific', difficulty: 'Hard', roleSpecific: true,
      question: 'Explain the NIST incident response lifecycle and your role at each stage.',
      keyPoints: ['Preparation, Detection, Containment, Eradication, Recovery, Post-Incident','Evidence preservation and chain of custody','Communication plan: legal, exec, affected customers'],
      suggestedAnswer: 'NIST SP 800-61: (1) Preparation — IR playbooks, tooling, communication trees ready. (2) Detection & Analysis — triage alert, confirm scope. (3) Containment — isolate affected systems while preserving forensic evidence. (4) Eradication — remove malware, patch vulnerability, reset credentials. (5) Recovery — restore from clean backups, monitor for re-infection. (6) Lessons Learned — post-mortem, update playbooks. I maintain chain of custody and coordinate with legal and communications teams throughout.'
    }
  ],

  'Data Scientist': [
    {
      id: 'dsc-1', category: 'Technical', difficulty: 'Medium', roleSpecific: true,
      question: 'Walk me through your end-to-end data science project workflow.',
      keyPoints: ['Align on business problem and measurable success metric first','EDA, feature engineering, model selection, evaluation, communication','Productionization and model handoff to engineering'],
      suggestedAnswer: 'I start by aligning with stakeholders on the business problem and defining a measurable metric (reduce churn by 15%, not maximize accuracy). Then: EDA to understand distributions and correlations. Feature engineering based on domain knowledge. Cross-validated model selection. Evaluation with appropriate metrics. I present findings in business terms and hand off the pipeline with documentation for engineering deployment.'
    },
    {
      id: 'dsc-2', category: 'Technical', difficulty: 'Hard', roleSpecific: true,
      question: 'Explain A/B testing methodology and common pitfalls to avoid.',
      keyPoints: ['Pre-calculate sample size (power, alpha, MDE)','Peeking problem: do not stop early based on interim results','Multiple comparisons inflate false positive rate (Bonferroni correction)'],
      suggestedAnswer: 'A/B testing requires pre-calculating sample size based on baseline conversion rate, minimum detectable effect, power (80%), and significance (5%). Common pitfalls: (1) Peeking — stopping early inflates false positives; use sequential testing instead. (2) Multiple comparisons — testing 20 variants at 5% alpha expects 1 false positive; apply Bonferroni or FDR correction. (3) Novelty effect — new UI gets temporary engagement boost unrelated to long-term value. (4) Sample ratio mismatch indicates assignment bias.'
    },
    {
      id: 'dsc-3', category: 'Behavioral', difficulty: 'Medium', roleSpecific: false,
      question: 'Tell me about a time your analysis directly led to a significant business decision.',
      keyPoints: ['Quantifiable business impact','How you communicated uncertainty (confidence intervals)','Translating statistical findings into actionable recommendations'],
      suggestedAnswer: 'I discovered that users completing onboarding within 3 days had 4x higher 6-month retention. I presented cohort survival curves with 95% confidence intervals to the product team. The recommendation was to optimize onboarding email timing. Post-implementation analysis showed 28% improvement in 90-day retention for the treatment cohort — translating to significant reduction in churn revenue.'
    },
    {
      id: 'dsc-4', category: 'HR', difficulty: 'Easy', roleSpecific: false,
      question: 'How do you explain complex statistical concepts to non-technical stakeholders?',
      keyPoints: ['Business language over jargon','Visualizations over tables of numbers','Lead with recommendation and impact, not methodology'],
      suggestedAnswer: 'I replace statistical terminology with business analogies. For p-values: "we are 95% confident this is a real effect, not random chance." For confidence intervals, I show a range: "the true improvement is likely between 10% and 15%." I use charts over tables and lead every presentation with the recommendation and business impact before covering methodology.'
    },
    {
      id: 'dsc-5', category: 'Role-specific', difficulty: 'Hard', roleSpecific: true,
      question: 'How do you handle missing data, and how does your approach differ by missingness mechanism?',
      keyPoints: ['MCAR: simple imputation acceptable','MAR: model-based imputation using correlated variables','MNAR: missingness is informative — consider indicator feature'],
      suggestedAnswer: 'I assess the missingness mechanism. MCAR (Missing Completely At Random): mean/median imputation is acceptable. MAR (Missing At Random): I use IterativeImputer (sklearn) or MICE, leveraging correlated variables. MNAR (Missing Not At Random) — the missingness is informative (e.g., high-income users skip income field) — I add a binary indicator feature "was_this_missing" alongside imputed values. I drop columns over 50% missing unless they are critical features, and rows only when <5% of data.'
    }
  ],

  'DevOps Engineer': [
    {
      id: 'do-1', category: 'Technical', difficulty: 'Medium', roleSpecific: true,
      question: 'Explain the difference between containers and VMs. Why use Kubernetes for container orchestration?',
      keyPoints: ['VMs include full guest OS (heavy, slow start)','Containers share host kernel (lightweight, fast startup, portable)','Kubernetes: scheduling, scaling, self-healing, rolling updates'],
      suggestedAnswer: 'VMs virtualize hardware with a full guest OS, offering strong isolation but heavy resource use. Containers share the host kernel, package only application dependencies, and start in seconds. Kubernetes adds orchestration: automatically schedules containers across nodes, horizontally scales on CPU/memory metrics, restarts failed pods (self-healing), and enables zero-downtime rolling updates. It is the standard for managing containerized workloads at scale.'
    },
    {
      id: 'do-2', category: 'Technical', difficulty: 'Hard', roleSpecific: true,
      question: 'How do you design a CI/CD pipeline for a microservices application?',
      keyPoints: ['Per-service pipelines: build, test, scan (SAST/Trivy), deploy to staging, production','Blue-green or canary deployment for zero-downtime releases','Automated rollback on error rate threshold breach'],
      suggestedAnswer: 'Each microservice has its own pipeline. On push: (1) Build Docker image, (2) Unit + integration tests, (3) SAST scan (SonarQube) and container vulnerability scan (Trivy), (4) Push to registry, (5) Deploy to staging with smoke tests, (6) Manual approval gate for production. Production uses canary deployment — gradually shifting traffic (10% → 50% → 100%) with automatic rollback if error rate exceeds threshold.'
    },
    {
      id: 'do-3', category: 'Behavioral', difficulty: 'Medium', roleSpecific: false,
      question: 'Describe a production outage you handled. How did you respond and what did you learn?',
      keyPoints: ['Incident severity classification and on-call response SLA','Systematic root cause analysis (5 Whys)','Blameless post-mortem and process improvement'],
      suggestedAnswer: 'A database connection pool exhaustion caused a P1 outage during peak traffic. I immediately increased pool size as a hot fix, declared the incident in the war room, and coordinated stakeholder communication. Root cause: a new service did not respect connection limits and was deployed without load testing. Post-mortem added connection pool monitoring, circuit breakers, and a mandatory load testing gate before production deployments.'
    },
    {
      id: 'do-4', category: 'HR', difficulty: 'Easy', roleSpecific: false,
      question: 'How do you approach infrastructure security and least-privilege access?',
      keyPoints: ['IAM roles with minimal required permissions, no hardcoded credentials','Secrets management via HashiCorp Vault or AWS Secrets Manager','Private subnets for application/database tiers, public only for load balancers'],
      suggestedAnswer: 'I follow least-privilege by default — services get IAM roles scoped to exactly the resources they need. No hardcoded credentials; secrets are stored in HashiCorp Vault or AWS Secrets Manager and injected at runtime. Network architecture uses VPCs with public subnets only for load balancers; application and database tiers are in private subnets. All infrastructure is managed as code (Terraform) with peer review and policy scanning (Checkov) before apply.'
    },
    {
      id: 'do-5', category: 'Role-specific', difficulty: 'Hard', roleSpecific: true,
      question: 'How do you implement Infrastructure as Code for a multi-environment AWS setup?',
      keyPoints: ['Terraform modules for reusable DRY infrastructure','Separate S3 remote state per environment + DynamoDB locking','Environment-specific variable files, not duplicate code'],
      suggestedAnswer: 'I use Terraform with reusable modules (VPC, ECS cluster, RDS). Each environment has its own workspace with remote state in S3 and DynamoDB locking to prevent concurrent applies. Environment-specific variables (instance sizes, replica counts) are in .tfvars files. A promotion pipeline runs terraform plan for production changes and requires manual approval. Checkov scans Terraform configurations for security policy violations before apply.'
    }
  ],

  // === ENGINEERING =============================================================

  'Mechanical Design Engineer': [
    {
      id: 'mde-1', category: 'Technical', difficulty: 'Medium', roleSpecific: true,
      question: 'What is GD&T and why is it critical in mechanical manufacturing drawings?',
      keyPoints: ['Geometric Dimensioning and Tolerancing: True Position, Perpendicularity, Flatness, Circularity','Datum reference frames and bonus tolerance with MMC','Ensures part interchangeability and reduces manufacturing scrap'],
      suggestedAnswer: 'GD&T is an international symbolic language on engineering drawings that communicates exact allowable geometry variation. Unlike coordinate tolerancing, it defines clear datum references, offers bonus tolerance with MMC (Maximum Material Condition), prevents tolerance stack-up errors, and guarantees part interchangeability in assembly — reducing manufacturing scrap and rework.'
    },
    {
      id: 'mde-2', category: 'Technical', difficulty: 'Hard', roleSpecific: true,
      question: 'How do you choose between casting, forging, and CNC machining for a structural component?',
      keyPoints: ['Production volume: casting for high volume complex shapes, forging for fatigue-critical parts','CNC for low volume, tight tolerances, or prototypes','Grain flow (forging superior for dynamic loads)'],
      suggestedAnswer: 'Selection depends on batch size, loading, and geometry. For high structural strength under cyclic fatigue, forging provides superior grain flow. For intricate internal cavities at high volumes, casting (die or sand) is cost-effective. For low batches, prototypes, or tolerances below 0.02mm, CNC machining avoids high tooling costs.'
    },
    {
      id: 'mde-3', category: 'Technical', difficulty: 'Hard', roleSpecific: true,
      question: 'Explain DFM and DFA principles and how you apply them in practice.',
      keyPoints: ['DFM: uniform wall thickness, draft angles, standardized hardware, avoid deep pockets','DFA: minimize part count, self-locating features, unidirectional top-down assembly','Poka-yoke features prevent incorrect assembly'],
      suggestedAnswer: 'DFM focuses on manufacturing simplicity: uniform wall thickness, adequate draft angles for moulded parts, avoiding features requiring special tooling, and standardizing fasteners. DFA focuses on assembly efficiency: minimize unique part count, use self-locating snap-fits and datum surfaces, design for single-direction assembly, and create obvious asymmetry to prevent orientation errors. Together they reduce total product cost and defect rate.'
    },
    {
      id: 'mde-4', category: 'Behavioral', difficulty: 'Medium', roleSpecific: false,
      question: 'Describe a situation where your initial design failed simulation or validation. How did you react?',
      keyPoints: ['STAR method: Situation, Task, Action, Result','Objectively analyze FEA stress contours rather than redesigning from scratch','Document learnings in a design review checklist'],
      suggestedAnswer: 'During a chassis design, initial FEA under torsional load showed von Mises stress exceeding yield at suspension mounting nodes. Instead of full redesign, I analyzed stress contours, identified sharp notches as stress risers, introduced gusset plates, and increased fillet radii. Re-running FEA showed 34% stress reduction and satisfied the safety factor requirement.'
    },
    {
      id: 'mde-5', category: 'HR', difficulty: 'Easy', roleSpecific: false,
      question: 'Where do you see your mechanical engineering career in the next 3-5 years?',
      keyPoints: ['End-to-end product lifecycle ownership','Technical leadership and cross-functional mentoring','Professional credentials (CSWE, Six Sigma Green Belt)'],
      suggestedAnswer: 'I aim to grow into a Lead Design Engineer responsible for complete product architectures from concept to fabrication, expand DFM/DFA expertise, and mentor junior engineers. I plan to earn senior CAD and structural simulation certifications to deepen my technical authority.'
    },
    {
      id: 'mde-6', category: 'Role-specific', difficulty: 'Hard', roleSpecific: true,
      question: 'How do you perform a tolerance stack-up analysis for a precision assembly?',
      keyPoints: ['Worst-case (WC) vs Root Sum Square (RSS) methods','Thermal expansion between mating materials','Datum reference aligned to manufacturing fixture sequence'],
      suggestedAnswer: 'I establish a dimensional chain between critical assembly interface features. For safety-critical fits I use Worst-Case analysis. For high-volume consumer products, RSS assuming Gaussian variance reduces unnecessary manufacturing cost. I account for thermal expansion of mating materials and ensure datum references reflect actual fixture sequences used in manufacturing.'
    }
  ],

  'Electrical Design Engineer': [
    {
      id: 'ede-1', category: 'Technical', difficulty: 'Medium', roleSpecific: true,
      question: 'How do you perform a load flow analysis and what does it reveal about a power system?',
      keyPoints: ['Bus voltage magnitudes and angles under steady-state conditions','Active and reactive power flows on each transmission line','Identifies overloaded lines and voltage violations'],
      suggestedAnswer: 'Load flow analysis (Newton-Raphson method in ETAP or PSS/E) solves power system equations for steady-state bus voltages, phase angles, and power flows. Results identify overloaded lines (>80% rating), buses with voltage violations (<0.95 or >1.05 pu), and reactive power shortfalls requiring capacitor bank placement or SVC installation.'
    },
    {
      id: 'ede-2', category: 'Technical', difficulty: 'Hard', roleSpecific: true,
      question: 'Explain protection coordination and how you ensure selectivity in a distribution system.',
      keyPoints: ['Device nearest the fault must operate first (selectivity)','Time-current curves (TCC) for all protective devices','Coordination margin: 0.3-0.4s between relay levels'],
      suggestedAnswer: 'Protection coordination ensures the closest device to a fault operates first while upstream devices provide backup. I plot TCC for all relays, fuses, and circuit breakers in ETAP, verifying 0.3-0.4s margins between protection levels. I check coordination holds for both maximum and minimum fault currents, and set instantaneous pickups above maximum load current including motor inrush.'
    },
    {
      id: 'ede-3', category: 'Behavioral', difficulty: 'Medium', roleSpecific: false,
      question: 'Describe a complex electrical design project and the key challenges you overcame.',
      keyPoints: ['STAR method','Technical challenge and engineering solution','Stakeholder coordination and delivery outcome'],
      suggestedAnswer: 'For a 500-bed hospital electrical design, achieving 100% uptime for critical loads was paramount. I designed three-tier redundancy: dual utility feeds with automatic transfer, UPS for life-safety loads, and generator backup. Coordinating cable routing with the structural team in seismically braced areas within budget constraints was the key challenge, delivered on time and in full compliance with NFPA 99 health care standards.'
    },
    {
      id: 'ede-4', category: 'HR', difficulty: 'Easy', roleSpecific: false,
      question: 'How do you stay current with evolving electrical standards and codes (IEC, IS, NEC)?',
      keyPoints: ['IEEE/IET membership for standard updates','Applying new code provisions in current projects','Internal design checklist updates after standard revisions'],
      suggestedAnswer: 'I maintain IEEE membership and attend their technical seminars on standard revisions. I track BIS updates for IS codes relevant to my domain. When new editions are released, I review changes, assess their impact on ongoing designs, update internal checklists, and present key changes to the design team.'
    },
    {
      id: 'ede-5', category: 'Role-specific', difficulty: 'Hard', roleSpecific: true,
      question: 'How do you design an earthing and lightning protection system for an industrial plant?',
      keyPoints: ['Soil resistivity measurement (Wenner 4-pin method)','Earthing grid for step and touch potential compliance (IEEE 80)','Lightning protection zones per IEC 62305, SPD at equipment entries'],
      suggestedAnswer: 'I conduct Wenner 4-pin soil resistivity measurement to determine electrode sizing and grid spacing. The earthing mesh is designed to keep step and touch potential below IEEE 80 limits. For lightning protection, I apply the rolling sphere method per IEC 62305 to determine air-termination placement, size down-conductors, and install surge protection devices at all equipment entries for indirect strike protection.'
    }
  ],

  'Structural Engineer': [
    {
      id: 'str-1', category: 'Technical', difficulty: 'Medium', roleSpecific: true,
      question: 'How do you design an RCC beam for a residential building per IS 456?',
      keyPoints: ['Limit State Design: ultimate strength and serviceability','Effective depth from deflection criteria; reinforce for bending and shear','Cover for durability exposure category'],
      suggestedAnswer: 'Using Limit State Method per IS 456: calculate design loads and maximum BM/SF. Select beam depth from deflection criteria (span/250). Design main steel for ultimate moment, verify against minimum and maximum reinforcement ratios. Design stirrups from shear force diagram. Check service-state deflection and crack width (<0.3mm for moderate exposure). Specify concrete cover per IS 456 Table 16 for the exposure condition.'
    },
    {
      id: 'str-2', category: 'Technical', difficulty: 'Hard', roleSpecific: true,
      question: 'What are the key considerations for designing a high-rise building for lateral loads?',
      keyPoints: ['Lateral system selection: shear walls, moment frames, outrigger-core','Wind (IS 875 Part 3) and seismic (IS 1893) force determination','Drift limits (<H/250 for wind, <0.4% for seismic), P-delta effects'],
      suggestedAnswer: 'I select lateral system based on height and aspect ratio: shear walls for mid-rise, outrigger-core for supertall. Wind loads per IS 875 Part 3 use terrain category and gust factor method for flexible buildings. Seismic design per IS 1893 uses response spectrum analysis. I verify inter-storey drift limits, torsional regularity, and P-delta effects using ETABS or SAP2000. Ductile detailing per IS 13920 is mandatory for seismic zones III-V.'
    },
    {
      id: 'str-3', category: 'Behavioral', difficulty: 'Medium', roleSpecific: false,
      question: 'How have you handled a situation where field conditions differed significantly from the design drawings?',
      keyPoints: ['Immediately stop work and document the discrepancy','Structural assessment and design modification with proper RFI','Coordination with PM and contractor to minimize schedule impact'],
      suggestedAnswer: 'During pile cap excavation, rock strata were found much shallower than the soil report indicated. I immediately stopped work, conducted supplementary borings, assessed rock bearing capacity, and redesigned the foundation to use rock anchors instead of piles. I issued a formal design revision with revised BOQ, saving 15% in foundation cost while maintaining structural safety — all within a 5-day turnaround to minimize schedule impact.'
    },
    {
      id: 'str-4', category: 'HR', difficulty: 'Easy', roleSpecific: false,
      question: 'What software tools do you use for structural analysis and design?',
      keyPoints: ['ETABS/SAP2000 for building analysis','STAAD.Pro for industrial structures','SAFE for slab and foundation design, Revit for BIM'],
      suggestedAnswer: 'I primarily use ETABS for building analysis and design — it handles response spectrum analysis, auto lateral load generation, and IS 456/1893 code checks efficiently. STAAD.Pro for industrial structures with trusses and frames. SAFE for foundation and slab analysis. Revit Structure for BIM coordination with architectural and MEP teams. I use Excel with macros for rapid preliminary design calculations.'
    },
    {
      id: 'str-5', category: 'Role-specific', difficulty: 'Hard', roleSpecific: true,
      question: 'Explain ductility and ductile detailing requirements in earthquake-resistant design.',
      keyPoints: ['Ductility allows large inelastic deformation without collapse','IS 13920 ductile detailing: confinement ties, minimum reinforcement in joints','Strong-column weak-beam principle for column safety'],
      suggestedAnswer: 'Ductility is the ability to undergo large inelastic deformations without losing load-carrying capacity, allowing structures to dissipate seismic energy without collapse. IS 13920 mandates special detailing for seismic zones III-V: closely spaced confinement ties in columns, adequate transverse reinforcement in beam-column joints, and minimum coupling beam reinforcement. The strong-column weak-beam principle ensures plastic hinges form in beams before columns, protecting the gravity load-carrying system.'
    }
  ],

  // === GENERIC / FALLBACK ======================================================

  '_generic': [
    {
      id: 'gen-1', category: 'Behavioral', difficulty: 'Easy', roleSpecific: false,
      question: 'Tell me about yourself and why you applied for this role.',
      keyPoints: ['Brief professional background (2-3 sentences)','Skills and experiences directly relevant to this role','Clear, research-based motivation for this company'],
      suggestedAnswer: 'Start with your current status (student/professional), highlight your most relevant skills and 1-2 key experiences, and connect them explicitly to this role. End with a specific reason you are drawn to this company — based on their products, culture, or mission — not a generic statement.'
    },
    {
      id: 'gen-2', category: 'HR', difficulty: 'Easy', roleSpecific: false,
      question: 'What are your greatest strengths and one area you are actively improving?',
      keyPoints: ['Strengths tied to role requirements with a specific example','Weakness framed as active improvement with measurable progress','Avoid cliches ("I work too hard")'],
      suggestedAnswer: 'Choose strengths that directly apply to the role and support them with a specific example (STAR). For the development area, be genuine and describe concrete steps you are taking — for example, improving public speaking by joining Toastmasters and volunteering for team presentations.'
    },
    {
      id: 'gen-3', category: 'Behavioral', difficulty: 'Medium', roleSpecific: false,
      question: 'Describe a time you worked in a team with conflict. How did you resolve it?',
      keyPoints: ['STAR method — describe conflict objectively (no blaming)','Active listening and perspective-taking','Outcome: preserved relationship AND delivered the project'],
      suggestedAnswer: 'Use STAR. Describe the conflict objectively, explain how you listened to understand the other perspective, the specific actions you took to resolve it (mediation, compromise, or appropriate escalation), and the positive outcome — both interpersonal resolution and project delivery.'
    },
    {
      id: 'gen-4', category: 'HR', difficulty: 'Easy', roleSpecific: false,
      question: 'Where do you see yourself in 5 years?',
      keyPoints: ['Ambition aligned with realistic growth path at this company','Specific skills/responsibilities you want to develop','Show commitment to adding increasing value, not just title progression'],
      suggestedAnswer: 'Express ambition aligned with a realistic growth path. Be specific about skills you want to build (technical depth, leadership) and types of responsibilities you want to own. Emphasize your goal to deliver increasing value to the team, not just title or compensation progression.'
    }
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// ROLE ALIAS MAP
// Maps every role name from ROLES_BY_FIELD → the key in defaultInterviewQuestions
// Roles that share a question bank are grouped together.
// ─────────────────────────────────────────────────────────────────────────────
const ROLE_ALIAS_MAP = {
  // === COMPUTER SCIENCE & IT ===
  // Frontend / UI roles
  'Frontend Developer': 'Frontend Developer',
  'UI Developer': 'Frontend Developer',
  'UX Engineer': 'Frontend Developer',
  'React Developer': 'Frontend Developer',
  'Angular Developer': 'Frontend Developer',
  'Vue.js Developer': 'Frontend Developer',
  'Web Designer': 'Frontend Developer',
  'Interaction Designer': 'Frontend Developer',
  'Motion Designer': 'Frontend Developer',

  // Backend / Database roles
  'Backend Developer': 'Backend Developer',
  'Backend Engineer': 'Backend Developer',
  'Node.js Developer': 'Backend Developer',
  'Python Developer': 'Backend Developer',
  'Java Developer': 'Backend Developer',
  'API Developer': 'Backend Developer',
  'Microservices Developer': 'Backend Developer',
  'Database Administrator (DBA)': 'Backend Developer',
  'SQL Developer': 'Backend Developer',
  'NoSQL Engineer': 'Backend Developer',
  'Data Warehouse Engineer': 'Backend Developer',
  'ETL Developer': 'Backend Developer',

  // Full-stack roles
  'Software Engineer': 'Backend Developer',
  'Full Stack Developer': 'Backend Developer',
  'Software Developer': 'Backend Developer',
  'Mobile App Developer (Android/iOS)': 'Backend Developer',
  'Game Developer': 'Backend Developer',

  // ML / Data Science roles
  'Machine Learning Engineer': 'Machine Learning Engineer',
  'Deep Learning Engineer': 'Machine Learning Engineer',
  'MLOps Engineer': 'Machine Learning Engineer',
  'NLP Engineer': 'Machine Learning Engineer',
  'Computer Vision Engineer': 'Machine Learning Engineer',
  'AI Researcher': 'Machine Learning Engineer',
  'Data Scientist': 'Data Scientist',
  'Data Analyst': 'Data Scientist',
  'Business Intelligence Analyst': 'Data Scientist',
  'Data Engineer': 'Data Scientist',

  // Cybersecurity roles
  'Cybersecurity Analyst': 'Cybersecurity Analyst',
  'Penetration Tester (Ethical Hacker)': 'Cybersecurity Analyst',
  'Security Operations Engineer (SOC)': 'Cybersecurity Analyst',
  'Cloud Security Engineer': 'Cybersecurity Analyst',
  'Vulnerability Researcher': 'Cybersecurity Analyst',
  'Incident Response Analyst': 'Cybersecurity Analyst',
  'Application Security Engineer': 'Cybersecurity Analyst',

  // DevOps roles
  'DevOps Engineer': 'DevOps Engineer',
  'Cloud Engineer (AWS/GCP/Azure)': 'DevOps Engineer',
  'Site Reliability Engineer (SRE)': 'DevOps Engineer',
  'Platform Engineer': 'DevOps Engineer',
  'Infrastructure Engineer': 'DevOps Engineer',
  'Kubernetes Engineer': 'DevOps Engineer',
  'CI/CD Engineer': 'DevOps Engineer',
  'Cloud Architect': 'DevOps Engineer',
  'Systems Administrator': 'DevOps Engineer',

  // Networking / IT Management
  'Network Engineer': 'Backend Developer',
  'Network Administrator': 'Backend Developer',
  'Wireless Engineer': 'Backend Developer',
  'IT Project Manager': 'Backend Developer',
  'IT Manager': 'Backend Developer',
  'IT Consultant': 'Backend Developer',
  'Business Analyst (IT)': 'Data Scientist',
  'ERP Consultant': 'Backend Developer',

  // === ENGINEERING ===
  // Mechanical
  'Mechanical Design Engineer': 'Mechanical Design Engineer',
  'Product Design Engineer': 'Mechanical Design Engineer',
  'CAD Engineer': 'Mechanical Design Engineer',
  'Simulation/FEA Engineer': 'Mechanical Design Engineer',
  'Manufacturing Engineer': 'Mechanical Design Engineer',
  'Automotive Engineer': 'Mechanical Design Engineer',
  'Thermal Engineer': 'Mechanical Design Engineer',
  'Robotics Engineer': 'Mechanical Design Engineer',
  'R&D Engineer': 'Mechanical Design Engineer',
  'Production Engineer': 'Mechanical Design Engineer',
  'Quality Engineer': 'Mechanical Design Engineer',
  'Process Engineer': 'Mechanical Design Engineer',

  // Electrical
  'Electrical Design Engineer': 'Electrical Design Engineer',
  'Power Systems Engineer': 'Electrical Design Engineer',
  'Control Systems Engineer': 'Electrical Design Engineer',
  'Instrumentation Engineer': 'Electrical Design Engineer',
  'Automation Engineer': 'Electrical Design Engineer',
  'High Voltage Engineer': 'Electrical Design Engineer',
  'Renewable Energy Engineer': 'Electrical Design Engineer',
  'Protection & Relay Engineer': 'Electrical Design Engineer',
  'PCB Design Engineer': 'Electrical Design Engineer',
  'Embedded Systems Engineer': 'Electrical Design Engineer',

  // Electronics
  'Electronics Design Engineer': 'Electrical Design Engineer',
  'VLSI Design Engineer': 'Electrical Design Engineer',
  'RF Engineer': 'Electrical Design Engineer',
  'Signal Processing Engineer': 'Electrical Design Engineer',
  'IoT Engineer': 'Mechanical Design Engineer',
  'Telecom Engineer': 'Electrical Design Engineer',
  'Hardware Engineer': 'Electrical Design Engineer',
  'Firmware Developer': 'Electrical Design Engineer',
  'FPGA Engineer': 'Electrical Design Engineer',
  'Systems Architect': 'Electrical Design Engineer',

  // Civil / Structural
  'Structural Engineer': 'Structural Engineer',
  'Site Engineer': 'Structural Engineer',
  'Project Manager - Construction': 'Structural Engineer',
  'Geotechnical Engineer': 'Structural Engineer',
  'Transportation Engineer': 'Structural Engineer',
  'Highway Engineer': 'Structural Engineer',
  'Urban Planner': 'Structural Engineer',
  'Quantity Surveyor': 'Structural Engineer',
  'Water Resources Engineer': 'Structural Engineer',
  'Construction Manager': 'Structural Engineer',
  'Environmental Engineer': 'Structural Engineer',

  // Aerospace
  'Aerospace Design Engineer': 'Mechanical Design Engineer',
  'Propulsion Engineer': 'Mechanical Design Engineer',
  'Avionics Engineer': 'Electrical Design Engineer',
  'Structures Engineer': 'Structural Engineer',
  'Flight Test Engineer': 'Mechanical Design Engineer',
  'Systems Engineer': 'Mechanical Design Engineer',
  'CFD Engineer': 'Mechanical Design Engineer',

  // Others
  'Biomedical Engineer': 'Mechanical Design Engineer',
  'Industrial Engineer': 'Mechanical Design Engineer',
  'Safety Engineer': 'Mechanical Design Engineer',
  'Test Engineer': 'Mechanical Design Engineer',
  'Design Engineer': 'Mechanical Design Engineer',
  'Project Engineer': 'Mechanical Design Engineer',

  // === HEALTHCARE ===
  'General Physician': '_medical',
  'Junior Resident Doctor': '_medical',
  'Medical Officer': '_medical',
  'Emergency Medicine Doctor': '_medical',
  'Public Health Doctor': '_medical',
  'Government Medical Officer': '_medical',
  'Clinical Research Associate': '_medical',
  'House Surgeon': '_medical',
  'General Surgeon': '_medical',
  'Neurosurgeon': '_medical',
  'Cardiothoracic Surgeon': '_medical',
  'Orthopedic Surgeon': '_medical',
  'Staff Nurse': '_medical',
  'ICU Nurse': '_medical',
  'Dental Surgeon': '_medical',
  'Pharmacist': '_medical',
  'Physiotherapist': '_medical',
  'Radiologist (MD/DNB)': '_medical',
};

// ─────────────────────────────────────────────────────────────────────────────
// MEDICAL / HEALTHCARE fallback questions (for roles not yet in main bank)
// ─────────────────────────────────────────────────────────────────────────────
const medicalFallback = [
  {
    id: 'med-1', category: 'Technical', difficulty: 'Medium', roleSpecific: true,
    question: 'How do you approach a patient presenting with acute chest pain?',
    keyPoints: ['Immediate ECG + troponin to rule out STEMI/NSTEMI','OLDCART history: Onset, Location, Duration, Character, Alleviating/Aggravating, Radiation, Timing','Differential: ACS, PE, aortic dissection, tension pneumothorax'],
    suggestedAnswer: 'Obtain a 12-lead ECG within 10 minutes. Give aspirin 325mg and sublingual nitrate if BP permits. Check troponin. Take a focused OLDCART history while monitoring vitals. Establish IV access and O2. Differentiate ACS, PE, aortic dissection, and tension pneumothorax clinically. Activate the cath lab immediately if STEMI is confirmed on ECG.'
  },
  {
    id: 'med-2', category: 'Technical', difficulty: 'Hard', roleSpecific: true,
    question: 'Describe your approach to managing septic shock following the Surviving Sepsis Campaign guidelines.',
    keyPoints: ['Sepsis-3 definition: life-threatening organ dysfunction from infection','Hour-1 bundle: cultures, antibiotics, 30mL/kg crystalloid, vasopressors, lactate','Reassess fluid responsiveness — avoid over-resuscitation'],
    suggestedAnswer: 'Apply Sepsis-3 definition: suspected infection + SOFA ≥2. Begin hour-1 bundle: draw blood cultures before antibiotics, start broad-spectrum antibiotics within 1 hour, initiate 30mL/kg IV crystalloid, add norepinephrine if MAP <65 despite fluids, measure serial lactate. Reassess fluid responsiveness using dynamic measures (PLR, PPV) to avoid fluid overload.'
  },
  {
    id: 'med-3', category: 'Behavioral', difficulty: 'Medium', roleSpecific: false,
    question: 'Describe a clinically challenging case you managed. What was your reasoning process?',
    keyPoints: ['STAR: Situation, Task, Action, Result','Pattern recognition vs systematic differential','Communication with seniors and multidisciplinary team'],
    suggestedAnswer: 'Choose a case that demonstrates clinical reasoning. Describe the presenting complaint, your differential diagnosis, how you prioritized investigations, your management plan, and the outcome. Emphasize communication with the team and what you learned.'
  },
  {
    id: 'med-4', category: 'HR', difficulty: 'Easy', roleSpecific: false,
    question: 'How do you ensure empathetic communication with patients and their families?',
    keyPoints: ['SPIKES protocol for breaking bad news','Acknowledge emotions before giving information','Plain language, checking understanding with teach-back'],
    suggestedAnswer: 'I use the SPIKES protocol for delivering difficult news. I always acknowledge the patient\'s emotions before proceeding with clinical information. I use plain language, avoid jargon, ask "What questions do you have?" rather than "Do you understand?", and use teach-back to confirm comprehension.'
  },
  {
    id: 'med-5', category: 'Role-specific', difficulty: 'Hard', roleSpecific: true,
    question: 'How do you clinically differentiate between Type 1 and Type 2 Respiratory Failure?',
    keyPoints: ['Type 1: PaO2 <60mmHg, PaCO2 normal/low — hypoxemia without hypercapnia (V/Q mismatch, diffusion defect)','Type 2: PaO2 <60mmHg AND PaCO2 >45mmHg — hypercapnia (alveolar hypoventilation)','ABG interpretation guides oxygen and ventilatory support strategy'],
    suggestedAnswer: 'ABG is key. Type 1 (hypoxic): low PaO2, normal or low PaCO2 — caused by V/Q mismatch (PE, pneumonia), diffusion defect (pulmonary fibrosis), or shunt. Supplemental O2 improves Type 1. Type 2 (hypercapnic): low PaO2 AND high PaCO2 — caused by alveolar hypoventilation (COPD, neuromuscular disease). High-flow O2 can worsen CO2 retention in COPD — use controlled O2 targeting SpO2 88-92%, consider NIV.'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
//  HELPER: get questions for a role with smart fallback chain
// ─────────────────────────────────────────────────────────────────────────────
export const getQuestionsForRole = (role, field = '', subfield = '') => {
  if (!role) return defaultInterviewQuestions['_generic'];

  // 1. Exact match in question bank
  if (defaultInterviewQuestions[role]) {
    return defaultInterviewQuestions[role];
  }

  // 2. Role alias mapping
  const aliasKey = ROLE_ALIAS_MAP[role];
  if (aliasKey === '_medical') return medicalFallback;
  if (aliasKey && defaultInterviewQuestions[aliasKey]) {
    return defaultInterviewQuestions[aliasKey];
  }

  // 3. Fuzzy match — partial name lookup in question bank
  const bankKeys = Object.keys(defaultInterviewQuestions).filter((k) => k !== '_generic');
  const fuzzyMatch = bankKeys.find(
    (k) => role.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(role.toLowerCase().split(' ')[0])
  );
  if (fuzzyMatch) return defaultInterviewQuestions[fuzzyMatch];

  // 4. Domain-level fallback based on field/subfield
  if (field) {
    const fieldLower = field.toLowerCase();
    if (fieldLower.includes('computer') || fieldLower.includes('it') || fieldLower.includes('software')) {
      const subfieldLower = (subfield || '').toLowerCase();
      if (subfieldLower.includes('data') || subfieldLower.includes('ai') || subfieldLower.includes('ml')) {
        return defaultInterviewQuestions['Machine Learning Engineer'];
      }
      if (subfieldLower.includes('security') || subfieldLower.includes('cyber')) {
        return defaultInterviewQuestions['Cybersecurity Analyst'];
      }
      if (subfieldLower.includes('devops') || subfieldLower.includes('cloud')) {
        return defaultInterviewQuestions['DevOps Engineer'];
      }
      if (subfieldLower.includes('frontend') || subfieldLower.includes('ui')) {
        return defaultInterviewQuestions['Frontend Developer'];
      }
      return defaultInterviewQuestions['Backend Developer'];
    }
    if (fieldLower.includes('engineering')) {
      const subfieldLower = (subfield || '').toLowerCase();
      if (subfieldLower.includes('civil') || subfieldLower.includes('struct')) {
        return defaultInterviewQuestions['Structural Engineer'];
      }
      if (subfieldLower.includes('electrical') || subfieldLower.includes('electron')) {
        return defaultInterviewQuestions['Electrical Design Engineer'];
      }
      return defaultInterviewQuestions['Mechanical Design Engineer'];
    }
    if (fieldLower.includes('healthcare') || fieldLower.includes('medical')) {
      return medicalFallback;
    }
    if (fieldLower.includes('data') || fieldLower.includes('science')) {
      return defaultInterviewQuestions['Data Scientist'];
    }
  }

  // 5. Last resort: generic questions
  return defaultInterviewQuestions['_generic'];
};

