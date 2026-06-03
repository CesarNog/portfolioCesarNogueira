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
export const LANGS: { code: Lang; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "pt", label: "PT", name: "Português" },
  { code: "es", label: "ES", name: "Español" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "zh", label: "中文", name: "中文" },
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
    desc: "11 years building cloud infrastructure for banks, airlines, and enterprises. I make platforms reliable, observable, and worth every dollar spent on them.",
    chips: [
      "11+ years in cloud",
      "GCP · AWS · Azure · OCI",
      "Based in Madrid",
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
        "Ten years of cloud, three continents, one consistent goal: platforms that actually work in production.",
    },
    experience: {
      label: "Career",
      title: "Outcomes delivered across a decade of cloud leadership",
      intro:
        "The roles that shaped how I think about cloud, cost, and engineering leadership. Expand any card for the full story.",
    },
    work: {
      label: "Impact Stories",
      title: "Three engagements. Three hard problems. Three outcomes.",
      intro:
        "Each case study follows the full arc: the challenge, the approach, the outcome, and what I learned from it.",
    },
    capabilities: {
      label: "Technical Depth",
      title: "Depth where it counts — no vanity metrics",
      intro:
        "Each capability shown by level and the tools behind it. Scope and proof, not progress bars.",
    },
    trust: {
      label: "Enterprise Trust",
      title: "Trusted with regulated, mission-critical systems",
      intro:
        "Banks, airlines and global enterprises — across four cloud providers and six industries.",
    },
    global: {
      label: "Global Delivery",
      title: "Based in Portugal. Delivering globally.",
      intro:
        "From Brazil to Europe and across the Americas — cloud, DevOps, platform engineering and FinOps delivered wherever the work is.",
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
        "A live force-directed graph of the full stack — clouds, orchestration, CI/CD, data and FinOps. Drag, zoom and explore the connections.",
    },
    finops: {
      label: "Cloud Cost Engineering",
      title: "Turning cloud spend into a strategic asset",
      intro:
        "Cost optimization, rightsizing, governance, forecasting, chargeback and automation — measured, not guessed.",
    },
    ai: {
      label: "AI & Automation",
      title: "Future-ready: platforms built for GenAI",
      intro:
        "From LLM integrations to GPU-aware platform engineering — infrastructure that makes AI reliable, observable and cost-aware.",
    },
    testimonials: {
      label: "Signal",
      title: "Trusted by engineers and leaders",
    },
    contact: {
      label: "Start a Conversation",
      title: "Let's build something meaningful",
      intro:
        "Whether you're tackling a cloud challenge, building a new platform, or exploring a long-term partnership — I'd love to hear what you're working on.",
    },
  },
  exec: [
    {
      title: "The journey",
      headline: "Built from Portugal, delivered worldwide",
      body: "Started engineering in Lisbon. Moved through London, Madrid, and across time zones. Built platforms for banks, airlines, and media companies. Learned what it means when production fails at 3am — and how to stop it happening again.",
    },
    {
      title: "The edge",
      headline: "Engineering depth that reaches the spreadsheet",
      body: "I've been both the architect designing the system and the FinOps lead watching the bill. That combination — knowing both the infrastructure and its real cost — is rare, and it changes what you build.",
    },
    {
      title: "The focus",
      headline: "Platforms teams love. Costs that go down.",
      body: "Multi-cloud on GCP, AWS, Azure and OCI. Kubernetes, Terraform, CI/CD. Cost governance. AI-ready infrastructure. Regulated, enterprise-grade environments where the stakes are real.",
    },
    {
      title: "The partnership",
      headline: "A trusted partner, not a ticket-taker",
      body: "Independent consulting via UP2CLOUD for international clients. Fractional architecture, platform builds or FinOps engagements. I prefer work where I can stay long enough to see it compound. Currently available — replies within 24h.",
    },
  ],
  recruiter: {
    banner:
      "Recruiter Mode — impact, leadership, certifications & availability emphasized",
    exit: "exit",
    on: "Recruiter Mode: On",
    off: "Recruiter Mode",
  },
  assistant: {
    launch: "Smart AI FAQ",
    close: "Close",
    header: "AI Career Assistant",
    subtitle: "Knows everything about Cesar · answers from his real profile",
    greeting:
      "I'm Cesar's AI Career Assistant — I know his entire background. Ask anything a hiring decision needs: seniority, scale, leadership, cost impact, certifications or availability. Try a question below.",
    suggested: "Suggested for recruiters",
    placeholder: "Ask about Cesar's fit for your role…",
    thinking: "Thinking…",
    followUp: "Follow up",
    sourceLabel: "Based on portfolio evidence",
  },
  portraitCaption: "Madrid · Gran Vía",
  contact: {
    briefingTitle: "Let's work together",
    briefingDesc: "Cloud architecture, platform engineering, DevOps, FinOps or AI infrastructure — tell me what you're building and let's explore how we can work together.",
    emailCta: "Reach out to Cesar",
    downloadCv: "Download CV",
    availability: "Available for international projects",
    responseTime: "Usually replies within 24h",
    contactQuote: "Every project I've worked on has been someone's critical infrastructure — a bank's payment platform, an airline's operations system, a media company's data backbone. I take that responsibility seriously. If you're building something that matters, I'd genuinely like to hear about it.",
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
  statsLabels: ["Years in Tech", "Cloud Projects", "Certifications", "Cost Savings Generated"],
  labels: {
    problem: "The Challenge",
    architecture: "The Approach",
    businessResult: "The Outcome",
    lessons: "What I learned",
    aiFaqNote: "// The Smart AI FAQ on this site is an AI integration — ask it anything about Cesar's fit for your role.",
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
    openFaq: "Open Smart AI FAQ",
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
  story: {
    pullQuote: "I grew up in Brazil. Moved to Europe. Spent 11 years building infrastructure that doesn't fail — for banks, airlines, and enterprises that can't afford for it to.",
    p1: "I started in São Paulo, building data platforms and software systems for large enterprises. Cloud infrastructure caught me early — the challenge of making distributed systems reliable, observable, and cost-efficient at scale. That became my career.",
    p2: "Moving to Europe in my mid-twenties changed how I think about this work. Working across time zones, languages, and cultures taught me what certifications don't: cloud problems are mostly people problems. Systems fail because teams don't talk. Costs spiral because nobody owns them. Platforms break because the incentives are misaligned.",
    p3: "Since then I've built platforms for banks in London and Madrid, airlines across Latin America, media companies in the US, and enterprises everywhere in between. I founded UP2CLOUD to do this work on my own terms — focused on outcomes, not headcount.",
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
    contact: "Contacto",
  },
  hero: {
    available: "Disponível para consultoria global",
    roleLine: "Cloud · DevOps · FinOps · Infraestrutura de IA",
    desc: "11 anos a construir infraestrutura cloud para bancos, companhias aéreas e empresas. Faço plataformas fiáveis, observáveis e que valem cada euro investido.",
    chips: [
      "11+ anos em cloud",
      "GCP · AWS · Azure · OCI",
      "Baseado em Madrid",
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
      title: "Profundidade onde importa — sem métricas de vaidade",
      intro:
        "Cada competência apresentada por nível e pelas ferramentas que a sustentam. Âmbito e prova, não barras de progresso.",
    },
    trust: {
      label: "Confiança Empresarial",
      title: "Confiado com sistemas regulados e críticos",
      intro:
        "Bancos, companhias aéreas e grandes empresas — em quatro fornecedores de cloud e seis indústrias.",
    },
    global: {
      label: "Entrega Global",
      title: "Baseado em Portugal. Entrega global.",
      intro:
        "Do Brasil à Europa e por toda a América — cloud, DevOps, engenharia de plataformas e FinOps entregues onde o trabalho existe.",
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
        "Um grafo dinâmico de toda a stack — clouds, orquestração, CI/CD, dados e FinOps. Arraste, faça zoom e explore as ligações.",
    },
    finops: {
      label: "Engenharia de Custos Cloud",
      title: "Transformar o custo da cloud num ativo estratégico",
      intro:
        "Otimização de custos, dimensionamento, governança, previsão, imputação e automação — medido, não adivinhado.",
    },
    ai: {
      label: "IA & Automação",
      title: "Preparado para o futuro: plataformas para GenAI",
      intro:
        "De integrações com LLMs à engenharia de plataformas com GPUs — infraestrutura que torna a IA fiável, observável e consciente dos custos.",
    },
    testimonials: {
      label: "Reconhecimento",
      title: "Reconhecido por engenheiros e líderes",
    },
    contact: {
      label: "Iniciar Conversa",
      title: "Vamos construir algo com significado",
      intro:
        "Seja um desafio cloud, uma nova plataforma ou uma parceria a longo prazo — adorava saber o que está a construir.",
    },
  },
  exec: [
    {
      title: "O percurso",
      headline: "Nascido em Portugal, entregue ao mundo",
      body: "Comecei em Lisboa. Passei por Londres, Madrid e vários fusos horários. Construí plataformas para bancos, companhias aéreas e empresas de media. Aprendi o que significa quando a produção falha às 3 da manhã — e como evitar que aconteça de novo.",
    },
    {
      title: "O diferencial",
      headline: "Profundidade técnica que chega à folha de custos",
      body: "Já fui o arquiteto que desenha o sistema e o responsável FinOps que observa a fatura. Essa combinação — conhecer tanto a infraestrutura como o seu custo real — é rara, e muda o que se constrói.",
    },
    {
      title: "O foco",
      headline: "Plataformas que as equipas adoram. Custos que baixam.",
      body: "Multi-cloud em GCP, AWS, Azure e OCI. Kubernetes, Terraform, CI/CD. Governação de custos. Infraestrutura preparada para IA. Ambientes regulados e à escala empresarial onde os riscos são reais.",
    },
    {
      title: "A parceria",
      headline: "Um parceiro de confiança, não um executor de tickets",
      body: "Consultoria independente via UP2CLOUD para clientes internacionais. Arquitetura fracionada, construção de plataformas ou projetos FinOps. Prefiro trabalhos onde possa ficar tempo suficiente para ver o impacto crescer. Disponível agora — responde em 24h.",
    },
  ],
  recruiter: {
    banner:
      "Modo Recrutador — impacto, liderança, certificações e disponibilidade em destaque",
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
      "Sou o Assistente de Carreira IA do Cesar — conheço todo o seu percurso. Pergunte o que uma decisão de contratação precisa: senioridade, escala, liderança, impacto em custos, certificações ou disponibilidade. Experimente uma pergunta abaixo.",
    suggested: "Sugestões para recrutadores",
    placeholder: "Pergunte sobre a adequação do Cesar ao seu cargo…",
    thinking: "A pensar…",
    followUp: "Continuar",
    sourceLabel: "Com base no perfil",
  },
  portraitCaption: "Madrid · Gran Vía",
  contact: {
    briefingTitle: "Vamos trabalhar juntos",
    briefingDesc: "Arquitetura cloud, engenharia de plataformas, DevOps, FinOps ou infraestrutura de IA — diga-me o que está a construir e exploremos como trabalhar juntos.",
    emailCta: "Contactar o Cesar",
    downloadCv: "Descarregar CV",
    availability: "Disponível para projetos internacionais",
    responseTime: "Responde normalmente em 24h",
    contactQuote: "Cada projeto em que trabalhei foi a infraestrutura crítica de alguém — a plataforma de pagamentos de um banco, o sistema de operações de uma companhia aérea, a espinha dorsal de dados de uma empresa de media. Tomo essa responsabilidade a sério. Se está a construir algo que importa, adorava ouvir falar sobre isso.",
    formTitle: "Enviar mensagem ao Cesar",
    formSubtitle: "Responde em 24h",
    formName: "Nome",
    formEmail: "Email",
    formSubject: "Assunto",
    formMessage: "Mensagem",
    formNamePlaceholder: "O seu nome",
    formEmailPlaceholder: "voce@empresa.com",
    formSubjectPlaceholder: "Proposta de projeto, oportunidade…",
    formMessagePlaceholder: "Diga ao Cesar o que está a construir e como ele pode ajudar…",
    formSend: "Enviar mensagem",
    formSending: "A enviar…",
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
  statsLabels: ["Anos em Tecnologia", "Projetos Cloud", "Certificações", "Poupança em Custos"],
  labels: {
    problem: "O Desafio",
    architecture: "A Abordagem",
    businessResult: "O Resultado",
    lessons: "O que aprendi",
    aiFaqNote: "// O Smart AI FAQ neste site é uma integração de IA — pergunte-lhe tudo sobre a adequação do Cesar ao seu cargo.",
    trustCompanies: "Empresas",
    trustIndustries: "Sectores",
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
    placeholder: "Pesquisar secções, competências, contacto…",
    noResults: "Sem resultados.",
    ariaClose: "Fechar",
    groups: { navigate: "Navegar", actions: "Ações", contact: "Contacto" },
    home: "Início",
    darkTheme: "Tema escuro",
    lightTheme: "Tema claro",
    openFaq: "Abrir Smart AI FAQ",
    emailCesar: "Enviar email ao Cesar",
    downloadCv: "Descarregar CV",
    search: "Pesquisar",
    navigate: "Navegar",
    commandPalette: "Paleta de comandos",
  },
  recruiterPrompts: [
    "Por que o Cesar é forte candidato para funções sénior em cloud?",
    "Que poupanças mensuráveis em cloud o Cesar já gerou?",
    "Mostrar experiência em produção com Kubernetes",
    "Como o Cesar aborda FinOps à escala empresarial?",
    "Que certificações GCP e experiência prática tem o Cesar?",
    "O Cesar liderou equipas ou iniciativas cloud de grande escala?",
    "Em que indústrias reguladas o Cesar já entregou projetos?",
    "Mostrar arquitetura cloud para banca e aviação",
    "Como o Cesar aborda infraestrutura de IA e automação?",
    "O Cesar está disponível para projetos internacionais?",
  ],
  story: {
    pullQuote: "Cresci no Brasil. Vim para a Europa. Passei 11 anos a construir infraestrutura que não falha — para bancos, companhias aéreas e empresas que não se podem dar ao luxo de falhar.",
    p1: "Comecei em São Paulo, a construir plataformas de dados e sistemas de software para grandes empresas. O cloud apanhou-me cedo — o desafio de tornar sistemas distribuídos fiáveis, observáveis e eficientes em custos a grande escala. Isso tornou-se a minha carreira.",
    p2: "Vim para a Europa com vinte e poucos anos, e isso mudou a forma como penso neste trabalho. Trabalhar em fusos horários, línguas e culturas diferentes ensinou-me o que as certificações não ensinam: os problemas de cloud são sobretudo problemas de pessoas. Os sistemas falham porque as equipas não comunicam. Os custos disparam porque ninguém é responsável. As plataformas avariam porque os incentivos estão errados.",
    p3: "Desde então construí plataformas para bancos em Londres e Madrid, companhias aéreas na América Latina, empresas de media nos EUA e empresas em todo o mundo. Fundei a UP2CLOUD para fazer este trabalho nos meus próprios termos — focado em resultados, não em recursos.",
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
    contact: "Contacto",
  },
  hero: {
    available: "Disponible para consultoría global",
    roleLine: "Cloud · DevOps · FinOps · Infraestructura de IA",
    desc: "11 años construyendo infraestructura cloud para bancos, aerolíneas y empresas. Hago plataformas fiables, observables y que valen cada euro invertido.",
    chips: [
      "11+ años en cloud",
      "GCP · AWS · Azure · OCI",
      "Basado en Madrid",
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
      title: "Profundidad donde importa — sin métricas de vanidad",
      intro:
        "Cada competencia mostrada por nivel y por las herramientas que la respaldan. Alcance y prueba, no barras de progreso.",
    },
    trust: {
      label: "Confianza Empresarial",
      title: "De confianza para sistemas regulados y críticos",
      intro:
        "Bancos, aerolíneas y grandes empresas — en cuatro proveedores de cloud y seis industrias.",
    },
    global: {
      label: "Entrega Global",
      title: "Basado en Portugal. Entrega global.",
      intro:
        "De Brasil a Europa y por toda América — cloud, DevOps, ingeniería de plataformas y FinOps entregados donde está el trabajo.",
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
        "Un grafo dinámico de todo el stack — clouds, orquestación, CI/CD, datos y FinOps. Arrastra, haz zoom y explora las conexiones.",
    },
    finops: {
      label: "Ingeniería de Costes Cloud",
      title: "Convertir el gasto cloud en un activo estratégico",
      intro:
        "Optimización de costes, dimensionamiento, gobierno, previsión, imputación y automatización — medido, no adivinado.",
    },
    ai: {
      label: "IA & Automatización",
      title: "Preparado para el futuro: plataformas para GenAI",
      intro:
        "De integraciones con LLMs a la ingeniería de plataformas con GPUs — infraestructura que hace la IA fiable, observable y consciente del coste.",
    },
    testimonials: {
      label: "Reconocimiento",
      title: "Avalado por ingenieros y líderes",
    },
    contact: {
      label: "Iniciar Conversación",
      title: "Construyamos algo significativo",
      intro:
        "Ya sea un reto cloud, una nueva plataforma o una colaboración a largo plazo — me encantaría saber en qué estás trabajando.",
    },
  },
  exec: [
    {
      title: "El camino",
      headline: "Construido desde Portugal, entregado al mundo",
      body: "Empecé en Lisboa. Pasé por Londres, Madrid y varios husos horarios. Construí plataformas para bancos, aerolíneas y empresas de medios. Aprendí lo que significa cuando la producción falla a las 3am — y cómo evitar que vuelva a ocurrir.",
    },
    {
      title: "La ventaja",
      headline: "Profundidad técnica que llega a la hoja de costes",
      body: "He sido el arquitecto que diseña el sistema y el responsable FinOps que vigila la factura. Esa combinación — conocer tanto la infraestructura como su coste real — es poco común, y cambia lo que construyes.",
    },
    {
      title: "El enfoque",
      headline: "Plataformas que los equipos aman. Costes que bajan.",
      body: "Multi-cloud en GCP, AWS, Azure y OCI. Kubernetes, Terraform, CI/CD. Gobernanza de costes. Infraestructura preparada para IA. Entornos regulados y a escala empresarial donde los riesgos son reales.",
    },
    {
      title: "La colaboración",
      headline: "Un socio de confianza, no un ejecutor de tickets",
      body: "Consultoría independiente vía UP2CLOUD para clientes internacionales. Arquitectura fraccionada, construcción de plataformas o proyectos FinOps. Prefiero trabajos donde pueda quedarme el tiempo suficiente para ver el impacto crecer. Disponible ahora — suele responder en 24h.",
    },
  ],
  recruiter: {
    banner:
      "Modo Reclutador — impacto, liderazgo, certificaciones y disponibilidad destacados",
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
      "Soy el Asistente de Carrera IA de Cesar — conozco todo su recorrido. Pregunta lo que necesita una decisión de contratación: seniority, escala, liderazgo, impacto en costes, certificaciones o disponibilidad. Prueba una pregunta abajo.",
    suggested: "Sugerencias para reclutadores",
    placeholder: "Pregunta por el encaje de Cesar en tu puesto…",
    thinking: "Pensando…",
    followUp: "Seguir",
    sourceLabel: "Basado en el perfil",
  },
  portraitCaption: "Madrid · Gran Vía",
  contact: {
    briefingTitle: "Trabajemos juntos",
    briefingDesc: "Arquitectura cloud, ingeniería de plataformas, DevOps, FinOps o infraestructura de IA — cuéntame qué estás construyendo y exploremos cómo trabajar juntos.",
    emailCta: "Contactar a Cesar",
    downloadCv: "Descargar CV",
    availability: "Disponible para proyectos internacionales",
    responseTime: "Suele responder en 24h",
    contactQuote: "Cada proyecto en el que he trabajado ha sido la infraestructura crítica de alguien — la plataforma de pagos de un banco, el sistema de operaciones de una aerolínea, la columna vertebral de datos de una empresa de medios. Me tomo esa responsabilidad en serio. Si estás construyendo algo que importa, me encantaría escuchar al respecto.",
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
  statsLabels: ["Años en Tecnología", "Proyectos Cloud", "Certificaciones", "Ahorro en Costes"],
  labels: {
    problem: "El Desafío",
    architecture: "El Enfoque",
    businessResult: "El Resultado",
    lessons: "Lo que aprendí",
    aiFaqNote: "// El Smart AI FAQ de este sitio es una integración de IA — pregúntale lo que necesites sobre la idoneidad de Cesar para tu puesto.",
    trustCompanies: "Empresas",
    trustIndustries: "Sectores",
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
    groups: { navigate: "Navegar", actions: "Acciones", contact: "Contacto" },
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
  story: {
    pullQuote: "Crecí en Brasil. Me mudé a Europa. Llevo 11 años construyendo infraestructura que no falla — para bancos, aerolíneas y empresas que no pueden permitirse que falle.",
    p1: "Empecé en São Paulo, construyendo plataformas de datos y sistemas para grandes empresas. La infraestructura cloud me enganchó pronto — el reto de hacer sistemas distribuidos fiables, observables y eficientes en coste a escala. Eso se convirtió en mi carrera.",
    p2: "Mudarme a Europa a mediados de los veinte cambió cómo pienso sobre este trabajo. Trabajar en distintas zonas horarias, idiomas y culturas me enseñó lo que las certificaciones no enseñan: los problemas de cloud son sobre todo problemas de personas. Los sistemas fallan porque los equipos no se comunican. Los costes se disparan porque nadie los gestiona. Las plataformas fallan porque los incentivos están mal alineados.",
    p3: "Desde entonces he construido plataformas para bancos en Londres y Madrid, aerolíneas en América Latina, empresas de medios en EE.UU. y empresas de todo el mundo. Fundé UP2CLOUD para hacer este trabajo en mis propios términos — centrado en resultados, no en plantilla.",
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
    desc: "11 ans à construire l'infrastructure cloud pour des banques, des compagnies aériennes et des entreprises. Je construis des plateformes fiables, observables et qui valent chaque euro investi.",
    chips: [
      "11+ ans en cloud",
      "GCP · AWS · Azure · OCI",
      "Basé à Madrid",
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
      title: "Profondeur là où ça compte — sans métriques de vanité",
      intro:
        "Chaque compétence présentée par niveau et par les outils qui la soutiennent. Périmètre et preuves, pas des barres de progression.",
    },
    trust: {
      label: "Confiance Entreprise",
      title: "Approuvé pour des systèmes réglementés et critiques",
      intro:
        "Banques, compagnies aériennes et multinationales — sur quatre fournisseurs cloud et six secteurs.",
    },
    global: {
      label: "Livraison Mondiale",
      title: "Basé au Portugal. Livraison mondiale.",
      intro:
        "Du Brésil à l'Europe et à travers les Amériques — cloud, DevOps, ingénierie de plateformes et FinOps, livrés où le travail se trouve.",
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
        "Un graphe dynamique de la stack complète — clouds, orchestration, CI/CD, données et FinOps. Faites glisser, zoomez et explorez les connexions.",
    },
    finops: {
      label: "Ingénierie des Coûts Cloud",
      title: "Transformer les dépenses cloud en actif stratégique",
      intro:
        "Optimisation des coûts, redimensionnement, gouvernance, prévision, refacturation et automatisation — mesuré, pas deviné.",
    },
    ai: {
      label: "IA & Automatisation",
      title: "Préparé pour l'avenir : plateformes conçues pour GenAI",
      intro:
        "Des intégrations LLM à l'ingénierie de plateformes GPU — infrastructure qui rend l'IA fiable, observable et économe.",
    },
    testimonials: {
      label: "Références",
      title: "Reconnu par les ingénieurs et les dirigeants",
    },
    contact: {
      label: "Prenons Contact",
      title: "Construisons quelque chose de grand ensemble",
      intro:
        "Que ce soit un défi cloud, une nouvelle plateforme ou un partenariat à long terme — j'adorerais entendre ce sur quoi vous travaillez.",
    },
  },
  exec: [
    {
      title: "Le parcours",
      headline: "Construit depuis le Portugal, livré au monde entier",
      body: "J'ai commencé à Lisbonne. Travaillé à Londres, Madrid et dans plusieurs fuseaux horaires. Construit des plateformes pour des banques, des compagnies aériennes et des médias. Appris ce que signifie une panne en production à 3h du matin — et comment l'éviter.",
    },
    {
      title: "L'avantage",
      headline: "Une profondeur technique qui rejoint la feuille de coûts",
      body: "J'ai été à la fois l'architecte qui conçoit le système et le responsable FinOps qui surveille la facture. Cette combinaison — connaître à la fois l'infrastructure et son coût réel — est rare, et elle change ce qu'on construit.",
    },
    {
      title: "Le focus",
      headline: "Des plateformes que les équipes adorent. Des coûts qui baissent.",
      body: "Multi-cloud sur GCP, AWS, Azure et OCI. Kubernetes, Terraform, CI/CD. Gouvernance des coûts. Infrastructure IA-ready. Environnements réglementés à l'échelle entreprise où les enjeux sont réels.",
    },
    {
      title: "Le partenariat",
      headline: "Un partenaire de confiance, pas un exécutant de tickets",
      body: "Conseil indépendant via UP2CLOUD pour des clients internationaux. Architecture fractionnée, construction de plateformes ou missions FinOps. Je préfère les missions longues où je peux voir l'impact se construire. Disponible maintenant — répond sous 24h.",
    },
  ],
  recruiter: {
    banner:
      "Mode Recruteur — impact, leadership, certifications & disponibilité mis en avant",
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
      "Je suis l'Assistant Carrière IA de Cesar — je connais tout son parcours. Posez tout ce qu'une décision de recrutement nécessite : séniorité, échelle, leadership, impact financier, certifications ou disponibilité. Essayez une question ci-dessous.",
    suggested: "Questions suggérées pour les recruteurs",
    placeholder: "Posez une question sur l'adéquation de Cesar à votre poste…",
    thinking: "Réflexion…",
    followUp: "Continuer",
    sourceLabel: "Basé sur le profil",
  },
  portraitCaption: "Madrid · Gran Vía",
  contact: {
    briefingTitle: "Travaillons ensemble",
    briefingDesc: "Architecture cloud, ingénierie de plateformes, DevOps, FinOps ou infrastructure IA — dites-moi ce que vous construisez et explorons comment collaborer.",
    emailCta: "Contacter Cesar",
    downloadCv: "Télécharger le CV",
    availability: "Disponible pour des projets internationaux",
    responseTime: "Répond généralement sous 24h",
    contactQuote: "Chaque projet sur lequel j'ai travaillé a été l'infrastructure critique de quelqu'un — la plateforme de paiement d'une banque, le système d'opérations d'une compagnie aérienne, la colonne vertébrale des données d'une entreprise de médias. Je prends cette responsabilité au sérieux. Si vous construisez quelque chose qui compte, j'aimerais vraiment en entendre parler.",
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
  statsLabels: ["Ans dans la Tech", "Projets Cloud", "Certifications", "Économies Générées"],
  labels: {
    problem: "Le Défi",
    architecture: "L'Approche",
    businessResult: "Le Résultat",
    lessons: "Ce que j'ai appris",
    aiFaqNote: "// Le Smart AI FAQ de ce site est une intégration IA — posez-lui toutes vos questions sur l'adéquation de Cesar à votre poste.",
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
  story: {
    pullQuote: "J'ai grandi au Brésil. Je suis parti en Europe. 11 ans à construire des infrastructures qui ne tombent pas en panne — pour des banques, des compagnies aériennes et des entreprises qui ne peuvent pas se le permettre.",
    p1: "J'ai commencé à São Paulo, en construisant des plateformes de données et des systèmes pour de grandes entreprises. L'infrastructure cloud m'a vite séduit — le défi de rendre les systèmes distribués fiables, observables et rentables à grande échelle. C'est devenu ma carrière.",
    p2: "Partir en Europe dans la mi-vingtaine a changé ma façon de voir ce travail. Travailler dans différents fuseaux horaires, langues et cultures m'a appris ce que les certifications n'enseignent pas : les problèmes cloud sont avant tout des problèmes humains. Les systèmes tombent en panne parce que les équipes ne communiquent pas. Les coûts s'envolent parce que personne n'en est responsable. Les plateformes se brisent parce que les incitations sont mal alignées.",
    p3: "Depuis, j'ai construit des plateformes pour des banques à Londres et Madrid, des compagnies aériennes en Amérique latine, des entreprises de médias aux États-Unis et des entreprises partout dans le monde. J'ai fondé UP2CLOUD pour faire ce travail selon mes propres termes — axé sur les résultats, pas sur les effectifs.",
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
    desc: "11年为银行、航空公司和企业构建云基础设施。我构建可靠、可观测、物有所值的平台。",
    chips: [
      "11年以上云经验",
      "GCP · AWS · Azure · OCI",
      "驻马德里",
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
      title: "深度聚焦关键领域——拒绝虚荣指标",
      intro:
        "每项能力按级别和支撑工具展示。范围与证明，而非进度条。",
    },
    trust: {
      label: "企业信任",
      title: "受托于受监管的关键业务系统",
      intro:
        "银行、航空公司和全球企业——跨越四大云服务商和六个行业。",
    },
    global: {
      label: "全球交付",
      title: "立足葡萄牙，交付全球。",
      intro:
        "从巴西到欧洲，遍及美洲——云计算、DevOps、平台工程和FinOps，交付于工作所在之处。",
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
        "全栈实时力导向图——云、编排、CI/CD、数据和FinOps。拖拽、缩放，探索连接关系。",
    },
    finops: {
      label: "云成本工程",
      title: "将云支出转化为战略资产",
      intro:
        "成本优化、合理配置、治理、预测、成本分摊和自动化——精准测量，而非猜测。",
    },
    ai: {
      label: "AI与自动化",
      title: "面向未来：为GenAI打造的平台",
      intro:
        "从LLM集成到GPU感知的平台工程——让AI可靠、可观测且成本可控的基础设施。",
    },
    testimonials: {
      label: "认可",
      title: "获工程师和领导者认可",
    },
    contact: {
      label: "开始对话",
      title: "让我们共同构建有意义的事物",
      intro:
        "无论是云架构挑战、新平台建设还是长期合作——欢迎告诉我您正在做什么。",
    },
  },
  exec: [
    {
      title: "成长历程",
      headline: "从葡萄牙出发，交付全球",
      body: "从里斯本起步，辗转伦敦、马德里，跨越多个时区。为银行、航空公司和媒体企业构建平台。深刻理解生产环境在凌晨3点崩溃意味着什么——以及如何防止它再次发生。",
    },
    {
      title: "独特优势",
      headline: "技术深度延伸至成本管控",
      body: "我既是设计系统的架构师，也是盯着账单的FinOps负责人。这种组合——同时了解基础设施和其真实成本——实属罕见，它从根本上改变了你所构建的东西。",
    },
    {
      title: "专注领域",
      headline: "团队喜爱的平台。持续下降的成本。",
      body: "多云架构：GCP、AWS、Azure和OCI。Kubernetes、Terraform、CI/CD。成本治理。AI就绪基础设施。受监管的企业级环境，风险真实存在。",
    },
    {
      title: "合作方式",
      headline: "值得信赖的伙伴，而非任务执行者",
      body: "通过UP2CLOUD为国际客户提供独立咨询。分散式架构、平台构建或FinOps项目。我更倾向于能看到成果持续积累的长期合作。目前可接项目——通常24小时内回复。",
    },
  ],
  recruiter: {
    banner:
      "招聘模式 — 突出展示成就、领导力、认证和可用性",
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
      "我是Cesar的AI职业助手——我了解他的全部背景。请提问招聘决策所需的任何内容：资历、规模、领导力、成本影响、认证或可用性。请在下方尝试提问。",
    suggested: "为招聘者推荐的问题",
    placeholder: "询问Cesar是否适合您的职位…",
    thinking: "思考中…",
    followUp: "继续提问",
    sourceLabel: "基于个人资料",
  },
  portraitCaption: "马德里 · 格兰大道",
  contact: {
    briefingTitle: "携手合作",
    briefingDesc: "云架构、平台工程、DevOps、FinOps或AI基础设施——告诉我您正在构建什么，让我们探索合作的可能。",
    emailCta: "联系Cesar",
    downloadCv: "下载简历",
    availability: "可承接国际项目",
    responseTime: "通常24小时内回复",
    contactQuote: "我参与的每个项目都是某人的关键基础设施——银行的支付平台、航空公司的运营系统、媒体公司的数据骨干。我认真对待这份责任。如果您正在构建重要的东西，我真诚地想听您讲述。",
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
  statsLabels: ["技术年限", "云项目", "认证", "节省成本"],
  labels: {
    problem: "挑战",
    architecture: "方法",
    businessResult: "成果",
    lessons: "收获",
    aiFaqNote: "// 本网站的智能AI FAQ本身是一个AI集成——询问任何关于Cesar是否适合您职位的问题。",
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
  story: {
    pullQuote: "我在巴西长大，后来移居欧洲。11年来，我一直在构建不会故障的基础设施——为那些承受不起故障的银行、航空公司和企业。",
    p1: "我在圣保罗起步，为大型企业构建数据平台和软件系统。云基础设施很快吸引了我——如何让分布式系统在大规模下保持可靠、可观测且成本高效。这成为了我的事业。",
    p2: "二十多岁移居欧洲改变了我对这份工作的认知。跨越时区、语言和文化的工作经历教会了我认证所不能教的东西：云问题在很大程度上是人的问题。系统故障是因为团队之间沟通不畅。成本失控是因为没有人对其负责。平台崩溃是因为激励机制错位。",
    p3: "此后，我为伦敦和马德里的银行、拉丁美洲的航空公司、美国的媒体企业以及全球各地的公司构建了平台。我创立了UP2CLOUD，以自己的方式从事这份工作——专注于成果，而非人员规模。",
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
    document.documentElement.lang = l;
  }, []);

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t: DICT[lang] }), [lang, setLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) return { lang: "en", setLang: () => {}, t: DICT.en };
  return ctx;
}
