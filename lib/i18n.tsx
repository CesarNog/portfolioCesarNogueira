"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "pt" | "es" | "fr" | "zh";
export const LANGS: { code: Lang; label: string; name: string; flag: string }[] = [
  { code: "en", label: "EN", name: "English",       flag: "🇬🇧" },
  { code: "pt", label: "PT", name: "Português (BR)", flag: "🇧🇷" },
  { code: "es", label: "ES", name: "Español",        flag: "🇪🇸" },
  { code: "fr", label: "FR", name: "Français",       flag: "🇫🇷" },
  { code: "zh", label: "中文", name: "中文",           flag: "🇨🇳" },
];

type SectionCopy = { label: string; title: string; intro?: string };

type Dict = {
  nav: Record<string, string>;
  hero: {
    available: string;
    roleLine: string;
    desc: string;
    chips: string[];
    ctaPrimary: string;
    ctaSecondary: string;
  };
  sections: Record<string, SectionCopy>;
  exec: { title: string; headline: string; body: string }[];
  recruiter: { banner: string; exit: string; on: string; off: string };
  assistant: {
    launch: string;
    close: string;
    header: string;
    subtitle: string;
    greeting: string;
    suggested: string;
    placeholder: string;
    thinking: string;
    followUp: string;
    sourceLabel: string;
  };
  portraitCaption: string;
  contact: {
    briefingTitle: string;
    briefingDesc: string;
    emailCta: string;
    downloadCv: string;
    availability: string;
    responseTime: string;
    contactQuote: string;
    formTitle: string;
    formSubtitle: string;
    formName: string;
    formEmail: string;
    formSubject: string;
    formMessage: string;
    formNamePlaceholder: string;
    formEmailPlaceholder: string;
    formSubjectPlaceholder: string;
    formMessagePlaceholder: string;
    formSend: string;
    formSending: string;
    formCancel: string;
    formSuccess: string;
    formSuccessDesc: string;
    formError: string;
    rowLabels: {
      email: string;
      linkedin: string;
      github: string;
      location: string;
      responseTime: string;
    };
  };
  statsLabels: string[];
  labels: {
    problem: string;
    architecture: string;
    businessResult: string;
    lessons: string;
    aiFaqNote: string;
    trustCompanies: string;
    trustIndustries: string;
    trustClouds: string;
    challenge: string;
    action: string;
    result: string;
    leadership: string;
    homeBase: string;
    verified: string;
    loadingGalaxy: string;
    operatingModel: string;
    monthlyCostLabel: string;
    filterAll: string;
    filterEurope: string;
    filterAmericas: string;
    filterRemote: string;
    filterOnsite: string;
    filterHybrid: string;
    region: string;
    deliveryType: string;
  };
  story: {
    pullQuote: string;
    p1: string;
    p2: string;
    p3: string;
  };
  palette: {
    placeholder: string;
    noResults: string;
    ariaClose: string;
    search: string;
    groups: { navigate: string; actions: string; contact: string };
    home: string;
    darkTheme: string;
    lightTheme: string;
    openFaq: string;
    emailCesar: string;
    downloadCv: string;
    navigate: string;
    commandPalette: string;
  };
  recruiterPrompts: string[];
  assistantFollowUps: {
    kubernetes: string[];
    finops: string[];
    leadership: string[];
    architecture: string[];
    gcp: string[];
    cloud: string[];
    enterprise: string[];
    ai: string[];
    fallback: string[];
  };
  projects: Record<string, {
    category: string;
    title: string;
    client: string;
    problem: string;
    architecture: string;
    scale: string;
    impact: string[];
    outcome: string;
    lessons: string;
    metricLabel: string;
  }>;
  capabilities: Array<{ area: string; level: string; note: string }>;
  scanner: {
    triggerLabel: string;
    triggerTitle: string;
    phaseScanning: string;
    phaseAnalyzing: string;
    phaseReport: string;
    statusScanning: string;
    statusAnalyzing: string;
    statusReport: string;
    closeLabel: string;
    candidateEvalLabel: string;
    competencyScores: string;
    evidenceProjects: string;
    evidenceTech: string;
    evidenceProduction: string;
    evidenceImpact: string;
    evidenceCerts: string;
    assessmentComplete: string;
    hireRecommendation: string;
    verdict: string;
    overallFit: string;
    fitValue: string;
    riskLevel: string;
    riskValue: string;
    availability: string;
    availabilityValue: string;
    bestFitRoles: string;
    businessImpact: string;
    scheduleInterview: string;
    emailCesar: string;
    downloadCv: string;
    expandHint: string;
    dialogDismissHint: string;
    dialogSendMessage: string;
    dialogFitLabel: string;
    dialogRiskLabel: string;
    dialogAvailLabel: string;
    dialogVerifiedLabel: string;
  };
  recruiterMode: {
    backToRoles: string;
    fitEvaluation: string;
    strengths: string;
    evidence: string;
    considerations: string;
    interviewTopics: string;
    noConcerns: string;
    ctaText: string;
    ctaButton: string;
    roleGridIntro: string;
    quickInsights: string;
    scoreLabelExcellent: string;
    scoreLabelStrong: string;
    scoreLabelGood: string;
    scoreLabelPartial: string;
    quickExec: string;
    quickImpact: string;
    quickCredentials: string;
    quickCareer: string;
    hiringAssistant: string;
    tabRoleFit: string;
    tabAIChat: string;
    roleStrengths: Record<string, readonly string[]>;
  };
};

