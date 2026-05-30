export const siteConfig = {
  name: "Cesar Augusto Nogueira",
  firstName: "Cesar",
  role: "Principal Cloud Architect · Platform Engineering · DevOps · FinOps · AI Infrastructure",
  shortRole: "Principal Cloud Architect & FinOps Consultant",
  tagline:
    "One of the strongest Cloud, Platform, DevOps & FinOps consultants available remotely in Europe.",
  description:
    "Principal Cloud Architect and FinOps consultant with 10+ years building, automating and optimizing enterprise-scale multi-cloud platforms across GCP, AWS and Azure. Available for international projects.",
  url: "https://cesarnogueira.tech",
  location: "Vila Real, Portugal · Remote (Europe / Worldwide)",
  availability: "Available for international projects",
  responseTime: "Usually replies within 24h",
  company: "UP2CLOUD",
  keywords: [
    "Cloud Architecture",
    "Platform Engineering",
    "DevOps",
    "FinOps",
    "AI Infrastructure",
    "Google Cloud",
    "AWS",
    "Azure",
    "Kubernetes",
    "Terraform",
    "Cloud Cost Optimization",
  ],
  knowsAbout: [
    "Google Cloud Platform",
    "AWS",
    "Azure",
    "Kubernetes",
    "Terraform",
    "Platform Engineering",
    "FinOps",
    "DevOps",
    "CI/CD",
    "Observability",
    "AI Infrastructure",
  ],
  links: {
    linkedin: "https://www.linkedin.com/in/cesarnog/",
    github: "https://github.com/cesarnog",
    x: "https://x.com/cesarnog_eu",
    email: "cesarnogueira1210@gmail.com",
    phone: "+351937471554",
    phoneDisplay: "+351 937 471 554",
    cv: "https://cesarnogueira.tech/curriculum/CV_CesarANogueira_Cloud_EN_US.pdf",
    calendar: "mailto:cesarnogueira1210@gmail.com?subject=Project%20Briefing",
  },
};

/** Animated KPI counters for the hero / stats strip. */
export const stats = [
  { label: "Years in Tech", value: 10, suffix: "+", accent: "blue" },
  { label: "Cloud Projects", value: 40, suffix: "+", accent: "cyan" },
  { label: "Certifications", value: 5, suffix: "", accent: "blue" },
  { label: "Cost Savings Generated", value: 2.5, suffix: "M+", prefix: "$", decimals: 1, accent: "orange" },
] as const;

/** Terminal boot sequence for the Identity Console hero. */
export const bootSequence = [
  "Initializing Cloud Infrastructure...",
  "Loading Expertise Matrix...",
];

export const expertiseMatrix = [
  "Google Cloud Platform",
  "AWS",
  "Azure",
  "Kubernetes",
  "Terraform",
  "FinOps",
  "AI Systems",
];

