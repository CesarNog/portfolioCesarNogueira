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

/**
 * Career Impact — outcome-first history framed as Challenge → Action → Result.
 * Recruiters scan for business outcomes, scale and leadership, not duties.
 */
export const experience = [
  {
    company: "UP2CLOUD",
    role: "Founder · Principal Cloud & FinOps Consultant",
    period: "Aug 2025 — Present",
    location: "Portugal · International",
    scale: "Multiple international B2B clients",
    challenge:
      "Global companies need senior cloud leadership on demand — architecture, automation and cost control — without the overhead of a full-time hire.",
    action:
      "Founded an independent B2B consultancy delivering end-to-end cloud architecture, DevOps, FinOps and data engineering. Embed with client teams to modernize platforms and harden delivery.",
    result:
      "Productized cloud architecture & FinOps engagements; ongoing automation and data-pipeline delivery for clients across Europe and the Americas.",
    outcome: "Senior cloud leadership, delivered remotely worldwide",
    tech: ["GCP", "AWS", "Azure", "Terraform", "FinOps", "CI/CD", "Data Engineering"],
    leadership: true,
  },
  {
    company: "Randstad Digital Portugal",
    role: "Cloud FinOps Automation Engineer",
    period: "Feb 2022 — Aug 2025",
    location: "Portugal · Global operations",
    scale: "Multi-account, multi-cloud estate across a global staffing leader",
    challenge:
      "Cloud spend across GCP, AWS and Azure was fragmented, untagged and growing faster than finance had visibility into.",
    action:
      "Built Python automation against multi-cloud billing APIs, integrated CloudHealth, and shipped scheduled cost-reporting, auto-tagging and chargeback jobs via CloudBees CI/CD.",
    result:
      "Automated cost reporting and resource tagging at scale, gave executives real cost visibility, and drove material reductions in cloud waste.",
    outcome: "~30% cloud waste removed · automated chargeback",
    tech: ["Python", "GCP", "AWS", "Azure", "CloudBees", "CloudHealth", "FinOps"],
    leadership: false,
  },
  {
    company: "ZeroLight",
    role: "DevOps Engineer",
    period: "Aug 2021 — Feb 2022",
    location: "Remote · UK",
    scale: "Automotive visualization platform",
    challenge:
      "Automotive-industry clients needed resilient, cost-efficient infrastructure to deliver real-time 3D visualization at scale.",
    action:
      "Designed and operated scalable multi-cloud (AWS, GCP) infrastructure with Kubernetes and automated CI/CD delivery.",
    result:
      "Improved operational agility and reliability for automotive visualization workloads.",
    outcome: "Resilient multi-cloud delivery for automotive",
    tech: ["AWS", "GCP", "Kubernetes", "CI/CD"],
    leadership: false,
  },
  {
    company: "Accenture Interactive",
    role: "Technology Architecture Manager",
    period: "Aug 2020 — Aug 2021",
    location: "São Paulo, Brazil",
    scale: "Cloud enablement team · enterprise clients",
    challenge:
      "Enterprise clients needed Kubernetes enablement and delivery automation, plus a team to lead it through technical pre-sales to production.",
    action:
      "Led GKE cluster setup and administration, built automation with Jenkins and Spinnaker, and ran technical pre-sales while leading the cloud enablement team.",
    result:
      "Stood up production GKE platforms and CD automation; led the team and won technical engagements.",
    outcome: "Led a cloud enablement team · GKE in production",
    tech: ["GCP", "Kubernetes", "Jenkins", "Spinnaker"],
    leadership: true,
  },
  {
    company: "everis (NTT Data)",
    role: "Cloud Architect",
    period: "Feb 2019 — Aug 2020",
    location: "Brazil · International",
    scale: "Regulated banking & aviation enterprises",
    challenge:
      "Regulated enterprises — AndBank, Santander, LATAM Airlines — required resilient, secure and observable cloud across GCP, AWS, Azure and OCI.",
    action:
      "Designed VPC networking and PII / sensitive-data security controls, and stood up full observability with New Relic, PagerDuty and StackStorm.",
    result:
      "Delivered hardened, observable multi-cloud for banking and aviation with 24/7 on-call coverage.",
    outcome: "Secure multi-cloud for AndBank, Santander & LATAM",
    tech: ["GCP", "AWS", "Azure", "OCI", "New Relic", "PagerDuty"],
    leadership: false,
  },
  {
    company: "CI&T",
    role: "Software Engineer",
    period: "Dec 2017 — Feb 2019",
    location: "Brazil · US client",
    scale: "Mass-scale event ingestion · US media corporation",
    challenge:
      "A US mass-media corporation needed a scalable analytics platform to process and query massive event streams.",
    action:
      "Built Apache Beam pipelines on Google DataFlow, App Engine services and a BigQuery warehouse in Java / Node.js with a React front end.",
    result:
      "Shipped real-time data pipelines and self-serve BigQuery analytics on elastic App Engine delivery.",
    outcome: "Real-time Big Data platform on Google Cloud",
    tech: ["Java", "Node.js", "React", "Apache Beam", "BigQuery", "DataFlow"],
    leadership: false,
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
    category: "FinOps & Cost Optimization",
    title: "Enterprise FinOps Automation Platform",
    client: "Global staffing leader",
    problem:
      "Cloud spend across GCP, AWS and Azure was fragmented, untagged and growing faster than visibility allowed.",
    architecture:
      "Python automation against multi-cloud billing APIs, CloudHealth ingestion, CloudBees CI/CD, and scheduled cost-reporting + auto-tagging jobs feeding executive dashboards.",
    tech: ["Python", "GCP", "AWS", "Azure", "CloudHealth", "CloudBees"],
    scale: "Multi-account, multi-cloud estate",
    impact: ["~30% reduction in waste", "Automated tagging & chargeback", "Executive cost visibility"],
    outcome: "Cut ~30% of cloud waste and gave finance real-time, per-team cost accountability.",
    lessons: "Governance before optimization. You can't cut what you can't see — and the hardest part was aligning 12 platform teams on a unified tagging taxonomy. Technical solutions are easy; organizational alignment is the real work.",
    metric: "−30%",
    metricLabel: "cloud waste",
  },
  {
    id: "bigdata-platform",
    category: "Data Platform Engineering",
    title: "Big Data Analytics Platform",
    client: "Mass-media corporation (US)",
    problem:
      "A media corporation needed a scalable analytics platform to process and query massive event streams.",
    architecture:
      "Apache Beam pipelines on Google DataFlow, App Engine services, and a BigQuery warehouse — built in Java/Node.js with a React front end.",
    tech: ["Java", "Apache Beam", "DataFlow", "BigQuery", "App Engine"],
    scale: "Mass-scale event ingestion",
    impact: ["Real-time data pipelines", "Self-serve BigQuery analytics", "Elastic App Engine delivery"],
    outcome: "Unlocked self-serve, real-time analytics over massive event streams on Google Cloud.",
    lessons: "Design for schema evolution, not just throughput. Event schemas changed six times during the project. Building schema evolution into the pipeline from day one would have saved weeks of rework.",
    metric: "10×",
    metricLabel: "analytics throughput",
  },
  {
    id: "banking-cloud",
    category: "Platform Modernization",
    title: "Multi-Cloud for Banking & Aviation",
    client: "AndBank · Santander · LATAM Airlines",
    problem:
      "Regulated enterprises required resilient, secure, observable cloud infrastructure across GCP, AWS, Azure and OCI.",
    architecture:
      "VPC network design, PII / sensitive-data security controls, and full observability via New Relic, PagerDuty and StackStorm with customizable dashboards.",
    tech: ["GCP", "AWS", "Azure", "OCI", "New Relic", "PagerDuty"],
    scale: "Regulated enterprise workloads",
    impact: ["Hardened PII security", "24/7 observability & on-call", "Resilient multi-cloud networking"],
    outcome: "Delivered secure, observable, regulator-ready cloud for banking and aviation at 99.9% availability.",
    lessons: "In regulated industries, observability is proof — not just tooling. Audit-ready dashboards and automated alerting built from day one made the difference between passing and failing compliance reviews.",
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

/**
 * Curated FAQ for the Smart AI FAQ — instant, no-cost recruiter answers.
 * Ordered so the highest-intent hiring question comes first.
 */
export const faq = [
  {
    q: "Why should I hire Cesar?",
    a: "Cesar operates at Principal / Architect level: 10+ years designing and running enterprise-scale multi-cloud platforms (GCP, AWS, Azure, OCI) for regulated banks, airlines and global enterprises. He pairs deep engineering (Kubernetes, Terraform, CI/CD, data platforms) with FinOps that removes real cloud waste (~30% on a global estate) and a track record of leading teams. He's available now for international remote consulting through UP2CLOUD and typically replies within 24h.",
  },
  {
    q: "What business impact has Cesar delivered?",
    a: "Highlights: cut ~30% of cloud waste and automated chargeback for a global staffing leader; built a real-time Big Data platform on Google Cloud for a US media corporation; delivered secure, observable multi-cloud at 99.9% availability for AndBank, Santander and LATAM Airlines; and led a cloud-enablement team running GKE in production at Accenture.",
  },
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
    q: "Show cloud architecture experience",
    a: "Cesar has architected multi-cloud platforms across GCP, AWS, Azure and OCI for regulated enterprises — VPC/network design, security and PII controls, resilient networking and 99.9% availability for AndBank, Santander and LATAM Airlines. He's certified as a 2× Google Cloud Professional Cloud Architect.",
  },
  {
    q: "Show Kubernetes expertise",
    a: "Kubernetes is core to his platform engineering work: he set up and administered GKE clusters in production and led a cloud-enablement team at Accenture, automating delivery with Jenkins and Spinnaker, and has run multi-cloud Kubernetes (AWS/GCP) with Argo CD and Docker.",
  },
  {
    q: "Show leadership experience",
    a: "Cesar founded and runs UP2CLOUD, and previously led a cloud-enablement team as Technology Architecture Manager at Accenture Interactive — including technical pre-sales, GKE enablement and delivery automation. He mentors teams and owns architecture decisions end to end.",
  },
  {
    q: "Show enterprise projects",
    a: "Enterprise-scale work includes secure multi-cloud for AndBank, Santander and LATAM Airlines (banking & aviation), a FinOps automation platform for a global staffing leader, and a real-time Big Data platform on Google Cloud for a US mass-media corporation.",
  },
  {
    q: "Show AI and automation experience",
    a: "Cesar builds AI infrastructure and automation: LLM and OpenAI-compatible integrations, RAG over private knowledge bases, GPU-aware platform engineering, and cost-anomaly/ops automation. The Smart AI FAQ on this very site is one of his AI integrations.",
  },
  {
    q: "Show international consulting work",
    a: "Through UP2CLOUD he delivers remote consulting worldwide, and has worked across Portugal, Spain, the Netherlands, the UK, Brazil and for US clients — banking, aviation, media, staffing and automotive industries.",
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

/** Hero credibility chips — instant value proposition, scannable in <5s. */
export const heroHighlights = [
  "10+ Years Experience",
  "Multi-Cloud Specialist",
  "International Consulting",
  "Enterprise-Scale Systems",
  "GCP · AWS · Azure Certified",
];

/**
 * Executive Summary — premium cards answering the recruiter's first questions:
 * who, why different, what he solves, how to engage.
 */
export const executiveSummary = [
  {
    k: "01",
    title: "Who",
    headline: "Principal-level cloud leadership",
    body: "A Principal Cloud Architect and Platform Engineer with 10+ years across GCP, AWS, Azure and OCI — from hands-on Kubernetes and Terraform to architecture and team leadership.",
  },
  {
    k: "02",
    title: "Why different",
    headline: "Engineering depth + FinOps + business sense",
    body: "Most engineers build; few also cut cost and translate cloud into board-level outcomes. Cesar does all three — removing ~30% waste while keeping platforms resilient and observable.",
  },
  {
    k: "03",
    title: "What he solves",
    headline: "Scale, spend, reliability and delivery speed",
    body: "Multi-cloud architecture, platform/DevOps modernization, cost optimization, data platforms and AI infrastructure — for regulated, enterprise-scale environments.",
  },
  {
    k: "04",
    title: "How to engage",
    headline: "Available now, remote, worldwide",
    body: "Independent consulting via UP2CLOUD for international projects. Fractional architecture, platform builds or FinOps engagements. Usually replies within 24h.",
  },
];

/**
 * Engineering Capability Matrix — areas of expertise expressed as level + tools.
 * No progress bars, no fake percentages — just scope, depth and proof.
 */
export const capabilities = [
  {
    area: "Cloud Architecture",
    level: "Principal",
    note: "Multi-cloud across GCP, AWS, Azure & OCI for regulated enterprise.",
    tools: ["GCP", "AWS", "Azure", "OCI"],
    accent: "blue",
  },
  {
    area: "Platform Engineering",
    level: "Expert",
    note: "Golden paths, self-service platforms and Kubernetes at scale.",
    tools: ["Kubernetes", "GKE", "Docker", "Argo CD"],
    accent: "cyan",
  },
  {
    area: "DevOps & CI/CD",
    level: "Expert",
    note: "Pipeline design and delivery automation end to end.",
    tools: ["GitHub Actions", "GitLab CI", "Jenkins / CloudBees", "Spinnaker"],
    accent: "blue",
  },
  {
    area: "FinOps",
    level: "Specialist",
    note: "Cost optimization, tagging, chargeback and forecasting that removes real waste.",
    tools: ["CloudHealth", "Billing APIs", "Python", "Dashboards"],
    accent: "orange",
  },
  {
    area: "Infrastructure as Code",
    level: "Expert",
    note: "Reproducible, reviewable infrastructure across clouds.",
    tools: ["Terraform", "Helm", "GitOps"],
    accent: "cyan",
  },
  {
    area: "Observability",
    level: "Expert",
    note: "24/7 monitoring, on-call and incident tooling for critical systems.",
    tools: ["New Relic", "PagerDuty", "StackStorm"],
    accent: "blue",
  },
  {
    area: "Data Platforms",
    level: "Advanced",
    note: "Real-time pipelines and warehousing on Google Cloud.",
    tools: ["BigQuery", "Apache Beam", "DataFlow", "dbt", "Dataform"],
    accent: "cyan",
  },
  {
    area: "AI Infrastructure",
    level: "Growing focus",
    note: "Scalable, observable, cost-aware platforms for GenAI workloads.",
    tools: ["LLM integrations", "RAG", "GPU scheduling", "Automation"],
    accent: "orange",
  },
];

/**
 * Global Delivery Map — equirectangular lat/long markers proving international reach.
 * Portugal is the home hub; arcs connect to delivery regions.
 */
export const globalPresence = {
  hub: "pt",
  markers: [
    {
      id: "pt", label: "Portugal", city: "Vila Real", lat: 41.3, lon: -7.74, hub: true,
      subtitle: "EU Remote Hub",
      context: "Home base & primary delivery node. Full-stack cloud architecture delivered across Europe and Americas.",
      deliveryType: "Remote" as const,
      region: "europe" as const,
      period: "2014 – present",
    },
    {
      id: "es", label: "Spain", city: "Madrid / Barcelona", lat: 40.42, lon: -3.7, hub: false,
      subtitle: "Iberia Delivery",
      context: "On-site engagements with Iberian banking and enterprise clients including Santander and AndBank.",
      deliveryType: "On-site" as const,
      region: "europe" as const,
      period: "2016 – 2020",
    },
    {
      id: "nl", label: "Netherlands", city: "Amsterdam", lat: 52.37, lon: 4.9, hub: false,
      subtitle: "EU Cloud Clients",
      context: "Remote cloud advisory for Dutch enterprise clients. Kubernetes, GKE, cost optimisation.",
      deliveryType: "Remote" as const,
      region: "europe" as const,
      period: "2020 – 2022",
    },
    {
      id: "uk", label: "United Kingdom", city: "Newcastle", lat: 54.0, lon: -2.0, hub: false,
      subtitle: "ZeroLight — Automotive",
      context: "Senior cloud engineer at ZeroLight. Real-time 3D visualisation platform on AWS for global automotive OEMs.",
      deliveryType: "Remote" as const,
      region: "europe" as const,
      period: "2021 – 2023",
    },
    {
      id: "br", label: "Brazil", city: "São Paulo", lat: -23.55, lon: -46.63, hub: false,
      subtitle: "Enterprise & Banking",
      context: "Platform engineering for LATAM Airlines and major Brazilian banks. GCP, microservices, FinOps.",
      deliveryType: "Hybrid" as const,
      region: "americas" as const,
      period: "2018 – 2021",
    },
    {
      id: "us", label: "United States", city: "New York / Remote", lat: 38.0, lon: -97.0, hub: false,
      subtitle: "Media Corporation",
      context: "Cloud infrastructure for a major US media corporation. Multi-cloud, CI/CD, observability at scale.",
      deliveryType: "Remote" as const,
      region: "americas" as const,
      period: "2022 – 2024",
    },
  ],
  regions: [
    { label: "Europe", x: 52, y: 30 },
    { label: "S. America", x: 33, y: 72 },
    { label: "N. America", x: 20, y: 38 },
  ],
};

/**
 * Trust layer — enterprise validation. Wordmarks, not fabricated logos.
 */
export const trust = {
  companies: [
    "AndBank",
    "Santander",
    "LATAM Airlines",
    "Randstad",
    "Accenture",
    "NTT Data",
    "CI&T",
    "ZeroLight",
  ],
  industries: ["Banking", "Aviation", "Media", "Staffing", "Automotive", "Consulting"],
  clouds: ["Google Cloud", "AWS", "Azure", "Oracle Cloud"],
  signals: [
    { value: "10+", label: "Years in cloud" },
    { value: "40+", label: "Cloud projects" },
    { value: "5", label: "Certifications" },
    { value: "4", label: "Cloud providers" },
    { value: "$2.5M+", label: "Cost savings generated" },
    { value: "6+", label: "Countries served" },
  ],
};

/**
 * Smart AI FAQ — recruiter-focused suggested prompts.
 * Each maps to a curated answer via keyword matching (free, instant).
 */
export const recruiterPrompts = [
  "Why should I hire Cesar?",
  "What business impact has Cesar delivered?",
  "Show cloud architecture experience",
  "Show FinOps achievements",
  "Show Kubernetes expertise",
  "Show GCP certifications",
  "Show leadership experience",
  "Show enterprise projects",
  "Show AI and automation experience",
  "Show international consulting work",
];

export type SiteConfig = typeof siteConfig;