const en: Dict = {
  nav: {
    summary: "Summary",
    experience: "Impact",
    work: "Stories",
    capabilities: "Expertise",
    trust: "Trust",
    global: "Global",
    contact: "Contact",
  },
  hero: {
    available: "Available for global consulting",
    roleLine: "Cloud · DevOps · FinOps · AI Infrastructure",
    desc: "10+ years building cloud infrastructure for banks, airlines, and enterprises. I make platforms reliable, observable, and worth every dollar spent on them.",
    chips: [
      "10+ years in cloud",
      "GCP · AWS · Azure · OCI",
      "🇧🇷 Brazil → 🇵🇹 Portugal",
      "Remote-first, worldwide",
      "Available now",
    ],
    ctaPrimary: "Let's talk",
    ctaSecondary: "See the work",
  },
  sections: {
    summary: {
      label: "Who I Am",
      title: "Architect, engineer, and strategist",
      intro:
        "Ten years of cloud, three continents, one consistent goal: platforms that work in production.",
    },
    experience: {
      label: "Career",
      title: "Outcomes delivered across a decade of cloud leadership",
      intro:
        "The roles that shaped how I think about cloud, cost, and engineering leadership.",
    },
    work: {
      label: "Impact Stories",
      title: "Three engagements. Three hard problems. Three outcomes.",
      intro:
        "Each case study follows the full arc: the challenge, the approach, the outcome, and what I learned from it.",
    },
    capabilities: {
      label: "Technical Depth",
      title: "Depth where it counts, no vanity metrics",
      intro:
        "Each capability shown by level and the tools behind it. Scope and proof, not progress bars.",
    },
    trust: {
      label: "Enterprise Trust",
      title: "Trusted with regulated, high-stakes systems",
      intro:
        "Banks, airlines and global enterprises, across four cloud providers and six industries.",
    },
    global: {
      label: "Global Delivery",
      title: "Based in Portugal. Delivering globally.",
      intro:
        "From Brazil to Europe and across the Americas: cloud, DevOps, platform engineering and FinOps delivered wherever the work is.",
    },
    certifications: {
      label: "Certifications",
      title: "Verified, multi-cloud credentials",
      intro: "Validated expertise across the three major clouds plus FinOps practice.",
    },
    stack: {
      label: "Technology Landscape",
      title: "An engineering galaxy, not a list of badges",
      intro:
        "A live force-directed graph of the full stack: clouds, orchestration, CI/CD, data and FinOps. Drag, zoom and explore the connections.",
    },
    finops: {
      label: "Cloud Cost Engineering",
      title: "Cloud cost as an engineering discipline",
      intro:
        "Cost optimization, rightsizing, governance, forecasting, chargeback and automation, measured, not guessed.",
    },
    ai: {
      label: "AI & Automation",
      title: "Platform engineering for AI: observable, reliable, cost-tracked",
      intro:
        "From LLM integrations to GPU-aware platform engineering: infrastructure that makes AI reliable, observable and cost-aware.",
    },
    testimonials: {
      label: "Signal",
      title: "Trusted by engineers and leaders",
    },
    contact: {
      label: "Start a Conversation",
      title: "Tell me what you're building",
      intro:
        "Cloud architecture, platform engineering, FinOps, AI infrastructure: if the work is serious, I want to hear about it.",
    },
  },
  exec: [
    {
      title: "The journey",
      headline: "Built from Portugal, delivered worldwide",
      body: "Started engineering in Brazil. Moved through São Paulo, London, Madrid, and across time zones. Built platforms for banks, airlines, and media companies. Learned what it means when production fails at 3am, and how to stop it happening again.",
    },
    {
      title: "The edge",
      headline: "Engineering depth that reaches the spreadsheet",
      body: "I've been both the architect designing the system and the FinOps lead watching the bill. That combination, knowing both the infrastructure and its real cost, is rare, and it changes what you build.",
    },
    {
      title: "The focus",
      headline: "Platforms teams love. Costs that go down.",
      body: "Multi-cloud on GCP, AWS, Azure and OCI. Kubernetes, Terraform, CI/CD. Cost governance. AI-ready infrastructure. Regulated, production-scale environments where the stakes are real.",
    },
    {
      title: "The partnership",
      headline: "A trusted partner, not a ticket-taker",
      body: "Independent consulting via UP2CLOUD for international clients. Fractional architecture, platform builds or FinOps engagements. I prefer work where I can stay long enough to see it compound. Currently available, replies within 24h.",
    },
  ],
  recruiter: {
    banner:
      "Recruiter Mode: impact, leadership, certifications & availability emphasized",
    exit: "exit",
    on: "Recruiter Mode: On",
    off: "Recruiter Mode",
  },
  assistant: {
    launch: "Ask about César",
    close: "Close",
    header: "AI Career Assistant",
    subtitle: "Knows everything about César · answers from his real profile",
    greeting:
      "I'm Cesar's AI Career Assistant. I know his entire background. Ask anything a hiring decision needs: seniority, scale, leadership, cost impact, certifications or availability. Try a question below.",
    suggested: "Suggested for recruiters",
    placeholder: "Ask about Cesar's fit for your role…",
    thinking: "Thinking…",
    followUp: "Follow up",
    sourceLabel: "Based on portfolio evidence",
  },
  portraitCaption: "São Paulo 🇧🇷 → Vila Real 🇵🇹",
  contact: {
    briefingTitle: "Let's work together",
    briefingDesc: "Cloud architecture, platform engineering, DevOps, FinOps or AI infrastructure. Tell me what you're building and let's explore how we can work together.",
    emailCta: "Send Cesar a message",
    downloadCv: "Download CV",
    availability: "Available for international projects",
    responseTime: "Usually replies within 24h",
    contactQuote: "Every project I've worked on has been someone's critical infrastructure: a bank's payment platform, an airline's operations system, a media company's data backbone. I take that responsibility seriously. If you're building something that matters, I'd like to hear about it.",
    formTitle: "Send Cesar a message",
    formSubtitle: "Replies within 24h",
    formName: "Name",
    formEmail: "Email",
    formSubject: "Subject",
    formMessage: "Message",
    formNamePlaceholder: "Your name",
    formEmailPlaceholder: "you@company.com",
    formSubjectPlaceholder: "Project enquiry, role opportunity…",
    formMessagePlaceholder: "Tell Cesar what you're building and how he can help…",
    formSend: "Send message",
    formSending: "Sending…",
    formCancel: "Cancel",
    formSuccess: "Message sent",
    formSuccessDesc: "Cesar will be in touch within 24 hours.",
    formError: "Something went wrong. Email directly:",
    rowLabels: {
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      location: "Location",
      responseTime: "Response time",
    },
  },
  statsLabels: ["Years in Tech", "Cloud Projects", "Certifications", "Cloud Waste Removed"],
  labels: {
    problem: "The Challenge",
    architecture: "The Approach",
    businessResult: "The Outcome",
    lessons: "What I learned",
    aiFaqNote: "// The Smart AI FAQ on this site is an AI integration. Ask it anything about Cesar's fit for your role.",
    trustCompanies: "Companies",
    trustIndustries: "Industries",
    trustClouds: "Cloud Platforms",
    challenge: "Challenge",
    action: "Action",
    result: "Result",
    leadership: "Leadership",
    homeBase: "Home Base",
    verified: "verified",
    loadingGalaxy: "loading galaxy…",
    operatingModel: "Operating model",
    monthlyCostLabel: "Monthly cloud spend · optimized",
    filterAll: "All",
    filterEurope: "Europe",
    filterAmericas: "Americas",
    filterRemote: "Remote",
    filterOnsite: "On-site",
    filterHybrid: "Hybrid",
    region: "Region",
    deliveryType: "Type",
  },
  palette: {
    placeholder: "Search sections, skills, contact…",
    noResults: "No results.",
    ariaClose: "Close",
    groups: { navigate: "Navigate", actions: "Actions", contact: "Contact" },
    home: "Home",
    darkTheme: "Toggle dark theme",
    lightTheme: "Toggle light theme",
    openFaq: "Ask about César (AI Career Assistant)",
    emailCesar: "Email Cesar",
    downloadCv: "Download CV",
    search: "Search",
    navigate: "Navigate",
    commandPalette: "Command palette",
  },
  recruiterPrompts: [
    "Why is Cesar a strong candidate for senior cloud roles?",
    "What measurable cloud cost savings has Cesar delivered?",
    "Show Kubernetes production experience",
    "How does Cesar approach FinOps at enterprise scale?",
    "What GCP certifications and hands-on experience does Cesar have?",
    "Has Cesar led teams or major cloud initiatives?",
    "What regulated industries has Cesar delivered for?",
    "Show cloud architecture for banking and aviation",
    "How does Cesar approach AI and automation infrastructure?",
    "Is Cesar available for international engagements?",
  ],
  assistantFollowUps: {
    kubernetes: [
      "Show production GKE experience",
      "Show platform engineering projects",
      "Show Terraform infrastructure examples",
      "Show Argo CD and GitOps work",
    ],
    finops: [
      "What cloud cost savings has Cesar delivered?",
      "Show FinOps automation tooling used",
      "Show multi-cloud billing experience",
      "How does Cesar approach cloud governance?",
    ],
    leadership: [
      "Show team leadership examples",
      "Has Cesar founded or led a company?",
      "Show technical pre-sales experience",
      "Show cross-functional delivery examples",
    ],
    architecture: [
      "Show banking cloud architecture work",
      "Show platform engineering design",
      "Show multi-cloud networking experience",
      "What regulated industries has Cesar served?",
    ],
    gcp: [
      "Show GCP Professional Cloud Architect credentials",
      "Show BigQuery and data platform work",
      "Show GKE production deployments",
      "Show Google Cloud FinOps experience",
    ],
    cloud: [
      "Show AWS experience",
      "Show Azure experience",
      "Show multi-cloud governance",
      "Show cloud migration projects",
    ],
    enterprise: [
      "Show banking and aviation clients",
      "Show regulated industry experience",
      "Show 99.9% availability delivery",
      "Show on-site vs remote delivery",
    ],
    ai: [
      "Show LLM integration work",
      "Show AI infrastructure platforms",
      "Show automation and agent work",
      "How does Cesar approach GenAI?",
    ],
    fallback: [
      "What measurable cloud cost savings has Cesar delivered?",
      "Show Kubernetes production experience",
      "Has Cesar led teams or major initiatives?",
      "Is Cesar available for international projects?",
    ],
  },
  story: {
    pullQuote: "I grew up in Brazil 🇧🇷. Moved to Europe. Spent 10+ years building infrastructure that doesn't fail, for banks, airlines, and enterprises that can't afford for it to.",
    p1: "I started in São Paulo, building data platforms and software systems for large enterprises. Cloud infrastructure caught me early: the challenge of making distributed systems reliable, observable, and cost-efficient at scale. That became my career.",
    p2: "Moving to Europe in my mid-twenties changed how I think about this work. Working across time zones, languages, and cultures taught me what certifications don't: cloud problems are mostly people problems. Systems fail because teams don't talk. Costs spiral because nobody owns them. Platforms break because the incentives are misaligned.",
    p3: "Since then I've built platforms for banks in London and Madrid, airlines across Latin America, media companies in the US, and enterprises everywhere in between. I founded UP2CLOUD to do this work on my own terms, focused on outcomes, not headcount.",
  },
  projects: {
    "finops-automation": {
      category: "FinOps & Cost Optimization",
      title: "Enterprise FinOps Automation Platform",
      client: "Global staffing leader",
      problem: "Cloud spend across GCP, AWS and Azure was fragmented, untagged and growing faster than visibility allowed.",
      architecture: "Python automation against multi-cloud billing APIs, CloudHealth ingestion, CloudBees CI/CD, and scheduled cost-reporting + auto-tagging jobs feeding executive dashboards.",
      scale: "Multi-account, multi-cloud estate",
      impact: ["~30% reduction in waste", "Automated tagging & chargeback", "Executive cost visibility"],
      outcome: "Cut ~30% of cloud waste and gave finance real-time, per-team cost accountability.",
      lessons: "Governance before optimization. You can't cut what you can't see, and the hardest part was aligning 12 platform teams on a unified tagging taxonomy. Technical solutions are easy; organizational alignment is the real work.",
      metricLabel: "cloud waste",
    },
    "bigdata-platform": {
      category: "Data Platform Engineering",
      title: "Big Data Analytics Platform",
      client: "Mass-media corporation (US)",
      problem: "A media corporation needed a scalable analytics platform to process and query massive event streams.",
      architecture: "Apache Beam pipelines on Google DataFlow, App Engine services, and a BigQuery warehouse, built in Java/Node.js with a React front end.",
      scale: "Mass-scale event ingestion",
      impact: ["Real-time data pipelines", "Self-serve BigQuery analytics", "Elastic App Engine delivery"],
      outcome: "Unlocked self-serve, real-time analytics over massive event streams on Google Cloud.",
      lessons: "Design for schema evolution, not just throughput. Event schemas changed six times during the project. Building schema evolution into the pipeline from day one would have saved weeks of rework.",
      metricLabel: "analytics throughput",
    },
    "banking-cloud": {
      category: "Platform Modernization",
      title: "Multi-Cloud for Banking & Aviation",
      client: "AndBank · Santander · LATAM Airlines",
      problem: "Regulated enterprises required resilient, secure, observable cloud infrastructure across GCP, AWS, Azure and OCI.",
      architecture: "VPC network design, PII / sensitive-data security controls, and full observability via New Relic, PagerDuty and StackStorm with customizable dashboards.",
      scale: "Regulated enterprise workloads",
      impact: ["Hardened PII security", "24/7 observability & on-call", "Resilient multi-cloud networking"],
      outcome: "Delivered secure, observable, regulator-ready cloud for banking and aviation at 99.9% availability.",
      lessons: "In regulated industries, observability is proof, not just tooling. Audit-ready dashboards and automated alerting built from day one made the difference between passing and failing compliance reviews.",
      metricLabel: "availability",
    },
  },
  capabilities: [
    { area: "Cloud Architecture",       level: "Principal",      note: "Multi-cloud across GCP, AWS, Azure & OCI for regulated enterprise." },
    { area: "Platform Engineering",     level: "Expert",         note: "Golden paths, self-service platforms and Kubernetes at scale." },
    { area: "DevOps & CI/CD",           level: "Expert",         note: "Pipeline design and delivery automation end to end." },
    { area: "FinOps",                   level: "Specialist",     note: "Cost optimization, tagging, chargeback and forecasting that removes real waste." },
    { area: "Infrastructure as Code",   level: "Expert",         note: "Reproducible, reviewable infrastructure across clouds." },
    { area: "Observability",            level: "Expert",         note: "24/7 monitoring, on-call and incident tooling for critical systems." },
    { area: "Data Platforms",           level: "Advanced",       note: "Real-time pipelines and warehousing on Google Cloud." },
    { area: "AI Infrastructure",        level: "Growing focus",  note: "Scalable, observable, cost-aware platforms for GenAI workloads." },
  ],
  scanner: {
    triggerLabel: "Evaluate Cesar",
    triggerTitle: "Evaluate Cesar for a role (⌘⇧E)",
    phaseScanning: "Initializing candidate scan…",
    phaseAnalyzing: "Analyzing candidate profile…",
    phaseReport: "Strong match — cleared for interview · Available now",
    statusScanning: "Scanning candidate record…",
    statusAnalyzing: "Scoring {n} / {total} competencies",
    statusReport: "{total}/{total} competencies verified · Hire signal: strong",
    closeLabel: "Close",
    candidateEvalLabel: "Candidate Evaluation",
    competencyScores: "Competency Scores",
    evidenceProjects: "Projects",
    evidenceTech: "Technologies",
    evidenceProduction: "Production",
    evidenceImpact: "Impact",
    evidenceCerts: "Certifications",
    assessmentComplete: "Assessment Complete",
    hireRecommendation: "Hire Recommendation",
    verdict: "Proceed to Interview",
    overallFit: "Overall Fit",
    fitValue: "Strong Match",
    riskLevel: "Risk Level",
    riskValue: "Low",
    availability: "Availability",
    availabilityValue: "Now",
    bestFitRoles: "Best-Fit Roles",
    businessImpact: "Business Impact",
    scheduleInterview: "Schedule Interview",
    emailCesar: "Email César →",
    downloadCv: "Download CV",
    expandHint: "Expand any competency above to view projects, evidence and certifications",
    dialogDismissHint: "Dismiss to review full competency breakdown",
    dialogSendMessage: "Send a Message to César →",
    dialogFitLabel: "Fit",
    dialogRiskLabel: "Risk",
    dialogAvailLabel: "Availability",
    dialogVerifiedLabel: "Verified",
  },
  recruiterMode: {
    backToRoles: "← All roles",
    fitEvaluation: "Fit Evaluation",
    strengths: "Strengths",
    evidence: "Evidence",
    considerations: "Considerations",
    interviewTopics: "Interview Topics",
    noConcerns: "No significant concerns identified.",
    ctaText: "Want to discuss this evaluation or explore a specific scenario?",
    ctaButton: "Email César →",
    roleGridIntro: "Select a role to generate a structured fit evaluation — strengths, evidence, considerations and interview topics.",
    quickInsights: "Quick Insights",
    scoreLabelExcellent: "Excellent fit",
    scoreLabelStrong: "Strong fit",
    scoreLabelGood: "Good fit",
    scoreLabelPartial: "Partial fit",
    quickExec: "Exec",
    quickImpact: "Impact",
    quickCredentials: "Credentials",
    quickCareer: "Career",
    hiringAssistant: "Hiring Assistant",
    tabRoleFit: "Role Fit",
    tabAIChat: "AI Chat",
    roleStrengths: {
      "cloud-architect": ["2× Google Cloud Professional Architect (recertified)", "Multi-cloud at enterprise scale: GCP, AWS, Azure, OCI", "10+ years designing regulated cloud for banking and aviation", "Founded UP2CLOUD — delivers architecture as a service globally"],
      "platform-engineer": ["Kubernetes (GKE) in production at Accenture, ZeroLight, everis", "Terraform for reproducible multi-cloud IaC", "Argo CD, GitHub Actions, GitLab CI — GitOps delivery pipelines", "Developer enablement: golden paths, self-service platforms"],
      "devops-lead": ["CI/CD at scale: CloudBees, Jenkins, Spinnaker, GitHub Actions", "40% faster deployments via pipeline redesign at Randstad Digital", "Observability: New Relic, PagerDuty, StackStorm — 24/7 on-call", "Automated resource tagging, cost reporting, chargeback via Python"],
      "finops-engineer": ["Dedicated FinOps Automation Engineer at Randstad Digital (3.5 years)", "~30% cloud waste reduction across GCP, AWS, Azure — documented", "Python automation against multi-cloud billing APIs", "CloudHealth, chargeback reporting, automated tagging at enterprise scale"],
      "staff-engineer": ["Technology Architecture Manager at Accenture (technical + people leadership)", "Founder of UP2CLOUD — owns architecture decisions end-to-end", "Cross-functional: technical pre-sales, delivery, architecture, mentoring", "Trained 120+ Accenture engineers to Google Cloud certification"],
      "ai-infrastructure": ["Infrastructure foundation for AI: GPU scheduling, cost-aware inference platforms", "LLM integrations and RAG over private knowledge bases (production)", "Platform engineering directly applicable to MLOps infrastructure", "AI automation: cost anomaly detection, ops automation agents"],
      "consultant": ["Founder and principal of UP2CLOUD — B2B cloud consultancy (2022–present)", "International delivery: Portugal, Spain, Netherlands, UK, Brazil, US clients", "Enterprise track record: banking, aviation, media, staffing, automotive", "B2B model: fractional architecture, platform builds, FinOps engagements"],
    },
  },
};