/** Interactive career timeline — real history from the resume. */
export const experience = [
  {
    company: "UP2CLOUD",
    role: "Founder · IT & Cloud Consultant",
    period: "Aug 2025 — Present",
    location: "Portugal · International",
    summary:
      "Independent B2B consultancy delivering cloud infrastructure, automation, DevOps and data engineering for global clients. End-to-end modernization, cloud cost optimization and secure scaling.",
    tech: ["GCP", "AWS", "Azure", "Terraform", "FinOps", "CI/CD", "Data Engineering"],
    impact: ["End-to-end cloud architecture for international clients", "FinOps & data-pipeline automation"],
  },
  {
    company: "Randstad Digital Portugal",
    role: "Cloud FinOps Automation Engineer",
    period: "Feb 2022 — Aug 2025",
    location: "Portugal",
    summary:
      "Drove cloud cost efficiency and operational excellence across Randstad's global operations using Python, Google/AWS/Azure APIs, CloudBees CI/CD and CloudHealth (VMware).",
    tech: ["Python", "GCP", "AWS", "Azure", "CloudBees", "CloudHealth", "FinOps"],
    impact: [
      "Automated cost reporting & resource tagging at scale",
      "Multi-cloud API integration for analytics & decisions",
      "CI/CD pipeline creation and management",
    ],
  },
  {
    company: "ZeroLight",
    role: "DevOps Engineer",
    period: "Aug 2021 — Feb 2022",
    location: "Remote",
    summary:
      "Built and managed cloud infrastructure for automotive-industry clients — scalable, resilient, cost-efficient multi-cloud (AWS, GCP) solutions enhancing operational agility.",
    tech: ["AWS", "GCP", "Kubernetes", "CI/CD"],
    impact: ["Scalable multi-cloud infrastructure for automotive visualization"],
  },
  {
    company: "Accenture Interactive",
    role: "Tech Arch Manager",
    period: "Aug 2020 — Aug 2021",
    location: "Brazil",
    summary:
      "Led cloud enablement: GKE cluster setup & administration, automation with Jenkins and Spinnaker, technical pre-sales and team leadership in the São Paulo metro area.",
    tech: ["GCP", "Kubernetes", "Jenkins", "Spinnaker"],
    impact: [
      "GKE clusters setup & administration",
      "Automation with Jenkins & Spinnaker",
      "Led technical cloud enablement team",
    ],
  },
  {
    company: "everis (NTT Data)",
    role: "Cloud Architect",
    period: "Feb 2019 — Aug 2020",
    location: "Brazil · International",
    summary:
      "Designed and maintained cloud solutions (GCP, AWS, Azure, OCI) for national & international clients including AndBank, Santander and LATAM Airlines.",
    tech: ["GCP", "AWS", "Azure", "OCI", "New Relic", "PagerDuty"],
    impact: [
      "Managed cloud infra for AndBank, Santander & LATAM Airlines",
      "PII / sensitive-data security setup",
      "Observability with New Relic, PagerDuty, StackStorm",
    ],
  },
  {
    company: "CI&T",
    role: "Software Engineer",
    period: "Dec 2017 — Feb 2019",
    location: "Brazil · USA client",
    summary:
      "Built a Big Data analytics platform on Google Cloud for a mass-media corporation — Java / Node.js / React with Apache Beam, App Engine, DataFlow and BigQuery.",
    tech: ["Java", "Node.js", "React", "Apache Beam", "BigQuery", "DataFlow"],
    impact: [
      "Data pipelines with Apache Beam",
      "App Engine deployments & DataFlow cronjobs",
      "BigQuery data modeling",
    ],
  },
];

/** Certification Command Center — grouped, real certifications. */
export const certifications = [
  {
    group: "Google Cloud",
    accent: "blue",
    items: [
      { name: "Professional Cloud Architect", note: "2× Certified", verified: true },
      { name: "Associate Cloud Engineer", verified: true },
    ],
  },
  {
    group: "AWS",
    accent: "orange",
    items: [{ name: "Cloud Practitioner", verified: true }],
  },
  {
    group: "Azure",
    accent: "cyan",
    items: [{ name: "Azure Fundamentals (AZ-900)", verified: true }],
  },
  {
    group: "FinOps & Practices",
    accent: "blue",
    items: [
      { name: "FinOps Practitioner", note: "Applied", verified: true },
      { name: "Agile / Kanban", verified: true },
    ],
  },
];

/** Multi-cloud "engineering galaxy" nodes. */
export const galaxy = [
  { id: "gcp", label: "Google Cloud", group: "cloud" },
  { id: "aws", label: "AWS", group: "cloud" },
  { id: "azure", label: "Azure", group: "cloud" },
  { id: "oci", label: "Oracle Cloud", group: "cloud" },
  { id: "k8s", label: "Kubernetes", group: "platform" },
  { id: "terraform", label: "Terraform", group: "platform" },
  { id: "docker", label: "Docker", group: "platform" },
  { id: "argo", label: "Argo CD", group: "platform" },
  { id: "gha", label: "GitHub Actions", group: "cicd" },
  { id: "gitlab", label: "GitLab CI", group: "cicd" },
  { id: "jenkins", label: "Jenkins / CloudBees", group: "cicd" },
  { id: "bigquery", label: "BigQuery", group: "data" },
  { id: "dataform", label: "Dataform", group: "data" },
  { id: "dbt", label: "dbt", group: "data" },
  { id: "beam", label: "Apache Beam", group: "data" },
  { id: "finops", label: "FinOps", group: "finops" },
  { id: "obs", label: "Observability", group: "finops" },
  { id: "python", label: "Python", group: "code" },
];