const pt: Dict = {
  nav: {
    summary: "Resumo",
    experience: "Impacto",
    work: "Casos",
    capabilities: "Competências",
    trust: "Confiança",
    global: "Global",
    contact: "Contato",
  },
  hero: {
    available: "Disponível para consultoria global",
    roleLine: "Cloud · DevOps · FinOps · Infraestrutura de IA",
    desc: "10+ anos a construir infraestrutura cloud para bancos, companhias aéreas e empresas. Faço plataformas fiáveis, observáveis e que valem cada euro investido.",
    chips: [
      "10+ anos em cloud",
      "GCP · AWS · Azure · OCI",
      "🇧🇷 Brasil → 🇵🇹 Portugal",
      "Remoto, em todo o mundo",
      "Disponível agora",
    ],
    ctaPrimary: "Falar comigo",
    ctaSecondary: "Ver o trabalho",
  },
  sections: {
    summary: {
      label: "Quem Sou",
      title: "Arquiteto, engenheiro e estratega",
      intro:
        "Dez anos de cloud, três continentes, um objetivo consistente: plataformas que funcionam mesmo em produção.",
    },
    experience: {
      label: "Carreira",
      title: "Resultados entregues ao longo de uma década de liderança cloud",
      intro:
        "As funções que moldaram a forma como penso sobre cloud, custo e liderança de engenharia. Expanda qualquer cartão para a história completa.",
    },
    work: {
      label: "Casos de Impacto",
      title: "Três projetos. Três problemas difíceis. Três resultados.",
      intro:
        "Cada caso segue o arco completo: o desafio, a abordagem, o resultado e o que aprendi com ele.",
    },
    capabilities: {
      label: "Profundidade Técnica",
      title: "Profundidade onde importa, sem métricas de vaidade",
      intro:
        "Cada competência apresentada por nível e pelas ferramentas que a sustentam. Âmbito e prova, não barras de progresso.",
    },
    trust: {
      label: "Confiança Empresarial",
      title: "Confiado com sistemas regulados de alto risco",
      intro:
        "Bancos, companhias aéreas e grandes empresas, em quatro fornecedores de cloud e seis indústrias.",
    },
    global: {
      label: "Entrega Global",
      title: "Baseado em Portugal. Entrega global.",
      intro:
        "Do Brasil à Europa e por toda a América: cloud, DevOps, engenharia de plataformas e FinOps entregues onde o trabalho existe.",
    },
    certifications: {
      label: "Certificações",
      title: "Credenciais multi-cloud verificadas",
      intro: "Competências validadas nas três grandes clouds, mais prática de FinOps.",
    },
    stack: {
      label: "Paisagem Tecnológica",
      title: "Uma galáxia de engenharia, não uma lista de crachás",
      intro:
        "Um grafo dinâmico de toda a stack: clouds, orquestração, CI/CD, dados e FinOps. Arraste, use zoom e explore as conexões.",
    },
    finops: {
      label: "Engenharia de Custos Cloud",
      title: "Transformar o custo da cloud num ativo estratégico",
      intro:
        "Otimização de custos, dimensionamento, governança, previsão, imputação e automação, medido, não adivinhado.",
    },
    ai: {
      label: "IA & Automação",
      title: "Engenharia de plataformas para IA: observável, fiável, com custos controlados",
      intro:
        "De integrações com LLMs à engenharia de plataformas com GPUs: infraestrutura que torna a IA fiável, observável e consciente dos custos.",
    },
    testimonials: {
      label: "Reconhecimento",
      title: "Reconhecido por engenheiros e líderes",
    },
    contact: {
      label: "Iniciar Conversa",
      title: "Diga-me o que está construindo",
      intro:
        "Arquitetura cloud, engenharia de plataformas, FinOps, infraestrutura de IA: se o trabalho é sério, quero saber.",
    },
  },
  exec: [
    {
      title: "O percurso",
      headline: "Nascido no Brasil 🇧🇷, entregue ao mundo",
      body: "Comecei no Brasil. Passei por São Paulo, Londres, Madrid e vários fusos. Construí plataformas pra bancos, companhias aéreas e empresas de mídia. Aprendi o que significa quando a produção cai às 3 da manhã, e como fazer pra não repetir.",
    },
    {
      title: "O diferencial",
      headline: "Profundidade técnica que chega à folha de custos",
      body: "Já fui o arquiteto que projeta o sistema e o responsável FinOps que acompanha a fatura. Essa combinação, entender a fundo a infraestrutura e o custo real dela, é rara, e muda o que você constrói.",
    },
    {
      title: "O foco",
      headline: "Plataformas que as equipes adoram. Custos que baixam.",
      body: "Multi-cloud em GCP, AWS, Azure e OCI. Kubernetes, Terraform, CI/CD. Governação de custos. Infraestrutura preparada para IA. Ambientes regulados e em escala empresarial onde os riscos são reais.",
    },
    {
      title: "A parceria",
      headline: "Um parceiro de confiança, não um executor de tickets",
      body: "Consultoria independente via UP2CLOUD pra clientes internacionais. Arquitetura fracionada, construção de plataformas ou projetos FinOps. Prefiro trabalhos onde possa ficar tempo suficiente pra ver o impacto crescer. Disponível agora, respondo em 24h.",
    },
  ],
  recruiter: {
    banner:
      "Modo Recrutador: impacto, liderança, certificações e disponibilidade em destaque",
    exit: "sair",
    on: "Modo Recrutador: Ativo",
    off: "Modo Recrutador",
  },
  assistant: {
    launch: "FAQ Inteligente",
    close: "Fechar",
    header: "Assistente de Carreira IA",
    subtitle: "Sabe tudo sobre o Cesar · responde a partir do perfil real",
    greeting:
      "Sou o Assistente de Carreira IA do Cesar. Conheço todo o seu percurso. Pergunte o que uma decisão de contratação precisa: senioridade, escala, liderança, impacto em custos, certificações ou disponibilidade. Experimente uma pergunta abaixo.",
    suggested: "Sugestões para recrutadores",
    placeholder: "Pergunte sobre a adequação do Cesar ao seu cargo…",
    thinking: "Pensando…",
    followUp: "Continuar",
    sourceLabel: "Com base no perfil",
  },
  portraitCaption: "São Paulo 🇧🇷 → Vila Real 🇵🇹",
  contact: {
    briefingTitle: "Vamos trabalhar juntos",
    briefingDesc: "Arquitetura cloud, engenharia de plataformas, DevOps, FinOps ou infraestrutura de IA. Diga-me o que está construindo e exploremos como trabalhar juntos.",
    emailCta: "Enviar mensagem ao Cesar",
    downloadCv: "Baixar CV",
    availability: "Disponível para projetos internacionais",
    responseTime: "Responde normalmente em 24h",
    contactQuote: "Cada projeto em que trabalhei foi a infraestrutura crítica de alguém: a plataforma de pagamentos de um banco, o sistema de operações de uma companhia aérea, a espinha dorsal de dados de uma empresa de media. Tomo essa responsabilidade a sério. Se está construindo algo que importa, gostaria de ouvir.",
    formTitle: "Enviar mensagem ao Cesar",
    formSubtitle: "Responde em 24h",
    formName: "Nome",
    formEmail: "Email",
    formSubject: "Assunto",
    formMessage: "Mensagem",
    formNamePlaceholder: "O seu nome",
    formEmailPlaceholder: "voce@empresa.com",
    formSubjectPlaceholder: "Proposta de projeto, oportunidade…",
    formMessagePlaceholder: "Diga ao Cesar o que está construindo e como ele pode ajudar…",
    formSend: "Enviar mensagem",
    formSending: "Enviando…",
    formCancel: "Cancelar",
    formSuccess: "Mensagem enviada",
    formSuccessDesc: "O Cesar responderá em 24 horas.",
    formError: "Algo correu mal. Envie diretamente para:",
    rowLabels: {
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      location: "Localização",
      responseTime: "Tempo de resposta",
    },
  },
  statsLabels: ["Anos em Tecnologia", "Projetos Cloud", "Certificações", "Desperdício Cloud Removido"],
  labels: {
    problem: "O Desafio",
    architecture: "A Abordagem",
    businessResult: "O Resultado",
    lessons: "O que aprendi",
    aiFaqNote: "// O Smart AI FAQ neste site é uma integração de IA. Pergunte-lhe tudo sobre a adequação do Cesar ao seu cargo.",
    trustCompanies: "Empresas",
    trustIndustries: "Setores",
    trustClouds: "Plataformas Cloud",
    challenge: "Desafio",
    action: "Ação",
    result: "Resultado",
    leadership: "Liderança",
    homeBase: "Base Principal",
    verified: "verificadas",
    loadingGalaxy: "carregando galáxia…",
    operatingModel: "Modelo operacional",
    monthlyCostLabel: "Custo mensal cloud · otimizado",
    filterAll: "Todos",
    filterEurope: "Europa",
    filterAmericas: "Américas",
    filterRemote: "Remoto",
    filterOnsite: "Presencial",
    filterHybrid: "Híbrido",
    region: "Região",
    deliveryType: "Tipo",
  },
  palette: {
    placeholder: "Pesquisar seções, competências, contato…",
    noResults: "Sem resultados.",
    ariaClose: "Fechar",
    groups: { navigate: "Navegar", actions: "Ações", contact: "Contato" },
    home: "Início",
    darkTheme: "Tema escuro",
    lightTheme: "Tema claro",
    openFaq: "Abrir Smart AI FAQ",
    emailCesar: "Enviar email ao Cesar",
    downloadCv: "Baixar CV",
    search: "Pesquisar",
    navigate: "Navegar",
    commandPalette: "Paleta de comandos",
  },
  recruiterPrompts: [
    "Por que o Cesar é forte candidato para funções sénior em cloud?",
    "Que poupanças mensuráveis em cloud o Cesar já gerou?",
    "Mostrar experiência em produção com Kubernetes",
    "Como o Cesar aborda FinOps em escala empresarial?",
    "Que certificações GCP e experiência prática tem o Cesar?",
    "O Cesar liderou equipes ou iniciativas cloud de grande escala?",
    "Em que indústrias reguladas o Cesar já entregou projetos?",
    "Mostrar arquitetura cloud para banca e aviação",
    "Como o Cesar aborda infraestrutura de IA e automação?",
    "O Cesar está disponível para projetos internacionais?",
  ],
  assistantFollowUps: {
    kubernetes: [
      "Mostrar experiência de produção com GKE",
      "Mostrar projetos de engenharia de plataformas",
      "Mostrar exemplos de infraestrutura com Terraform",
      "Mostrar trabalho com Argo CD e GitOps",
    ],
    finops: [
      "Que poupanças em cloud o Cesar gerou?",
      "Mostrar ferramentas de automação FinOps usadas",
      "Mostrar experiência em faturação multi-cloud",
      "Como o Cesar aborda a governação cloud?",
    ],
    leadership: [
      "Mostrar exemplos de liderança de equipes",
      "O Cesar fundou ou liderou uma empresa?",
      "Mostrar experiência em pré-vendas técnicas",
      "Mostrar exemplos de entrega multifuncional",
    ],
    architecture: [
      "Mostrar trabalho de arquitetura cloud bancária",
      "Mostrar design de engenharia de plataformas",
      "Mostrar experiência em redes multi-cloud",
      "Em que indústrias reguladas o Cesar trabalhou?",
    ],
    gcp: [
      "Mostrar credenciais GCP Professional Cloud Architect",
      "Mostrar trabalho com BigQuery e plataformas de dados",
      "Mostrar deployments GKE em produção",
      "Mostrar experiência FinOps no Google Cloud",
    ],
    cloud: [
      "Mostrar experiência AWS",
      "Mostrar experiência Azure",
      "Mostrar governação multi-cloud",
      "Mostrar projetos de migração cloud",
    ],
    enterprise: [
      "Mostrar clientes bancários e de aviação",
      "Mostrar experiência em indústrias reguladas",
      "Mostrar entrega com 99,9% de disponibilidade",
      "Mostrar entrega presencial vs remota",
    ],
    ai: [
      "Mostrar trabalho de integração LLM",
      "Mostrar plataformas de infraestrutura de IA",
      "Mostrar trabalho de automação e agentes",
      "Como o Cesar aborda GenAI?",
    ],
    fallback: [
      "Que poupanças mensuráveis em cloud o Cesar gerou?",
      "Mostrar experiência Kubernetes em produção",
      "O Cesar liderou equipes ou grandes iniciativas?",
      "O Cesar está disponível para projetos internacionais?",
    ],
  },
  story: {
    pullQuote: "Cresci no Brasil 🇧🇷. Vim pra Europa. São 10+ anos construindo infraestrutura que não cai, pra bancos, companhias aéreas e empresas que não podem se dar ao luxo de falhar.",
    p1: "Comecei em São Paulo, construindo plataformas de dados e sistemas de software pra grandes empresas. Cloud me fisgou cedo: o desafio de deixar sistemas distribuídos confiáveis, observáveis e eficientes em custo na escala certa. Isso virou minha carreira.",
    p2: "Vim pra Europa com vinte e poucos anos, e isso mudou como eu enxergo esse trabalho. Trabalhar com fusos, idiomas e culturas diferentes me ensinou o que certificação nenhuma ensina: problema de cloud é quase sempre problema de gente. Sistema cai porque time não se fala. Custo explode porque ninguém é dono. Plataforma quebra porque os incentivos estão errados.",
    p3: "Desde então construí plataformas pra bancos em Londres e Madrid, companhias aéreas na América Latina, empresas de mídia nos EUA e negócios no mundo inteiro. Fundei a UP2CLOUD pra fazer esse trabalho do meu jeito, focado em resultado, não em headcount.",
  },
  projects: {
    "finops-automation": {
      category: "FinOps & Otimização de Custos",
      title: "Plataforma de Automação FinOps Empresarial",
      client: "Líder global de staffing",
      problem: "O gasto em cloud nas plataformas GCP, AWS e Azure estava fragmentado, sem etiquetas e crescia mais rápido do que a visibilidade permitia.",
      architecture: "Automação em Python contra APIs de faturação multi-cloud, ingestão no CloudHealth, CI/CD com CloudBees e jobs agendados de relatórios de custos com auto-etiquetagem a alimentar dashboards executivos.",
      scale: "Estate multi-conta e multi-cloud",
      impact: ["~30% de redução de desperdício", "Etiquetagem e chargeback automatizados", "Visibilidade de custos para a gestão"],
      outcome: "Eliminou ~30% de desperdício em cloud e deu às finanças visibilidade em tempo real por equipa.",
      lessons: "Governança antes de otimização. Não se pode cortar o que não se vê, e a parte mais difícil foi alinhar 12 equipas de plataforma numa taxonomia de etiquetagem unificada. As soluções técnicas são fáceis; o alinhamento organizacional é o verdadeiro trabalho.",
      metricLabel: "desperdício em cloud",
    },
    "bigdata-platform": {
      category: "Engenharia de Plataformas de Dados",
      title: "Plataforma de Analytics de Big Data",
      client: "Corporação de media de massas (EUA)",
      problem: "Uma empresa de media precisava de uma plataforma de analytics escalável para processar e consultar fluxos massivos de eventos.",
      architecture: "Pipelines Apache Beam no Google DataFlow, serviços App Engine e um armazém BigQuery, construído em Java/Node.js com frontend React.",
      scale: "Ingestão de eventos à escala massiva",
      impact: ["Pipelines de dados em tempo real", "Analytics BigQuery self-service", "Entrega elástica com App Engine"],
      outcome: "Desbloqueou analytics self-service em tempo real sobre fluxos massivos de eventos no Google Cloud.",
      lessons: "Desenhado para evolução de schema, não apenas para throughput. Os schemas de eventos mudaram seis vezes durante o projeto. Incorporar a evolução de schema no pipeline desde o primeiro dia teria poupado semanas de retrabalho.",
      metricLabel: "throughput analítico",
    },
    "banking-cloud": {
      category: "Modernização de Plataformas",
      title: "Multi-Cloud para Banca & Aviação",
      client: "AndBank · Santander · LATAM Airlines",
      problem: "Empresas reguladas exigiam infraestrutura cloud resiliente, segura e observável em GCP, AWS, Azure e OCI.",
      architecture: "Design de redes VPC, controlos de segurança para dados PII e sensíveis, e observabilidade completa via New Relic, PagerDuty e StackStorm com dashboards configuráveis.",
      scale: "Cargas de trabalho empresariais reguladas",
      impact: ["Segurança PII reforçada", "Observabilidade 24/7 e on-call", "Redes multi-cloud resilientes"],
      outcome: "Entregou cloud segura, observável e pronta para auditores na banca e aviação com 99,9% de disponibilidade.",
      lessons: "Na indústria regulada, observabilidade é prova, não apenas ferramenta. Dashboards prontos para auditoria e alertas automatizados desde o primeiro dia fizeram a diferença entre passar e reprovar nas revisões de conformidade.",
      metricLabel: "disponibilidade",
    },
  },
  capabilities: [
    { area: "Arquitetura Cloud",        level: "Principal",         note: "Multi-cloud em GCP, AWS, Azure & OCI para empresas reguladas." },
    { area: "Engenharia de Plataformas",level: "Expert",            note: "Golden paths, plataformas self-service e Kubernetes à escala." },
    { area: "DevOps & CI/CD",           level: "Expert",            note: "Design de pipelines e automação de entrega do início ao fim." },
    { area: "FinOps",                   level: "Especialista",      note: "Otimização de custos, etiquetagem, chargeback e previsão que remove desperdício real." },
    { area: "Infraestrutura como Código",level: "Expert",           note: "Infraestrutura reproduzível e revisável em múltiplas clouds." },
    { area: "Observabilidade",          level: "Expert",            note: "Monitorização 24/7, on-call e ferramentas de incidente para sistemas críticos." },
    { area: "Plataformas de Dados",     level: "Avançado",          note: "Pipelines em tempo real e armazenamento no Google Cloud." },
    { area: "Infraestrutura de IA",     level: "Foco crescente",    note: "Plataformas escaláveis, observáveis e conscientes de custos para workloads GenAI." },
  ],
  scanner: {
    triggerLabel: "Avaliar o Cesar",
    triggerTitle: "Avaliar o Cesar para uma função (⌘⇧E)",
    phaseScanning: "Iniciando análise do candidato…",
    phaseAnalyzing: "Analisando perfil do candidato…",
    phaseReport: "Forte compatibilidade — aprovado para entrevista · Disponível agora",
    statusScanning: "Verificando registro do candidato…",
    statusAnalyzing: "Avaliando {n} / {total} competências",
    statusReport: "{total}/{total} competências verificadas · Sinal de contratação: forte",
    closeLabel: "Fechar",
    candidateEvalLabel: "Avaliação do Candidato",
    competencyScores: "Pontuações por Competência",
    evidenceProjects: "Projetos",
    evidenceTech: "Tecnologias",
    evidenceProduction: "Produção",
    evidenceImpact: "Impacto",
    evidenceCerts: "Certificações",
    assessmentComplete: "Avaliação Concluída",
    hireRecommendation: "Recomendação de Contratação",
    verdict: "Avançar para Entrevista",
    overallFit: "Compatibilidade Geral",
    fitValue: "Alta Compatibilidade",
    riskLevel: "Nível de Risco",
    riskValue: "Baixo",
    availability: "Disponibilidade",
    availabilityValue: "Agora",
    bestFitRoles: "Funções com Maior Compatibilidade",
    businessImpact: "Impacto nos Negócios",
    scheduleInterview: "Agendar Entrevista",
    emailCesar: "Enviar mensagem ao César →",
    downloadCv: "Baixar CV",
    expandHint: "Expanda qualquer competência acima para ver projetos, evidências e certificações",
    dialogDismissHint: "Fechar para revisar o detalhamento completo de competências",
    dialogSendMessage: "Enviar uma Mensagem ao César →",
    dialogFitLabel: "Fit",
    dialogRiskLabel: "Risco",
    dialogAvailLabel: "Disponível",
    dialogVerifiedLabel: "Verificadas",
  },
  recruiterMode: {
    backToRoles: "← Todas as funções",
    fitEvaluation: "Avaliação de Fit",
    strengths: "Pontos Fortes",
    evidence: "Evidências",
    considerations: "Considerações",
    interviewTopics: "Tópicos de Entrevista",
    noConcerns: "Nenhuma preocupação significativa identificada.",
    ctaText: "Quer discutir esta avaliação ou explorar um cenário específico?",
    ctaButton: "Enviar mensagem ao César →",
    roleGridIntro: "Selecione uma função para gerar uma avaliação de fit estruturada — pontos fortes, evidências, considerações e tópicos de entrevista.",
    quickInsights: "Insights Rápidos",
    scoreLabelExcellent: "Excelente fit",
    scoreLabelStrong: "Forte fit",
    scoreLabelGood: "Bom fit",
    scoreLabelPartial: "Fit parcial",
    quickExec: "Executivo",
    quickImpact: "Impacto",
    quickCredentials: "Credenciais",
    quickCareer: "Carreira",
    hiringAssistant: "Assistente de Recrutamento",
    tabRoleFit: "Fit do Cargo",
    tabAIChat: "Chat IA",
    roleStrengths: {
      "cloud-architect": ["2× Google Cloud Professional Architect (recertificado)", "Multi-cloud em escala enterprise: GCP, AWS, Azure, OCI", "10+ anos projetando cloud regulada para bancos e aviação", "Fundador da UP2CLOUD — arquitetura como serviço globalmente"],
      "platform-engineer": ["Kubernetes (GKE) em produção na Accenture, ZeroLight, everis", "Terraform para IaC multi-cloud reproduzível", "Argo CD, GitHub Actions, GitLab CI — pipelines GitOps", "Capacitação de desenvolvedores: golden paths, plataformas self-service"],
      "devops-lead": ["CI/CD em escala: CloudBees, Jenkins, Spinnaker, GitHub Actions", "40% mais rápido em deploys com redesign de pipeline na Randstad Digital", "Observabilidade: New Relic, PagerDuty, StackStorm — on-call 24/7", "Tagging automático, relatórios de custo e chargeback em Python"],
      "finops-engineer": ["Engenheiro de Automação FinOps dedicado na Randstad Digital (3,5 anos)", "~30% redução de desperdício cloud em GCP, AWS, Azure — documentado", "Automação Python contra APIs de faturação multi-cloud", "CloudHealth, relatórios de chargeback, tagging automatizado em escala enterprise"],
      "staff-engineer": ["Gerente de Arquitetura de Tecnologia na Accenture (liderança técnica + pessoas)", "Fundador da UP2CLOUD — responsável por decisões de arquitetura ponta a ponta", "Multifuncional: pré-venda técnica, entrega, arquitetura, mentoria", "Treinou 120+ engenheiros da Accenture para certificação Google Cloud"],
      "ai-infrastructure": ["Base de infraestrutura para IA: agendamento de GPU, plataformas de inferência com controlo de custos", "Integrações LLM e RAG sobre bases de conhecimento privadas (produção)", "Engenharia de plataforma diretamente aplicável a infraestrutura MLOps", "Automação IA: deteção de anomalias de custo, agentes de automação de operações"],
      "consultant": ["Fundador e principal da UP2CLOUD — consultoria cloud B2B (2022–presente)", "Entrega internacional: Portugal, Espanha, Holanda, UK, Brasil, clientes dos EUA", "Histórico enterprise: banca, aviação, media, staffing, automóvel", "Modelo B2B: arquitetura fracionada, construção de plataformas, projetos FinOps"],
    },
  },
};

const es: Dict = {
  nav: {
    summary: "Resumen",
    experience: "Impacto",
    work: "Casos",
    capabilities: "Competencias",
    trust: "Confianza",
    global: "Global",
    contact: "Contato",
  },
  hero: {
    available: "Disponible para consultoría global",
    roleLine: "Cloud · DevOps · FinOps · Infraestructura de IA",
    desc: "10+ años construyendo infraestructura cloud para bancos, aerolíneas y empresas. Hago plataformas fiables, observables y que valen cada euro invertido.",
    chips: [
      "10+ años en cloud",
      "GCP · AWS · Azure · OCI",
      "🇧🇷 Brasil → 🇵🇹 Portugal",
      "Remoto, en todo el mundo",
      "Disponible ahora",
    ],
    ctaPrimary: "Hablemos",
    ctaSecondary: "Ver el trabajo",
  },
  sections: {
    summary: {
      label: "Quién Soy",
      title: "Arquitecto, ingeniero y estratega",
      intro:
        "Diez años de cloud, tres continentes, un objetivo constante: plataformas que funcionan de verdad en producción.",
    },
    experience: {
      label: "Carrera",
      title: "Resultados entregados durante una década de liderazgo cloud",
      intro:
        "Los roles que moldearon cómo pienso sobre cloud, coste y liderazgo de ingeniería. Expande cualquier tarjeta para la historia completa.",
    },
    work: {
      label: "Casos de Impacto",
      title: "Tres proyectos. Tres problemas difíciles. Tres resultados.",
      intro:
        "Cada caso sigue el arco completo: el desafío, el enfoque, el resultado y lo que aprendí de él.",
    },
    capabilities: {
      label: "Profundidad Técnica",
      title: "Profundidad donde importa, sin métricas de vanidad",
      intro:
        "Cada competencia mostrada por nivel y por las herramientas que la respaldan. Alcance y prueba, no barras de progreso.",
    },
    trust: {
      label: "Confianza Empresarial",
      title: "De confianza para sistemas regulados de alto riesgo",
      intro:
        "Bancos, aerolíneas y grandes empresas, en cuatro proveedores de cloud y seis industrias.",
    },
    global: {
      label: "Entrega Global",
      title: "Basado en Portugal. Entrega global.",
      intro:
        "De Brasil a Europa y por toda América: cloud, DevOps, ingeniería de plataformas y FinOps entregados donde está el trabajo.",
    },
    certifications: {
      label: "Certificaciones",
      title: "Credenciales multi-cloud verificadas",
      intro: "Experiencia validada en las tres grandes clouds, más práctica de FinOps.",
    },
    stack: {
      label: "Paisaje Tecnológico",
      title: "Una galaxia de ingeniería, no una lista de insignias",
      intro:
        "Un grafo dinámico de todo el stack: clouds, orquestación, CI/CD, datos y FinOps. Arrastra, haz zoom y explora las conexiones.",
    },
    finops: {
      label: "Ingeniería de Costes Cloud",
      title: "El coste cloud como disciplina de ingeniería",
      intro:
        "Optimización de costes, dimensionamiento, gobierno, previsión, imputación y automatización, medido, no adivinado.",
    },
    ai: {
      label: "IA & Automatización",
      title: "Ingeniería de plataformas para IA: observable, fiable, con costes controlados",
      intro:
        "De integraciones con LLMs a la ingeniería de plataformas con GPUs: infraestructura que hace la IA fiable, observable y consciente del coste.",
    },
    testimonials: {
      label: "Reconocimiento",
      title: "Avalado por ingenieros y líderes",
    },
    contact: {
      label: "Iniciar Conversación",
      title: "Dime qué estás construyendo",
      intro:
        "Arquitectura cloud, ingeniería de plataformas, FinOps, infraestructura de IA: si el trabajo es serio, quiero escucharlo.",
    },
  },
  exec: [
    {
      title: "El camino",
      headline: "Construido desde Portugal, entregado al mundo",
      body: "Empecé en Brasil. Pasé por São Paulo, Londres, Madrid y varios husos horarios. Construí plataformas para bancos, aerolíneas y empresas de medios. Aprendí lo que significa cuando la producción falla a las 3am, y cómo evitar que vuelva a ocurrir.",
    },
    {
      title: "La ventaja",
      headline: "Profundidad técnica que llega a la hoja de costes",
      body: "He sido el arquitecto que diseña el sistema y el responsable FinOps que vigila la factura. Esa combinación, conocer tanto la infraestructura como su coste real, es poco común, y cambia lo que construyes.",
    },
    {
      title: "El enfoque",
      headline: "Plataformas que los equipos aman. Costes que bajan.",
      body: "Multi-cloud en GCP, AWS, Azure y OCI. Kubernetes, Terraform, CI/CD. Gobernanza de costes. Infraestructura preparada para IA. Entornos regulados y a escala empresarial donde los riesgos son reales.",
    },
    {
      title: "La colaboración",
      headline: "Un socio de confianza, no un ejecutor de tickets",
      body: "Consultoría independiente vía UP2CLOUD para clientes internacionales. Arquitectura fraccionada, construcción de plataformas o proyectos FinOps. Prefiero trabajos donde pueda quedarme el tiempo suficiente para ver el impacto crecer. Disponible ahora, suele responder en 24h.",
    },
  ],
  recruiter: {
    banner:
      "Modo Reclutador: impacto, liderazgo, certificaciones y disponibilidad destacados",
    exit: "salir",
    on: "Modo Reclutador: Activo",
    off: "Modo Reclutador",
  },
  assistant: {
    launch: "FAQ Inteligente",
    close: "Cerrar",
    header: "Asistente de Carrera IA",
    subtitle: "Lo sabe todo sobre Cesar · responde desde su perfil real",
    greeting:
      "Soy el Asistente de Carrera IA de Cesar. Conozco todo su recorrido. Pregunta lo que necesita una decisión de contratación: seniority, escala, liderazgo, impacto en costes, certificaciones o disponibilidad. Prueba una pregunta abajo.",
    suggested: "Sugerencias para reclutadores",
    placeholder: "Pregunta por el encaje de Cesar en tu puesto…",
    thinking: "Pensando…",
    followUp: "Seguir",
    sourceLabel: "Basado en el perfil",
  },
  portraitCaption: "São Paulo 🇧🇷 → Vila Real 🇵🇹",
  contact: {
    briefingTitle: "Trabajemos juntos",
    briefingDesc: "Arquitectura cloud, ingeniería de plataformas, DevOps, FinOps o infraestructura de IA. Cuéntame qué estás construyendo y exploremos cómo trabajar juntos.",
    emailCta: "Enviar mensaje a Cesar",
    downloadCv: "Descargar CV",
    availability: "Disponible para proyectos internacionales",
    responseTime: "Suele responder en 24h",
    contactQuote: "Cada proyecto en el que he trabajado ha sido la infraestructura crítica de alguien: la plataforma de pagos de un banco, el sistema de operaciones de una aerolínea, la columna vertebral de datos de una empresa de medios. Me tomo esa responsabilidad en serio. Si estás construyendo algo que importa, me encantaría escuchar al respecto.",
    formTitle: "Enviar un mensaje a Cesar",
    formSubtitle: "Responde en 24h",
    formName: "Nombre",
    formEmail: "Email",
    formSubject: "Asunto",
    formMessage: "Mensaje",
    formNamePlaceholder: "Tu nombre",
    formEmailPlaceholder: "tu@empresa.com",
    formSubjectPlaceholder: "Propuesta de proyecto, oportunidad…",
    formMessagePlaceholder: "Dile a Cesar qué estás construyendo y cómo puede ayudarte…",
    formSend: "Enviar mensaje",
    formSending: "Enviando…",
    formCancel: "Cancelar",
    formSuccess: "Mensaje enviado",
    formSuccessDesc: "Cesar te responderá en 24 horas.",
    formError: "Algo salió mal. Escribe directamente a:",
    rowLabels: {
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      location: "Ubicación",
      responseTime: "Tiempo de respuesta",
    },
  },
  statsLabels: ["Años en Tecnología", "Proyectos Cloud", "Certificaciones", "Residuos Cloud Eliminados"],
  labels: {
    problem: "El Desafío",
    architecture: "El Enfoque",
    businessResult: "El Resultado",
    lessons: "Lo que aprendí",
    aiFaqNote: "// El Smart AI FAQ de este sitio es una integración de IA. Pregúntale lo que necesites sobre la idoneidad de Cesar para tu puesto.",
    trustCompanies: "Empresas",
    trustIndustries: "Setores",
    trustClouds: "Plataformas Cloud",
    challenge: "Desafío",
    action: "Acción",
    result: "Resultado",
    leadership: "Liderazgo",
    homeBase: "Base Principal",
    verified: "verificadas",
    loadingGalaxy: "cargando galaxia…",
    operatingModel: "Modelo operativo",
    monthlyCostLabel: "Gasto mensual cloud · optimizado",
    filterAll: "Todos",
    filterEurope: "Europa",
    filterAmericas: "Américas",
    filterRemote: "Remoto",
    filterOnsite: "Presencial",
    filterHybrid: "Híbrido",
    region: "Región",
    deliveryType: "Tipo",
  },
  palette: {
    placeholder: "Buscar secciones, habilidades, contacto…",
    noResults: "Sin resultados.",
    ariaClose: "Cerrar",
    groups: { navigate: "Navegar", actions: "Acciones", contact: "Contato" },
    home: "Inicio",
    darkTheme: "Tema oscuro",
    lightTheme: "Tema claro",
    openFaq: "Abrir Smart AI FAQ",
    emailCesar: "Enviar email a Cesar",
    downloadCv: "Descargar CV",
    search: "Buscar",
    navigate: "Navegar",
    commandPalette: "Paleta de comandos",
  },
  recruiterPrompts: [
    "¿Por qué es Cesar un candidato sólido para roles cloud senior?",
    "¿Qué ahorro medible en cloud ha generado Cesar?",
    "Mostrar experiencia Kubernetes en producción",
    "¿Cómo aborda Cesar el FinOps a escala empresarial?",
    "¿Qué certificaciones GCP y experiencia práctica tiene Cesar?",
    "¿Ha liderado Cesar equipos o grandes iniciativas cloud?",
    "¿En qué industrias reguladas ha entregado Cesar proyectos?",
    "Mostrar arquitectura cloud para banca y aviación",
    "¿Cómo aborda Cesar la infraestructura de IA y automatización?",
    "¿Está Cesar disponible para proyectos internacionales?",
  ],
  assistantFollowUps: {
    kubernetes: [
      "Mostrar experiencia GKE en producción",
      "Mostrar proyectos de ingeniería de plataformas",
      "Mostrar ejemplos de infraestructura con Terraform",
      "Mostrar trabajo con Argo CD y GitOps",
    ],
    finops: [
      "¿Qué ahorro cloud ha generado Cesar?",
      "Mostrar herramientas de automatización FinOps usadas",
      "Mostrar experiencia en facturación multi-cloud",
      "¿Cómo aborda Cesar la gobernanza cloud?",
    ],
    leadership: [
      "Mostrar ejemplos de liderazgo de equipos",
      "¿Cesar ha fundado o liderado una empresa?",
      "Mostrar experiencia en preventa técnica",
      "Mostrar ejemplos de entrega multifuncional",
    ],
    architecture: [
      "Mostrar trabajo de arquitectura cloud bancaria",
      "Mostrar diseño de ingeniería de plataformas",
      "Mostrar experiencia en redes multi-cloud",
      "¿En qué industrias reguladas ha trabajado Cesar?",
    ],
    gcp: [
      "Mostrar credenciales GCP Professional Cloud Architect",
      "Mostrar trabajo con BigQuery y plataformas de datos",
      "Mostrar despliegues GKE en producción",
      "Mostrar experiencia FinOps en Google Cloud",
    ],
    cloud: [
      "Mostrar experiencia AWS",
      "Mostrar experiencia Azure",
      "Mostrar gobernanza multi-cloud",
      "Mostrar proyectos de migración cloud",
    ],
    enterprise: [
      "Mostrar clientes bancarios y de aviación",
      "Mostrar experiencia en industrias reguladas",
      "Mostrar entrega con 99,9% de disponibilidad",
      "Mostrar entrega presencial vs remota",
    ],
    ai: [
      "Mostrar trabajo de integración LLM",
      "Mostrar plataformas de infraestructura IA",
      "Mostrar trabajo de automatización y agentes",
      "¿Cómo aborda Cesar GenAI?",
    ],
    fallback: [
      "¿Qué ahorro cloud medible ha generado Cesar?",
      "Mostrar experiencia Kubernetes en producción",
      "¿Cesar ha liderado equipos o grandes iniciativas?",
      "¿Cesar está disponible para proyectos internacionales?",
    ],
  },
  story: {
    pullQuote: "Crecí en Brasil 🇧🇷. Me mudé a Europa. Llevo 10+ años construyendo infraestructura que no falla, para bancos, aerolíneas y empresas que no pueden permitirse que falle.",
    p1: "Empecé en São Paulo, construyendo plataformas de datos y sistemas para grandes empresas. La infraestructura cloud me enganchó pronto: el reto de hacer sistemas distribuidos fiables, observables y eficientes en coste a escala. Eso se convirtió en mi carrera.",
    p2: "Mudarme a Europa a mediados de los veinte cambió cómo pienso sobre este trabajo. Trabajar en distintas zonas horarias, idiomas y culturas me enseñó lo que las certificaciones no enseñan: los problemas de cloud son sobre todo problemas de personas. Los sistemas fallan porque los equipos no se comunican. Los costes se disparan porque nadie los gestiona. Las plataformas fallan porque los incentivos están mal alineados.",
    p3: "Desde entonces he construido plataformas para bancos en Londres y Madrid, aerolíneas en América Latina, empresas de medios en EE.UU. y empresas de todo el mundo. Fundé UP2CLOUD para hacer este trabajo en mis propios términos, centrado en resultados, no en plantilla.",
  },
  projects: {
    "finops-automation": {
      category: "FinOps & Optimización de Costes",
      title: "Plataforma de Automatización FinOps Empresarial",
      client: "Líder global de staffing",
      problem: "El gasto cloud en GCP, AWS y Azure estaba fragmentado, sin etiquetas y crecía más rápido de lo que la visibilidad permitía.",
      architecture: "Automatización en Python contra APIs de facturación multi-cloud, ingesta en CloudHealth, CI/CD con CloudBees y trabajos programados de informes de costes con auto-etiquetado alimentando dashboards ejecutivos.",
      scale: "Estate multi-cuenta y multi-cloud",
      impact: ["~30% de reducción de desperdicio", "Etiquetado y chargeback automatizados", "Visibilidad de costes para dirección"],
      outcome: "Eliminó ~30% de desperdicio cloud y dio a finanzas visibilidad en tiempo real por equipo.",
      lessons: "Gobernanza antes de optimización. No puedes recortar lo que no ves, y la parte más difícil fue alinear 12 equipos de plataforma en una taxonomía de etiquetado unificada. Las soluciones técnicas son fáciles; el alineamiento organizacional es el trabajo real.",
      metricLabel: "desperdicio cloud",
    },
    "bigdata-platform": {
      category: "Ingeniería de Plataformas de Datos",
      title: "Plataforma de Analytics de Big Data",
      client: "Corporación de medios de masas (EE.UU.)",
      problem: "Una empresa de medios necesitaba una plataforma de analytics escalable para procesar y consultar flujos masivos de eventos.",
      architecture: "Pipelines Apache Beam en Google DataFlow, servicios App Engine y un almacén BigQuery, construido en Java/Node.js con frontend React.",
      scale: "Ingesta de eventos a escala masiva",
      impact: ["Pipelines de datos en tiempo real", "Analytics BigQuery self-service", "Entrega elástica con App Engine"],
      outcome: "Desbloqueó analytics self-service en tiempo real sobre flujos masivos de eventos en Google Cloud.",
      lessons: "Diseñado para evolución de esquema, no solo para throughput. Los esquemas de eventos cambiaron seis veces durante el proyecto. Incorporar la evolución de esquema en el pipeline desde el primer día habría ahorrado semanas de retrabajo.",
      metricLabel: "throughput analítico",
    },
    "banking-cloud": {
      category: "Modernización de Plataformas",
      title: "Multi-Cloud para Banca y Aviación",
      client: "AndBank · Santander · LATAM Airlines",
      problem: "Las empresas reguladas requerían infraestructura cloud resiliente, segura y observable en GCP, AWS, Azure y OCI.",
      architecture: "Diseño de redes VPC, controles de seguridad para datos PII y sensibles, y observabilidad completa mediante New Relic, PagerDuty y StackStorm con dashboards configurables.",
      scale: "Cargas de trabajo empresariales reguladas",
      impact: ["Seguridad PII reforzada", "Observabilidad 24/7 y on-call", "Redes multi-cloud resilientes"],
      outcome: "Entregó cloud segura, observable y lista para reguladores en banca y aviación con 99,9% de disponibilidad.",
      lessons: "En industrias reguladas, la observabilidad es prueba, no solo herramienta. Los dashboards listos para auditoría y las alertas automatizadas desde el primer día marcaron la diferencia entre pasar y reprobar las revisiones de cumplimiento.",
      metricLabel: "disponibilidad",
    },
  },
  capabilities: [
    { area: "Arquitectura Cloud",        level: "Principal",          note: "Multi-cloud en GCP, AWS, Azure y OCI para empresas reguladas." },
    { area: "Ingeniería de Plataformas", level: "Experto",            note: "Golden paths, plataformas self-service y Kubernetes a escala." },
    { area: "DevOps & CI/CD",            level: "Experto",            note: "Diseño de pipelines y automatización de entrega de principio a fin." },
    { area: "FinOps",                    level: "Especialista",       note: "Optimización de costes, etiquetado, chargeback y previsión que elimina desperdicio real." },
    { area: "Infraestructura como Código",level: "Experto",           note: "Infraestructura reproducible y revisable en múltiples clouds." },
    { area: "Observabilidad",            level: "Experto",            note: "Monitorización 24/7, on-call y herramientas de incidentes para sistemas críticos." },
    { area: "Plataformas de Datos",      level: "Avanzado",           note: "Pipelines en tiempo real y almacenamiento en Google Cloud." },
    { area: "Infraestructura de IA",     level: "Foco creciente",     note: "Plataformas escalables, observables y conscientes del coste para cargas GenAI." },
  ],
  scanner: {
    triggerLabel: "Evaluar a Cesar",
    triggerTitle: "Evaluar a Cesar para un puesto (⌘⇧E)",
    phaseScanning: "Iniciando análisis del candidato…",
    phaseAnalyzing: "Analizando perfil del candidato…",
    phaseReport: "Fuerte compatibilidad — autorizado para entrevista · Disponible ahora",
    statusScanning: "Verificando registro del candidato…",
    statusAnalyzing: "Evaluando {n} / {total} competencias",
    statusReport: "{total}/{total} competencias verificadas · Señal de contratación: fuerte",
    closeLabel: "Cerrar",
    candidateEvalLabel: "Evaluación del Candidato",
    competencyScores: "Puntuaciones por Competencia",
    evidenceProjects: "Proyectos",
    evidenceTech: "Tecnologías",
    evidenceProduction: "Producción",
    evidenceImpact: "Impacto",
    evidenceCerts: "Certificaciones",
    assessmentComplete: "Evaluación Completada",
    hireRecommendation: "Recomendación de Contratación",
    verdict: "Proceder a Entrevista",
    overallFit: "Compatibilidad General",
    fitValue: "Alta Compatibilidad",
    riskLevel: "Nivel de Riesgo",
    riskValue: "Bajo",
    availability: "Disponibilidad",
    availabilityValue: "Ahora",
    bestFitRoles: "Roles de Mayor Compatibilidad",
    businessImpact: "Impacto en el Negocio",
    scheduleInterview: "Programar Entrevista",
    emailCesar: "Escribir a César →",
    downloadCv: "Descargar CV",
    expandHint: "Expanda cualquier competencia para ver proyectos, evidencia y certificaciones",
    dialogDismissHint: "Cerrar para revisar el desglose completo de competencias",
    dialogSendMessage: "Enviar un Mensaje a César →",
    dialogFitLabel: "Fit",
    dialogRiskLabel: "Riesgo",
    dialogAvailLabel: "Disponible",
    dialogVerifiedLabel: "Verificadas",
  },
  recruiterMode: {
    backToRoles: "← Todos los roles",
    fitEvaluation: "Evaluación de Fit",
    strengths: "Fortalezas",
    evidence: "Evidencia",
    considerations: "Consideraciones",
    interviewTopics: "Temas de Entrevista",
    noConcerns: "No se identificaron preocupaciones significativas.",
    ctaText: "¿Quiere discutir esta evaluación o explorar un escenario específico?",
    ctaButton: "Escribir a César →",
    roleGridIntro: "Seleccione un rol para generar una evaluación de fit estructurada — fortalezas, evidencia, consideraciones y temas de entrevista.",
    quickInsights: "Insights Rápidos",
    scoreLabelExcellent: "Excelente fit",
    scoreLabelStrong: "Fuerte fit",
    scoreLabelGood: "Buen fit",
    scoreLabelPartial: "Fit parcial",
    quickExec: "Ejecutivo",
    quickImpact: "Impacto",
    quickCredentials: "Credenciales",
    quickCareer: "Carrera",
    hiringAssistant: "Asistente de Contratación",
    tabRoleFit: "Ajuste al Rol",
    tabAIChat: "Chat IA",
    roleStrengths: {
      "cloud-architect": ["2× Google Cloud Professional Architect (recertificado)", "Multi-cloud a escala enterprise: GCP, AWS, Azure, OCI", "10+ años diseñando cloud regulado para banca y aviación", "Fundador de UP2CLOUD — arquitectura como servicio globalmente"],
      "platform-engineer": ["Kubernetes (GKE) en producción en Accenture, ZeroLight, everis", "Terraform para IaC multi-cloud reproducible", "Argo CD, GitHub Actions, GitLab CI — pipelines GitOps", "Habilitación de desarrolladores: golden paths, plataformas self-service"],
      "devops-lead": ["CI/CD a escala: CloudBees, Jenkins, Spinnaker, GitHub Actions", "40% más rápido en deploys con rediseño de pipeline en Randstad Digital", "Observabilidad: New Relic, PagerDuty, StackStorm — on-call 24/7", "Etiquetado automático, reporting de costes y chargeback en Python"],
      "finops-engineer": ["Ingeniero de Automatización FinOps dedicado en Randstad Digital (3,5 años)", "~30% reducción de residuos cloud en GCP, AWS, Azure — documentado", "Automatización Python contra APIs de facturación multi-cloud", "CloudHealth, reporting de chargeback, etiquetado automatizado a escala enterprise"],
      "staff-engineer": ["Gerente de Arquitectura de Tecnología en Accenture (liderazgo técnico + personas)", "Fundador de UP2CLOUD — responsable de decisiones de arquitectura de punta a punta", "Multifuncional: preventa técnica, entrega, arquitectura, mentoría", "Formó a 120+ ingenieros de Accenture para certificación Google Cloud"],
      "ai-infrastructure": ["Base de infraestructura para IA: programación de GPU, plataformas de inferencia conscientes del coste", "Integraciones LLM y RAG sobre bases de conocimiento privadas (producción)", "Ingeniería de plataforma directamente aplicable a infraestructura MLOps", "Automatización IA: detección de anomalías de coste, agentes de automatización de operaciones"],
      "consultant": ["Fundador y principal de UP2CLOUD — consultoría cloud B2B (2022–presente)", "Entrega internacional: Portugal, España, Países Bajos, UK, Brasil, clientes de EE.UU.", "Historial enterprise: banca, aviación, medios, staffing, automoción", "Modelo B2B: arquitectura fraccionada, construcción de plataformas, proyectos FinOps"],
    },
  },
};