export const galaxyGroups: Record<string, { label: string; accent: string }> = {
  cloud: { label: "Cloud Platforms", accent: "blue" },
  platform: { label: "Platform & Orchestration", accent: "cyan" },
  cicd: { label: "CI/CD & GitOps", accent: "blue" },
  data: { label: "Data Engineering", accent: "cyan" },
  finops: { label: "FinOps & Observability", accent: "orange" },
  code: { label: "Engineering", accent: "blue" },
};

/** Mission Portfolio — case studies grounded in real engagements. */
export const projects = [
  {
    id: "finops-automation",
    title: "Enterprise FinOps Automation Platform",
    client: "Global staffing leader",
    problem:
      "Cloud spend across GCP, AWS and Azure was fragmented, untagged and growing faster than visibility allowed.",
    architecture:
      "Python automation against multi-cloud billing APIs, CloudHealth ingestion, CloudBees CI/CD, and scheduled cost-reporting + auto-tagging jobs feeding executive dashboards.",
    tech: ["Python", "GCP", "AWS", "Azure", "CloudHealth", "CloudBees"],
    scale: "Multi-account, multi-cloud estate",
    impact: ["~30% reduction in waste", "Automated tagging & chargeback", "Executive cost visibility"],
    metric: "−30%",
    metricLabel: "cloud waste",
  },
  {
    id: "bigdata-platform",
    title: "Big Data Analytics Platform",
    client: "Mass-media corporation (US)",
    problem:
      "A media corporation needed a scalable analytics platform to process and query massive event streams.",
    architecture:
      "Apache Beam pipelines on Google DataFlow, App Engine services, and a BigQuery warehouse — built in Java/Node.js with a React front end.",
    tech: ["Java", "Apache Beam", "DataFlow", "BigQuery", "App Engine"],
    scale: "Mass-scale event ingestion",
    impact: ["Real-time data pipelines", "Self-serve BigQuery analytics", "Elastic App Engine delivery"],
    metric: "10×",
    metricLabel: "analytics throughput",
  },
  {
    id: "banking-cloud",
    title: "Multi-Cloud for Banking & Aviation",
    client: "AndBank · Santander · LATAM Airlines",
    problem:
      "Regulated enterprises required resilient, secure, observable cloud infrastructure across GCP, AWS, Azure and OCI.",
    architecture:
      "VPC network design, PII / sensitive-data security controls, and full observability via New Relic, PagerDuty and StackStorm with customizable dashboards.",
    tech: ["GCP", "AWS", "Azure", "OCI", "New Relic", "PagerDuty"],
    scale: "Regulated enterprise workloads",
    impact: ["Hardened PII security", "24/7 observability & on-call", "Resilient multi-cloud networking"],
    metric: "99.9%",
    metricLabel: "availability",
  },
];

/** FinOps dashboard metrics (illustrative of capability). */
export const finops = {
  pillars: [
    "Cloud Cost Optimization",
    "Resource Rightsizing",
    "Governance & Tagging",
    "Forecasting",
    "Chargeback / Showback",
    "Automation",
  ],
  metrics: [
    { label: "Avg. waste reduced", value: "28%", trend: "down", accent: "orange" },
    { label: "Tagging coverage", value: "98%", trend: "up", accent: "cyan" },
    { label: "Forecast accuracy", value: "±4%", trend: "flat", accent: "blue" },
    { label: "Automated actions / mo", value: "1.2k", trend: "up", accent: "blue" },
  ],
};

export const aiCapabilities = [
  { title: "LLM & Grok / OpenAI integrations", desc: "Production assistants and RAG over private knowledge bases." },
  { title: "Platform Engineering for AI", desc: "Golden paths, GPU scheduling and reproducible ML infra." },
  { title: "Infrastructure for GenAI", desc: "Scalable, observable, cost-aware inference platforms." },
  { title: "Automation & Agents", desc: "AI-driven ops, cost anomaly detection and workflow automation." },
];

export const testimonials = [
  {
    name: "Lucas Arruda",
    title: "Google Cloud Expert at CI&T",
    text: "Cesar is a skilled engineer who helped us build a Data Analytics platform on Google Cloud using Big Data engineering for a mass-media corporation. He's the type of person you can always count on and who's always bringing new stuff to the team.",
  },
  {
    name: "Dillon Roher",
    title: "CTO at Apollo Group",
    text: "Cesar is a highly intelligent individual with a passion for learning. I truly hope to work with him again in the future!",
  },
  {
    name: "Ivan de Aguirre",
    title: "Project Leader, Eldorado Research Institute",
    text: "A passionate, highly motivated and skilled engineer. He never lets an opportunity for improvement go away — always ready to contribute and take on responsibility.",
  },
  {
    name: "Victor Di Trani",
    title: "Java Software Engineer at RealWorksBV",
    text: "In addition to mastering his area, Cesar knows how to work in groups and deliver results even with challenging deadlines. A differential that cannot be missed.",
  },
];