const fr: Dict = {
  nav: {
    summary: "Résumé",
    experience: "Impact",
    work: "Projets",
    capabilities: "Expertise",
    trust: "Confiance",
    global: "Global",
    contact: "Contact",
  },
  hero: {
    available: "Disponible pour des missions de conseil",
    roleLine: "Cloud · DevOps · FinOps · Infrastructure IA",
    desc: "10+ ans à construire l'infrastructure cloud pour des banques, des compagnies aériennes et des entreprises. Je construis des plateformes fiables, observables et qui valent chaque euro investi.",
    chips: [
      "10+ ans en cloud",
      "GCP · AWS · Azure · OCI",
      "🇧🇷 Brésil → 🇵🇹 Portugal",
      "Remote-first, mondial",
      "Disponible maintenant",
    ],
    ctaPrimary: "Discutons",
    ctaSecondary: "Voir les projets",
  },
  sections: {
    summary: {
      label: "Qui Je Suis",
      title: "Architecte, ingénieur et stratège",
      intro:
        "Dix ans de cloud, trois continents, un objectif constant : des plateformes qui fonctionnent vraiment en production.",
    },
    experience: {
      label: "Carrière",
      title: "Résultats livrés au cours d'une décennie de leadership cloud",
      intro:
        "Les rôles qui ont façonné ma façon de penser le cloud, les coûts et le leadership technique. Développez n'importe quelle carte pour l'histoire complète.",
    },
    work: {
      label: "Études de Cas",
      title: "Trois projets. Trois défis. Trois résultats.",
      intro:
        "Chaque étude de cas suit l'arc complet : le défi, l'approche, le résultat et ce que j'en ai appris.",
    },
    capabilities: {
      label: "Profondeur Technique",
      title: "Profondeur là où ça compte, sans métriques de vanité",
      intro:
        "Chaque compétence présentée par niveau et par les outils qui la soutiennent. Périmètre et preuves, pas des barres de progression.",
    },
    trust: {
      label: "Confiance Entreprise",
      title: "De confiance pour des systèmes réglementés à forts enjeux",
      intro:
        "Banques, compagnies aériennes et multinationales, sur quatre fournisseurs cloud et six secteurs.",
    },
    global: {
      label: "Livraison Mondiale",
      title: "Basé au Portugal. Livraison mondiale.",
      intro:
        "Du Brésil à l'Europe et à travers les Amériques: cloud, DevOps, ingénierie de plateformes et FinOps, livrés où le travail se trouve.",
    },
    certifications: {
      label: "Certifications",
      title: "Certifications multi-cloud vérifiées",
      intro: "Expertise validée sur les trois grands clouds et la pratique FinOps.",
    },
    stack: {
      label: "Paysage Technologique",
      title: "Une galaxie d'ingénierie, pas une liste de badges",
      intro:
        "Un graphe dynamique de la stack complète: clouds, orchestration, CI/CD, données et FinOps. Faites glisser, zoomez et explorez les connexions.",
    },
    finops: {
      label: "Ingénierie des Coûts Cloud",
      title: "Le coût cloud comme discipline d'ingénierie",
      intro:
        "Optimisation des coûts, redimensionnement, gouvernance, prévision, refacturation et automatisation, mesuré, pas deviné.",
    },
    ai: {
      label: "IA & Automatisation",
      title: "Ingénierie de plateformes pour l'IA : observable, fiable, économe",
      intro:
        "Des intégrations LLM à l'ingénierie de plateformes GPU: infrastructure qui rend l'IA fiable, observable et économe.",
    },
    testimonials: {
      label: "Références",
      title: "Reconnu par les ingénieurs et les dirigeants",
    },
    contact: {
      label: "Prenons Contact",
      title: "Dites-moi ce que vous construisez",
      intro:
        "Architecture cloud, ingénierie de plateformes, FinOps, infrastructure IA : si le travail est sérieux, je veux en entendre parler.",
    },
  },
  exec: [
    {
      title: "Le parcours",
      headline: "Construit depuis le Portugal, livré au monde entier",
      body: "J'ai commencé au Brésil. Travaillé à São Paulo, Londres, Madrid et dans plusieurs fuseaux horaires. Construit des plateformes pour des banques, des compagnies aériennes et des médias. Appris ce que signifie une panne en production à 3h du matin, et comment l'éviter.",
    },
    {
      title: "L'avantage",
      headline: "Une profondeur technique qui rejoint la feuille de coûts",
      body: "J'ai été à la fois l'architecte qui conçoit le système et le responsable FinOps qui surveille la facture. Cette combinaison, connaître à la fois l'infrastructure et son coût réel, est rare, et elle change ce qu'on construit.",
    },
    {
      title: "Le focus",
      headline: "Des plateformes que les équipes adorent. Des coûts qui baissent.",
      body: "Multi-cloud sur GCP, AWS, Azure et OCI. Kubernetes, Terraform, CI/CD. Gouvernance des coûts. Infrastructure IA-ready. Environnements réglementés à l'échelle entreprise où les enjeux sont réels.",
    },
    {
      title: "Le partenariat",
      headline: "Un partenaire de confiance, pas un exécutant de tickets",
      body: "Conseil indépendant via UP2CLOUD pour des clients internationaux. Architecture fractionnée, construction de plateformes ou missions FinOps. Je préfère les missions longues où je peux voir l'impact se construire. Disponible maintenant, répond sous 24h.",
    },
  ],
  recruiter: {
    banner:
      "Mode Recruteur: impact, leadership, certifications & disponibilité mis en avant",
    exit: "quitter",
    on: "Mode Recruteur : Actif",
    off: "Mode Recruteur",
  },
  assistant: {
    launch: "FAQ IA",
    close: "Fermer",
    header: "Assistant Carrière IA",
    subtitle: "Connaît tout sur Cesar · répond depuis son vrai profil",
    greeting:
      "Je suis l'Assistant Carrière IA de Cesar. Je connais tout son parcours. Posez tout ce qu'une décision de recrutement nécessite : séniorité, échelle, leadership, impact financier, certifications ou disponibilité. Essayez une question ci-dessous.",
    suggested: "Questions suggérées pour les recruteurs",
    placeholder: "Posez une question sur l'adéquation de Cesar à votre poste…",
    thinking: "Réflexion…",
    followUp: "Continuer",
    sourceLabel: "Basé sur le profil",
  },
  portraitCaption: "São Paulo 🇧🇷 → Vila Real 🇵🇹",
  contact: {
    briefingTitle: "Travaillons ensemble",
    briefingDesc: "Architecture cloud, ingénierie de plateformes, DevOps, FinOps ou infrastructure IA. Dites-moi ce que vous construisez et explorons comment collaborer.",
    emailCta: "Envoyer un message à Cesar",
    downloadCv: "Télécharger le CV",
    availability: "Disponible pour des projets internationaux",
    responseTime: "Répond généralement sous 24h",
    contactQuote: "Chaque projet sur lequel j'ai travaillé a été l'infrastructure critique de quelqu'un: la plateforme de paiement d'une banque, le système d'opérations d'une compagnie aérienne, la colonne vertébrale des données d'une entreprise de médias. Je prends cette responsabilité au sérieux. Si vous construisez quelque chose qui compte, j'aimerais vraiment en entendre parler.",
    formTitle: "Envoyer un message à Cesar",
    formSubtitle: "Répond sous 24h",
    formName: "Nom",
    formEmail: "Email",
    formSubject: "Sujet",
    formMessage: "Message",
    formNamePlaceholder: "Votre nom",
    formEmailPlaceholder: "vous@entreprise.com",
    formSubjectPlaceholder: "Proposition de projet, opportunité…",
    formMessagePlaceholder: "Dites à Cesar ce que vous construisez et comment il peut vous aider…",
    formSend: "Envoyer le message",
    formSending: "Envoi…",
    formCancel: "Annuler",
    formSuccess: "Message envoyé",
    formSuccessDesc: "Cesar vous répondra dans les 24 heures.",
    formError: "Une erreur s'est produite. Écrivez directement à :",
    rowLabels: {
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      location: "Localisation",
      responseTime: "Délai de réponse",
    },
  },
  statsLabels: ["Ans dans la Tech", "Projets Cloud", "Certifications", "Gaspillage Cloud Éliminé"],
  labels: {
    problem: "Le Défi",
    architecture: "L'Approche",
    businessResult: "Le Résultat",
    lessons: "Ce que j'ai appris",
    aiFaqNote: "// Le Smart AI FAQ de ce site est une intégration IA. Posez-lui toutes vos questions sur l'adéquation de Cesar à votre poste.",
    trustCompanies: "Entreprises",
    trustIndustries: "Secteurs",
    trustClouds: "Plateformes Cloud",
    challenge: "Défi",
    action: "Action",
    result: "Résultat",
    leadership: "Leadership",
    homeBase: "Base Principale",
    verified: "vérifiées",
    loadingGalaxy: "chargement de la galaxie…",
    operatingModel: "Modèle opérationnel",
    monthlyCostLabel: "Dépenses cloud mensuelles · optimisées",
    filterAll: "Tous",
    filterEurope: "Europe",
    filterAmericas: "Amériques",
    filterRemote: "À distance",
    filterOnsite: "Sur site",
    filterHybrid: "Hybride",
    region: "Région",
    deliveryType: "Type",
  },
  palette: {
    placeholder: "Chercher sections, compétences, contact…",
    noResults: "Aucun résultat.",
    ariaClose: "Fermer",
    groups: { navigate: "Navigation", actions: "Actions", contact: "Contact" },
    home: "Accueil",
    darkTheme: "Thème sombre",
    lightTheme: "Thème clair",
    openFaq: "Ouvrir le Smart AI FAQ",
    emailCesar: "Envoyer un email à Cesar",
    downloadCv: "Télécharger le CV",
    search: "Rechercher",
    navigate: "Navigation",
    commandPalette: "Palette de commandes",
  },
  recruiterPrompts: [
    "Pourquoi Cesar est-il un candidat solide pour des rôles cloud senior ?",
    "Quelles économies cloud mesurables Cesar a-t-il générées ?",
    "Voir l'expérience Kubernetes en production",
    "Comment Cesar aborde-t-il le FinOps à l'échelle entreprise ?",
    "Quelles certifications GCP et expérience pratique Cesar possède-t-il ?",
    "Cesar a-t-il dirigé des équipes ou de grandes initiatives cloud ?",
    "Dans quelles industries réglementées Cesar a-t-il livré des projets ?",
    "Voir l'architecture cloud pour la banque et l'aviation",
    "Comment Cesar aborde-t-il l'infrastructure IA et l'automatisation ?",
    "Cesar est-il disponible pour des projets internationaux ?",
  ],
  assistantFollowUps: {
    kubernetes: [
      "Voir l'expérience GKE en production",
      "Voir les projets d'ingénierie de plateformes",
      "Voir des exemples d'infrastructure Terraform",
      "Voir le travail Argo CD et GitOps",
    ],
    finops: [
      "Quelles économies cloud Cesar a-t-il générées ?",
      "Voir les outils d'automatisation FinOps utilisés",
      "Voir l'expérience en facturation multi-cloud",
      "Comment Cesar aborde-t-il la gouvernance cloud ?",
    ],
    leadership: [
      "Voir des exemples de leadership d'équipe",
      "Cesar a-t-il fondé ou dirigé une entreprise ?",
      "Voir l'expérience en avant-vente technique",
      "Voir des exemples de livraison transverse",
    ],
    architecture: [
      "Voir le travail d'architecture cloud bancaire",
      "Voir la conception d'ingénierie de plateformes",
      "Voir l'expérience en réseaux multi-cloud",
      "Dans quelles industries réglementées Cesar a-t-il travaillé ?",
    ],
    gcp: [
      "Voir les certifications GCP Professional Cloud Architect",
      "Voir le travail BigQuery et plateformes de données",
      "Voir les déploiements GKE en production",
      "Voir l'expérience FinOps sur Google Cloud",
    ],
    cloud: [
      "Voir l'expérience AWS",
      "Voir l'expérience Azure",
      "Voir la gouvernance multi-cloud",
      "Voir les projets de migration cloud",
    ],
    enterprise: [
      "Voir les clients bancaires et aviation",
      "Voir l'expérience dans les industries réglementées",
      "Voir la livraison à 99,9% de disponibilité",
      "Voir la livraison sur site vs à distance",
    ],
    ai: [
      "Voir le travail d'intégration LLM",
      "Voir les plateformes d'infrastructure IA",
      "Voir le travail d'automatisation et d'agents",
      "Comment Cesar aborde-t-il GenAI ?",
    ],
    fallback: [
      "Quelles économies cloud mesurables Cesar a-t-il générées ?",
      "Voir l'expérience Kubernetes en production",
      "Cesar a-t-il dirigé des équipes ou de grandes initiatives ?",
      "Cesar est-il disponible pour des projets internationaux ?",
    ],
  },
  story: {
    pullQuote: "J'ai grandi au Brésil 🇧🇷. Je suis parti en Europe. 10+ ans à construire des infrastructures qui ne tombent pas en panne, pour des banques, des compagnies aériennes et des entreprises qui ne peuvent pas se le permettre.",
    p1: "J'ai commencé à São Paulo, en construisant des plateformes de données et des systèmes pour de grandes entreprises. L'infrastructure cloud m'a vite séduit: le défi de rendre les systèmes distribués fiables, observables et rentables à grande échelle. C'est devenu ma carrière.",
    p2: "Partir en Europe dans la mi-vingtaine a changé ma façon de voir ce travail. Travailler dans différents fuseaux horaires, langues et cultures m'a appris ce que les certifications n'enseignent pas : les problèmes cloud sont avant tout des problèmes humains. Les systèmes tombent en panne parce que les équipes ne communiquent pas. Les coûts s'envolent parce que personne n'en est responsable. Les plateformes se brisent parce que les incitations sont mal alignées.",
    p3: "Depuis, j'ai construit des plateformes pour des banques à Londres et Madrid, des compagnies aériennes en Amérique latine, des entreprises de médias aux États-Unis et des entreprises partout dans le monde. J'ai fondé UP2CLOUD pour faire ce travail selon mes propres termes, axé sur les résultats, pas sur les effectifs.",
  },
  projects: {
    "finops-automation": {
      category: "FinOps & Optimisation des Coûts",
      title: "Plateforme d'Automatisation FinOps Entreprise",
      client: "Leader mondial du staffing",
      problem: "Les dépenses cloud sur GCP, AWS et Azure étaient fragmentées, non étiquetées et augmentaient plus vite que la visibilité ne le permettait.",
      architecture: "Automatisation Python contre les API de facturation multi-cloud, ingestion CloudHealth, CI/CD CloudBees et jobs planifiés de reporting des coûts avec auto-étiquetage alimentant des tableaux de bord exécutifs.",
      scale: "Estate multi-compte et multi-cloud",
      impact: ["~30% de réduction des gaspillages", "Étiquetage et refacturation automatisés", "Visibilité des coûts pour la direction"],
      outcome: "A éliminé ~30% de gaspillage cloud et donné aux finances une visibilité en temps réel par équipe.",
      lessons: "La gouvernance avant l'optimisation. On ne peut pas couper ce qu'on ne voit pas, et la partie la plus difficile était d'aligner 12 équipes plateformes sur une taxonomie d'étiquetage unifiée. Les solutions techniques sont faciles ; l'alignement organisationnel est le vrai travail.",
      metricLabel: "gaspillage cloud",
    },
    "bigdata-platform": {
      category: "Ingénierie de Plateformes de Données",
      title: "Plateforme d'Analytics Big Data",
      client: "Corporation de médias de masse (États-Unis)",
      problem: "Une entreprise médiatique avait besoin d'une plateforme d'analytics scalable pour traiter et interroger des flux d'événements massifs.",
      architecture: "Pipelines Apache Beam sur Google DataFlow, services App Engine et un entrepôt BigQuery, développé en Java/Node.js avec un frontend React.",
      scale: "Ingestion d'événements à grande échelle",
      impact: ["Pipelines de données en temps réel", "Analytics BigQuery en libre-service", "Livraison élastique avec App Engine"],
      outcome: "A débloqué des analytics en libre-service et en temps réel sur des flux d'événements massifs sur Google Cloud.",
      lessons: "Concevoir pour l'évolution des schémas, pas seulement pour le débit. Les schémas d'événements ont changé six fois pendant le projet. Intégrer l'évolution des schémas dans le pipeline dès le premier jour aurait économisé des semaines de retraitement.",
      metricLabel: "débit analytique",
    },
    "banking-cloud": {
      category: "Modernisation de Plateformes",
      title: "Multi-Cloud pour la Banque et l'Aviation",
      client: "AndBank · Santander · LATAM Airlines",
      problem: "Des entreprises réglementées exigeaient une infrastructure cloud résiliente, sécurisée et observable sur GCP, AWS, Azure et OCI.",
      architecture: "Conception de réseaux VPC, contrôles de sécurité pour les données PII et sensibles, et observabilité complète via New Relic, PagerDuty et StackStorm avec des tableaux de bord personnalisables.",
      scale: "Charges de travail d'entreprise réglementées",
      impact: ["Sécurité PII renforcée", "Observabilité 24/7 et on-call", "Réseaux multi-cloud résilients"],
      outcome: "A livré un cloud sécurisé, observable et prêt pour les régulateurs pour la banque et l'aviation à 99,9% de disponibilité.",
      lessons: "Dans les secteurs réglementés, l'observabilité est une preuve, pas seulement un outil. Les tableaux de bord prêts pour audit et les alertes automatisées dès le premier jour ont fait la différence entre réussir et échouer les examens de conformité.",
      metricLabel: "disponibilité",
    },
  },
  capabilities: [
    { area: "Architecture Cloud",         level: "Principal",        note: "Multi-cloud sur GCP, AWS, Azure et OCI pour les entreprises réglementées." },
    { area: "Ingénierie de Plateformes",  level: "Expert",           note: "Golden paths, plateformes self-service et Kubernetes à grande échelle." },
    { area: "DevOps & CI/CD",             level: "Expert",           note: "Conception de pipelines et automatisation de la livraison de bout en bout." },
    { area: "FinOps",                     level: "Spécialiste",      note: "Optimisation des coûts, étiquetage, refacturation et prévisions éliminant les vrais gaspillages." },
    { area: "Infrastructure as Code",     level: "Expert",           note: "Infrastructure reproductible et révisable sur tous les clouds." },
    { area: "Observabilité",              level: "Expert",           note: "Monitoring 24/7, on-call et outillage incidents pour les systèmes critiques." },
    { area: "Plateformes de Données",     level: "Avancé",           note: "Pipelines temps réel et entreposage sur Google Cloud." },
    { area: "Infrastructure IA",          level: "Focus croissant",  note: "Plateformes scalables, observables et économes pour les workloads GenAI." },
  ],
  scanner: {
    triggerLabel: "Évaluer César",
    triggerTitle: "Évaluer César pour un poste (⌘⇧E)",
    phaseScanning: "Initialisation de l'analyse du candidat…",
    phaseAnalyzing: "Analyse du profil du candidat…",
    phaseReport: "Forte adéquation — autorisé pour entretien · Disponible maintenant",
    statusScanning: "Vérification du dossier candidat…",
    statusAnalyzing: "Évaluation de {n} / {total} compétences",
    statusReport: "{total}/{total} compétences vérifiées · Signal de recrutement : fort",
    closeLabel: "Fermer",
    candidateEvalLabel: "Évaluation du Candidat",
    competencyScores: "Scores par Compétence",
    evidenceProjects: "Projets",
    evidenceTech: "Technologies",
    evidenceProduction: "Production",
    evidenceImpact: "Impact",
    evidenceCerts: "Certifications",
    assessmentComplete: "Évaluation Terminée",
    hireRecommendation: "Recommandation de Recrutement",
    verdict: "Procéder à l'Entretien",
    overallFit: "Adéquation Globale",
    fitValue: "Forte Adéquation",
    riskLevel: "Niveau de Risque",
    riskValue: "Faible",
    availability: "Disponibilité",
    availabilityValue: "Maintenant",
    bestFitRoles: "Rôles les Plus Adaptés",
    businessImpact: "Impact Business",
    scheduleInterview: "Planifier l'Entretien",
    emailCesar: "Écrire à César →",
    downloadCv: "Télécharger le CV",
    expandHint: "Développez n'importe quelle compétence pour voir projets, preuves et certifications",
    dialogDismissHint: "Fermer pour consulter l'évaluation détaillée des compétences",
    dialogSendMessage: "Envoyer un Message à César →",
    dialogFitLabel: "Fit",
    dialogRiskLabel: "Risque",
    dialogAvailLabel: "Disponible",
    dialogVerifiedLabel: "Vérifiées",
  },
  recruiterMode: {
    backToRoles: "← Tous les rôles",
    fitEvaluation: "Évaluation Fit",
    strengths: "Points Forts",
    evidence: "Preuves",
    considerations: "Considérations",
    interviewTopics: "Sujets d'Entretien",
    noConcerns: "Aucune préoccupation significative identifiée.",
    ctaText: "Vous souhaitez discuter de cette évaluation ou explorer un scénario spécifique ?",
    ctaButton: "Écrire à César →",
    roleGridIntro: "Sélectionnez un rôle pour générer une évaluation fit structurée — points forts, preuves, considérations et sujets d'entretien.",
    quickInsights: "Aperçus Rapides",
    scoreLabelExcellent: "Excellent fit",
    scoreLabelStrong: "Fort fit",
    scoreLabelGood: "Bon fit",
    scoreLabelPartial: "Fit partiel",
    quickExec: "Exécutif",
    quickImpact: "Impact",
    quickCredentials: "Références",
    quickCareer: "Carrière",
    hiringAssistant: "Assistant Recrutement",
    tabRoleFit: "Adéquation Poste",
    tabAIChat: "Chat IA",
    roleStrengths: {
      "cloud-architect": ["2× Google Cloud Professional Architect (recertifié)", "Multi-cloud à l'échelle entreprise : GCP, AWS, Azure, OCI", "10+ ans de conception de cloud réglementé pour la banque et l'aviation", "Fondateur d'UP2CLOUD — architecture en tant que service mondial"],
      "platform-engineer": ["Kubernetes (GKE) en production chez Accenture, ZeroLight, everis", "Terraform pour IaC multi-cloud reproductible", "Argo CD, GitHub Actions, GitLab CI — pipelines GitOps", "Autonomie des développeurs : golden paths, plateformes self-service"],
      "devops-lead": ["CI/CD à l'échelle : CloudBees, Jenkins, Spinnaker, GitHub Actions", "40 % de déploiements plus rapides via la refonte de pipeline chez Randstad Digital", "Observabilité : New Relic, PagerDuty, StackStorm — astreinte 24/7", "Étiquetage automatique, reporting de coûts et chargeback en Python"],
      "finops-engineer": ["Ingénieur FinOps Automation dédié chez Randstad Digital (3,5 ans)", "~30 % de réduction des gaspillages cloud sur GCP, AWS, Azure — documenté", "Automatisation Python sur les APIs de facturation multi-cloud", "CloudHealth, reporting de chargeback, étiquetage automatisé à l'échelle entreprise"],
      "staff-engineer": ["Responsable Architecture Technologique chez Accenture (leadership technique + humain)", "Fondateur d'UP2CLOUD — pilote les décisions d'architecture de bout en bout", "Polyvalent : avant-vente technique, livraison, architecture, mentorat", "A formé 120+ ingénieurs Accenture à la certification Google Cloud"],
      "ai-infrastructure": ["Base d'infrastructure pour l'IA : ordonnancement GPU, plateformes d'inférence optimisées en coûts", "Intégrations LLM et RAG sur des bases de connaissances privées (production)", "Ingénierie de plateforme directement applicable à l'infrastructure MLOps", "Automatisation IA : détection d'anomalies de coûts, agents d'automatisation des opérations"],
      "consultant": ["Fondateur et principal d'UP2CLOUD — conseil cloud B2B (2022–présent)", "Livraison internationale : Portugal, Espagne, Pays-Bas, Royaume-Uni, Brésil, clients US", "Références entreprise : banque, aviation, médias, staffing, automobile", "Modèle B2B : architecture fractionnée, construction de plateformes, missions FinOps"],
    },
  },
};

const zh: Dict = {
  nav: {
    summary: "摘要",
    experience: "成就",
    work: "案例",
    capabilities: "专长",
    trust: "信任",
    global: "全球",
    contact: "联系",
  },
  hero: {
    available: "可提供全球咨询服务",
    roleLine: "Cloud · DevOps · FinOps · AI基础设施",
    desc: "10年以上为银行、航空公司和企业构建云基础设施。我构建可靠、可观测、物有所值的平台。",
    chips: [
      "10年以上云经验",
      "GCP · AWS · Azure · OCI",
      "🇧🇷 巴西→🇵🇹 葡萄牙",
      "远程优先，服务全球",
      "现可接项目",
    ],
    ctaPrimary: "联系我",
    ctaSecondary: "查看项目",
  },
  sections: {
    summary: {
      label: "关于我",
      title: "架构师、工程师与战略家",
      intro:
        "十年云经验，三大洲，一个始终如一的目标：真正能在生产环境中运行的平台。",
    },
    experience: {
      label: "职业历程",
      title: "十年云领导力交付的成果",
      intro:
        "这些职位经历塑造了我对云、成本和工程领导力的思考方式。展开任意卡片查看完整故事。",
    },
    work: {
      label: "影响力案例",
      title: "三个项目。三个难题。三个成果。",
      intro:
        "每个案例遵循完整叙事弧：挑战、方法、成果，以及我从中学到的东西。",
    },
    capabilities: {
      label: "技术深度",
      title: "深度聚焦关键领域，拒绝虚荣指标",
      intro:
        "每项能力按级别和支撑工具展示。范围与证明，而非进度条。",
    },
    trust: {
      label: "企业信任",
      title: "受托于受监管的高风险系统",
      intro:
        "银行、航空公司和全球企业，跨越四大云服务商和六个行业。",
    },
    global: {
      label: "全球交付",
      title: "立足葡萄牙，交付全球。",
      intro:
        "从巴西到欧洲，遍及美洲：云计算、DevOps、平台工程和FinOps，交付于工作所在之处。",
    },
    certifications: {
      label: "认证",
      title: "已验证的多云认证",
      intro: "三大主流云及FinOps实践的验证专业知识。",
    },
    stack: {
      label: "技术全景",
      title: "工程星系，而非徽章列表",
      intro:
        "全栈实时力导向图：云、编排、CI/CD、数据和FinOps。拖拽、缩放，探索连接关系。",
    },
    finops: {
      label: "云成本工程",
      title: "将云成本作为工程学科",
      intro:
        "成本优化、合理配置、治理、预测、成本分摊和自动化，精准测量，而非猜测。",
    },
    ai: {
      label: "AI与自动化",
      title: "AI平台工程：可观测、可靠、成本可控",
      intro:
        "从LLM集成到GPU感知的平台工程：让AI可靠、可观测且成本可控的基础设施。",
    },
    testimonials: {
      label: "认可",
      title: "获工程师和领导者认可",
    },
    contact: {
      label: "开始对话",
      title: "告诉我您在构建什么",
      intro:
        "云架构、平台工程、FinOps、AI基础设施：如果工作是认真的，我想听您说。",
    },
  },
  exec: [
    {
      title: "成长历程",
      headline: "从葡萄牙出发，交付全球",
      body: "从巴西起步，辗转圣保罗、伦敦、马德里，跨越多个时区。为银行、航空公司和媒体企业构建平台。深刻理解生产环境在凌晨3点崩溃意味着什么，以及如何防止它再次发生。",
    },
    {
      title: "独特优势",
      headline: "技术深度延伸至成本管控",
      body: "我既是设计系统的架构师，也是盯着账单的FinOps负责人。这种组合，同时了解基础设施和其真实成本，实属罕见，它从根本上改变了你所构建的东西。",
    },
    {
      title: "专注领域",
      headline: "团队喜爱的平台。持续下降的成本。",
      body: "多云架构：GCP、AWS、Azure和OCI。Kubernetes、Terraform、CI/CD。成本治理。AI就绪基础设施。受监管的企业级环境，风险真实存在。",
    },
    {
      title: "合作方式",
      headline: "值得信赖的伙伴，而非任务执行者",
      body: "通过UP2CLOUD为国际客户提供独立咨询。分散式架构、平台构建或FinOps项目。我更倾向于能看到成果持续积累的长期合作。目前可接项目，通常24小时内回复。",
    },
  ],
  recruiter: {
    banner:
      "招聘模式：突出展示成就、领导力、认证和可用性",
    exit: "退出",
    on: "招聘模式：开启",
    off: "招聘模式",
  },
  assistant: {
    launch: "智能FAQ",
    close: "关闭",
    header: "AI职业助手",
    subtitle: "全面了解Cesar · 基于真实资料回答",
    greeting:
      "我是Cesar的AI职业助手。我了解他的全部背景。请提问招聘决策所需的任何内容：资历、规模、领导力、成本影响、认证或可用性。请在下方尝试提问。",
    suggested: "为招聘者推荐的问题",
    placeholder: "询问Cesar是否适合您的职位…",
    thinking: "思考中…",
    followUp: "继续提问",
    sourceLabel: "基于个人资料",
  },
  portraitCaption: "圣保罗 🇧🇷 → 维拉雷亚尔 🇵🇹",
  contact: {
    briefingTitle: "携手合作",
    briefingDesc: "云架构、平台工程、DevOps、FinOps或AI基础设施，告诉我您正在构建什么，让我们探索合作的可能。",
    emailCta: "给Cesar发消息",
    downloadCv: "下载简历",
    availability: "可承接国际项目",
    responseTime: "通常24小时内回复",
    contactQuote: "我参与的每个项目都是某人的关键基础设施：银行的支付平台、航空公司的运营系统、媒体公司的数据骨干。我认真对待这份责任。如果您正在构建重要的东西，我真诚地想听您讲述。",
    formTitle: "给Cesar发消息",
    formSubtitle: "24小时内回复",
    formName: "姓名",
    formEmail: "邮箱",
    formSubject: "主题",
    formMessage: "消息",
    formNamePlaceholder: "您的姓名",
    formEmailPlaceholder: "您@公司.com",
    formSubjectPlaceholder: "项目咨询、职位机会…",
    formMessagePlaceholder: "告诉Cesar您在构建什么以及他如何提供帮助…",
    formSend: "发送消息",
    formSending: "发送中…",
    formCancel: "取消",
    formSuccess: "消息已发送",
    formSuccessDesc: "Cesar将在24小时内与您联系。",
    formError: "出现错误。请直接发邮件至：",
    rowLabels: {
      email: "邮箱",
      linkedin: "LinkedIn",
      github: "GitHub",
      location: "地点",
      responseTime: "回复时间",
    },
  },
  statsLabels: ["技术年限", "云项目", "认证", "云浪费削减"],
  labels: {
    problem: "挑战",
    architecture: "方法",
    businessResult: "成果",
    lessons: "收获",
    aiFaqNote: "// 本网站的智能AI FAQ本身是一个AI集成，询问任何关于Cesar是否适合您职位的问题。",
    trustCompanies: "客户公司",
    trustIndustries: "行业领域",
    trustClouds: "云平台",
    challenge: "挑战",
    action: "行动",
    result: "结果",
    leadership: "领导力",
    homeBase: "基地",
    verified: "已验证",
    loadingGalaxy: "加载星系中…",
    operatingModel: "运营模型",
    monthlyCostLabel: "每月云支出 · 已优化",
    filterAll: "全部",
    filterEurope: "欧洲",
    filterAmericas: "美洲",
    filterRemote: "远程",
    filterOnsite: "现场",
    filterHybrid: "混合",
    region: "地区",
    deliveryType: "类型",
  },
  palette: {
    placeholder: "搜索章节、技能、联系方式…",
    noResults: "无结果。",
    ariaClose: "关闭",
    groups: { navigate: "导航", actions: "操作", contact: "联系" },
    home: "首页",
    darkTheme: "深色主题",
    lightTheme: "浅色主题",
    openFaq: "打开智能AI FAQ",
    emailCesar: "发送邮件给Cesar",
    downloadCv: "下载简历",
    search: "搜索",
    navigate: "导航",
    commandPalette: "命令面板",
  },
  recruiterPrompts: [
    "为何Cesar是高级云计算职位的有力候选人？",
    "Cesar交付了哪些可量化的云成本节省？",
    "展示Kubernetes生产环境经验",
    "Cesar如何在企业规模推行FinOps？",
    "Cesar拥有哪些GCP认证和实践经验？",
    "Cesar是否领导过团队或重大云计算项目？",
    "Cesar曾在哪些受监管行业交付项目？",
    "展示银行和航空业云架构设计",
    "Cesar如何构建AI和自动化基础设施？",
    "Cesar是否可接受国际项目？",
  ],
  assistantFollowUps: {
    kubernetes: [
      "展示GKE生产环境经验",
      "展示平台工程项目",
      "展示Terraform基础设施示例",
      "展示Argo CD和GitOps工作",
    ],
    finops: [
      "Cesar节省了哪些云成本？",
      "展示使用的FinOps自动化工具",
      "展示多云计费经验",
      "Cesar如何处理云治理？",
    ],
    leadership: [
      "展示团队领导力示例",
      "Cesar是否创办或领导过公司？",
      "展示技术售前经验",
      "展示跨职能交付示例",
    ],
    architecture: [
      "展示银行业云架构工作",
      "展示平台工程设计",
      "展示多云网络经验",
      "Cesar在哪些受监管行业工作过？",
    ],
    gcp: [
      "展示GCP专业云架构师认证",
      "展示BigQuery和数据平台工作",
      "展示GKE生产部署",
      "展示Google Cloud FinOps经验",
    ],
    cloud: [
      "展示AWS经验",
      "展示Azure经验",
      "展示多云治理",
      "展示云迁移项目",
    ],
    enterprise: [
      "展示银行和航空客户",
      "展示受监管行业经验",
      "展示99.9%可用性交付",
      "展示现场与远程交付",
    ],
    ai: [
      "展示LLM集成工作",
      "展示AI基础设施平台",
      "展示自动化和智能代理工作",
      "Cesar如何处理GenAI？",
    ],
    fallback: [
      "Cesar交付了哪些可量化的云成本节省？",
      "展示Kubernetes生产环境经验",
      "Cesar是否领导过团队或重大项目？",
      "Cesar是否可接受国际项目？",
    ],
  },
  story: {
    pullQuote: "我在巴西🇧🇷长大，后来移居欧洲。10年以上，我一直在构建不会故障的基础设施，为那些承受不起故障的银行、航空公司和企业。",
    p1: "我在圣保罗起步，为大型企业构建数据平台和软件系统。云基础设施很快吸引了我：如何让分布式系统在大规模下保持可靠、可观测且成本高效。这成为了我的事业。",
    p2: "二十多岁移居欧洲改变了我对这份工作的认知。跨越时区、语言和文化的工作经历教会了我认证所不能教的东西：云问题在很大程度上是人的问题。系统故障是因为团队之间沟通不畅。成本失控是因为没有人对其负责。平台崩溃是因为激励机制错位。",
    p3: "此后，我为伦敦和马德里的银行、拉丁美洲的航空公司、美国的媒体企业以及全球各地的公司构建了平台。我创立了UP2CLOUD，以自己的方式从事这份工作，专注于成果，而非人员规模。",
  },
  projects: {
    "finops-automation": {
      category: "FinOps与成本优化",
      title: "企业FinOps自动化平台",
      client: "全球人才服务领导者",
      problem: "GCP、AWS和Azure上的云支出分散、未打标签，增长速度超过了可见性所允许的范围。",
      architecture: "针对多云计费API的Python自动化、CloudHealth数据摄入、CloudBees CI/CD，以及向管理层仪表板提供数据的定时成本报告和自动打标签作业。",
      scale: "多账户、多云资产",
      impact: ["减少约30%浪费", "自动化标签与成本分摊", "管理层成本可见性"],
      outcome: "削减了约30%的云浪费，并为财务团队提供了按团队划分的实时成本可见性。",
      lessons: "治理先于优化。看不见的东西无法削减，最难的部分是让12个平台团队在统一的标签分类法上达成一致。技术解决方案是容易的，组织对齐才是真正的工作。",
      metricLabel: "云浪费",
    },
    "bigdata-platform": {
      category: "数据平台工程",
      title: "大数据分析平台",
      client: "大众媒体集团（美国）",
      problem: "一家媒体公司需要一个可扩展的分析平台来处理和查询海量事件流。",
      architecture: "Google DataFlow上的Apache Beam管道、App Engine服务和BigQuery数据仓库，使用Java/Node.js构建，配合React前端。",
      scale: "大规模事件摄入",
      impact: ["实时数据管道", "BigQuery自助分析", "App Engine弹性交付"],
      outcome: "在Google Cloud上解锁了对海量事件流的实时自助分析。",
      lessons: "为schema演进而设计，而不仅仅是吞吐量。事件schema在项目期间更改了六次。从第一天起就将schema演进内置到管道中，本可以节省数周的返工时间。",
      metricLabel: "分析吞吐量",
    },
    "banking-cloud": {
      category: "平台现代化",
      title: "银行业与航空业的多云方案",
      client: "AndBank · Santander · LATAM Airlines",
      problem: "受监管的企业需要在GCP、AWS、Azure和OCI上部署有弹性、安全且可观测的云基础设施。",
      architecture: "VPC网络设计、PII/敏感数据安全控制，以及通过New Relic、PagerDuty和StackStorm实现的完整可观测性，配备可定制仪表板。",
      scale: "受监管的企业级工作负载",
      impact: ["强化的PII安全", "24/7可观测性与值班", "弹性多云网络"],
      outcome: "以99.9%的可用性为银行业和航空业交付了安全、可观测、符合监管要求的云环境。",
      lessons: "在受监管行业，可观测性是证明，不仅仅是工具。从第一天起构建的审计就绪仪表板和自动告警，决定了能否通过合规性审查。",
      metricLabel: "可用性",
    },
  },
  capabilities: [
    { area: "云架构",         level: "首席级",    note: "在GCP、AWS、Azure和OCI上为受监管企业提供多云架构。" },
    { area: "平台工程",       level: "专家",      note: "黄金路径、自助服务平台与大规模Kubernetes。" },
    { area: "DevOps & CI/CD", level: "专家",      note: "端到端流水线设计与交付自动化。" },
    { area: "FinOps",         level: "专家级",    note: "成本优化、标签管理、成本分摊与预测，消除真实浪费。" },
    { area: "基础设施即代码", level: "专家",      note: "跨云平台可复现、可审查的基础设施。" },
    { area: "可观测性",       level: "专家",      note: "关键系统的24/7监控、值班与事件响应工具。" },
    { area: "数据平台",       level: "高级",      note: "Google Cloud上的实时管道与数据仓储。" },
    { area: "AI基础设施",     level: "重点发展",  note: "为GenAI工作负载构建可扩展、可观测、成本可控的平台。" },
  ],
  scanner: {
    triggerLabel: "评估 Cesar",
    triggerTitle: "为职位评估 Cesar (⌘⇧E)",
    phaseScanning: "正在初始化候选人扫描…",
    phaseAnalyzing: "正在分析候选人档案…",
    phaseReport: "高度匹配 — 已通过面试审核 · 现在可用",
    statusScanning: "正在验证候选人记录…",
    statusAnalyzing: "正在评估 {n} / {total} 项能力",
    statusReport: "{total}/{total} 项能力已验证 · 招聘信号：强",
    closeLabel: "关闭",
    candidateEvalLabel: "候选人评估",
    competencyScores: "能力评分",
    evidenceProjects: "项目",
    evidenceTech: "技术",
    evidenceProduction: "生产环境",
    evidenceImpact: "影响",
    evidenceCerts: "认证",
    assessmentComplete: "评估完成",
    hireRecommendation: "招聘建议",
    verdict: "进入面试环节",
    overallFit: "总体匹配度",
    fitValue: "高度匹配",
    riskLevel: "风险等级",
    riskValue: "低",
    availability: "可用性",
    availabilityValue: "立即可用",
    bestFitRoles: "最佳匹配职位",
    businessImpact: "业务影响",
    scheduleInterview: "安排面试",
    emailCesar: "发送消息给 César →",
    downloadCv: "下载简历",
    expandHint: "展开任意能力项以查看项目、证明和认证",
    dialogDismissHint: "关闭以查看完整能力评估详情",
    dialogSendMessage: "向 César 发送消息 →",
    dialogFitLabel: "匹配",
    dialogRiskLabel: "风险",
    dialogAvailLabel: "可用",
    dialogVerifiedLabel: "已验证",
  },
  recruiterMode: {
    backToRoles: "← 所有职位",
    fitEvaluation: "匹配度评估",
    strengths: "优势",
    evidence: "证明",
    considerations: "注意事项",
    interviewTopics: "面试话题",
    noConcerns: "未发现重大顾虑。",
    ctaText: "想讨论此评估或探讨特定场景？",
    ctaButton: "发送消息给 César →",
    roleGridIntro: "选择职位以生成结构化匹配度评估：优势、证明、注意事项及面试话题。",
    quickInsights: "快速洞察",
    scoreLabelExcellent: "优秀匹配",
    scoreLabelStrong: "强力匹配",
    scoreLabelGood: "良好匹配",
    scoreLabelPartial: "部分匹配",
    quickExec: "执行摘要",
    quickImpact: "业务影响",
    quickCredentials: "资质证书",
    quickCareer: "职业历程",
    hiringAssistant: "招聘助手",
    tabRoleFit: "岗位匹配",
    tabAIChat: "AI 对话",
    roleStrengths: {
      "cloud-architect": ["双重 Google Cloud 专业架构师（已再认证）", "企业级多云：GCP、AWS、Azure、OCI", "10+ 年为银行和航空设计合规云", "UP2CLOUD 创始人——全球架构即服务"],
      "platform-engineer": ["Accenture、ZeroLight、everis 生产 Kubernetes (GKE)", "Terraform 可重现多云 IaC", "Argo CD、GitHub Actions、GitLab CI — GitOps 交付管道", "开发者赋能：黄金路径、自助平台"],
      "devops-lead": ["规模化 CI/CD：CloudBees、Jenkins、Spinnaker、GitHub Actions", "Randstad Digital 流水线重设计加速部署 40%", "可观测性：New Relic、PagerDuty、StackStorm — 24/7 值班", "Python 自动资源标记、成本报告与分摊"],
      "finops-engineer": ["Randstad Digital 专职 FinOps 自动化工程师（3.5 年）", "~30% 云浪费减少（GCP、AWS、Azure——有记录）", "Python 自动化多云计费 API", "CloudHealth、分摊报告、企业级自动标记"],
      "staff-engineer": ["Accenture 技术架构经理（技术与团队双重领导力）", "UP2CLOUD 创始人——端到端架构决策", "跨职能：技术售前、交付、架构、导师", "培训 120+ Accenture 工程师通过 Google Cloud 认证"],
      "ai-infrastructure": ["AI 基础设施：GPU 调度、成本感知推理平台", "生产环境 LLM 集成与私有知识库 RAG", "平台工程直接适用于 MLOps 基础设施", "AI 自动化：成本异常检测、运维自动化代理"],
      "consultant": ["UP2CLOUD 创始人兼主理人——B2B 云咨询（2022–至今）", "国际交付：葡萄牙、西班牙、荷兰、英国、巴西、美国客户", "企业履历：银行、航空、媒体、人力资源、汽车", "B2B 模式：部分架构服务、平台构建、FinOps 项目"],
    },
  },
};

const DICT: Record<Lang, Dict> = { en, pt, es, fr, zh };

type I18nValue = { lang: Lang; setLang: (l: Lang) => void; t: Dict };
const I18nContext = createContext<I18nValue | null>(null);
const KEY = "site-lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem(KEY) as Lang | null;
    if (stored && stored in DICT) setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(KEY, l);
    document.documentElement.lang = l === "pt" ? "pt-BR" : l;
  }, []);

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t: DICT[lang] }), [lang, setLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) return { lang: "en", setLang: () => {}, t: DICT.en };
  return ctx;
}