/** Curated FAQ for the AI assistant — instant, no-cost answers. */
export const faq = [
  {
    q: "What does Cesar specialize in?",
    a: "Cesar is a Principal Cloud Architect specializing in multi-cloud architecture (GCP, AWS, Azure), Platform Engineering, DevOps, and FinOps (cloud cost optimization). He has 10+ years of experience and is increasingly focused on AI infrastructure.",
  },
  {
    q: "Is he available for projects?",
    a: "Yes — Cesar is available for international projects, remotely from Europe (based in Vila Real, Portugal) through his consultancy UP2CLOUD. He typically replies within 24 hours.",
  },
  {
    q: "What is his FinOps experience?",
    a: "At Randstad Digital he worked as a Cloud FinOps Automation Engineer, automating cost reporting, resource tagging and chargeback across GCP, AWS and Azure using Python, CloudBees CI/CD and CloudHealth — driving significant reductions in cloud waste.",
  },
  {
    q: "Which certifications does he hold?",
    a: "2× Google Cloud Professional Cloud Architect, Google Cloud Associate Cloud Engineer, AWS Cloud Practitioner, and Microsoft Azure Fundamentals (AZ-900), plus applied FinOps and Agile/Kanban practice.",
  },
  {
    q: "Tell me about his cloud experience.",
    a: "Cesar has architected and operated cloud platforms for regulated enterprises like AndBank, Santander and LATAM Airlines, built Big Data platforms on Google Cloud (Apache Beam, DataFlow, BigQuery), and led GKE/Kubernetes enablement at Accenture Interactive.",
  },
  {
    q: "How can I contact him?",
    a: "Email cesarnogueira1210@gmail.com, connect on LinkedIn (linkedin.com/in/cesarnog) or GitHub (github.com/cesarnog). You can also use the Mission Briefing console on this site.",
  },
];

/** Compact knowledge base injected into the AI system prompt. */
export const knowledgeBase = `
Cesar Augusto Nogueira — Principal Cloud Architect, Platform Engineer, DevOps Leader, FinOps Consultant and AI Infrastructure specialist. 10+ years in tech. Based in Vila Real, Portugal; works remotely with international clients via his consultancy UP2CLOUD. Available for international projects.

Certifications: 2x Google Cloud Professional Cloud Architect, Google Cloud Associate Cloud Engineer, AWS Cloud Practitioner, Microsoft Azure Fundamentals (AZ-900).

Experience:
- UP2CLOUD (2025–now): Founder/consultant — cloud, automation, DevOps, data engineering for global clients.
- Randstad Digital Portugal (2022–2025): Cloud FinOps Automation Engineer — Python, multi-cloud billing APIs, CloudBees CI/CD, CloudHealth. Automated cost reporting, tagging, chargeback.
- ZeroLight (2021–2022): DevOps Engineer — automotive, AWS/GCP.
- Accenture Interactive Brazil (2020–2021): Tech Arch Manager — GKE, Jenkins, Spinnaker, team leadership.
- everis/NTT Data Brazil (2019–2020): Cloud Architect — GCP/AWS/Azure/OCI for AndBank, Santander, LATAM Airlines; PII security; observability (New Relic, PagerDuty, StackStorm).
- CI&T (2017–2019): Software Engineer — Big Data on GCP (Apache Beam, DataFlow, BigQuery, App Engine), Java/Node/React.

Skills: GCP, AWS, Azure, OCI, Kubernetes, Terraform, Docker, Argo, GitHub Actions, GitLab CI, Jenkins/CloudBees, BigQuery, Dataform, dbt, Apache Beam, Python, Java, FinOps, Observability, AI infrastructure (LLMs, Grok/OpenAI integrations).

Contact: cesarnogueira1210@gmail.com, LinkedIn linkedin.com/in/cesarnog, GitHub github.com/cesarnog.
`.trim();

export type SiteConfig = typeof siteConfig;
