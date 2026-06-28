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

type SectionCopy = { label: string; title: string; intro?: string; verified?: string };

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
    prompts: string[];
  };
  portraitCaption: string;
  contact: {
    briefingTitle: string;
    briefingDesc: string;
    emailCta: string;
    downloadCv: string;
    availability: string;
    responseTime: string;
    rowLabels: {
      email: string;
      linkedin: string;
      github: string;
      location: string;
      responseTime: string;
    };
    form: {
      name: string;
      email: string;
      message: string;
      send: string;
      sending: string;
      success: string;
      error: string;
    };
  };
  statsLabels: string[];
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
    available: "Available for global remote consulting",
    roleLine:
      "Principal Cloud Architect · Platform Engineering · DevOps · FinOps · AI Infrastructure",
    desc: "10+ years building, automating and optimizing enterprise-scale multi-cloud platforms.",
    chips: [
      "10+ Years Experience",
      "Multi-Cloud Specialist",
      "International Consulting",
      "Enterprise-Scale Systems",
      "GCP · AWS · Azure Certified",
    ],
    ctaPrimary: "Book a consultation",
    ctaSecondary: "View impact stories",
  },
  sections: {
    summary: {
      label: "Executive Summary",
      title: "A senior cloud consultant, summarized for decision-makers",
      intro:
        "The 30-second brief: who Cesar is, why he's different, what he solves, and how to engage.",
    },
    experience: {
      label: "Career Impact",
      title: "Outcomes delivered across a decade of cloud leadership",
      intro:
        "Each role framed as Challenge → Action → Result. Expand a card for the business outcome, scale and stack.",
    },
    work: {
      label: "Selected Impact Stories",
      title: "Consulting-grade case studies, outcome-first",
      intro:
        "Real engagements as Problem → Architecture → Result. The business outcome leads; the how follows.",
    },
    capabilities: {
      label: "Engineering Capability Matrix",
      title: "Depth where it counts — no vanity metrics",
      intro:
        "Each capability shown by level and the tools behind it. Scope and proof, not progress bars.",
    },
    trust: {
      label: "Enterprise Validation",
      title: "Trusted with regulated, mission-critical systems",
      intro:
        "Banks, airlines and global enterprises — across four cloud providers and six industries.",
    },
    global: {
      label: "Global Delivery Map",
      title: "Senior cloud delivery, wherever you operate",
      intro:
        "A decade of work across Europe and the Americas — delivered on-site and fully remote.",
    },
    certifications: {
      label: "Certification Command Center",
      title: "Verified, multi-cloud credentials",
      intro: "Validated expertise across the three major clouds plus FinOps practice.",
      verified: "verified",
    },
    stack: {
      label: "Multi-Cloud Architecture Map",
      title: "An engineering galaxy, not a list of badges",
      intro:
        "A live force-directed graph of the full stack — clouds, orchestration, CI/CD, data and FinOps. Drag, zoom and explore the connections.",
    },
    finops: {
      label: "FinOps Operations Center",
      title: "Turning cloud spend into a strategic asset",
      intro:
        "Cost optimization, rightsizing, governance, forecasting, chargeback and automation — measured, not guessed.",
    },
    ai: {
      label: "AI Infrastructure & Automation",
      title: "Future-ready: platforms built for GenAI",
      intro:
        "From LLM integrations to GPU-aware platform engineering — infrastructure that makes AI reliable, observable and cost-aware.",
    },
    testimonials: {
      label: "Signal",
      title: "Trusted by engineers and leaders",
    },
    contact: {
      label: "Mission Briefing Console",
      title: "Let's architect your next platform",
      intro:
        "One of the strongest Cloud, Platform, DevOps & FinOps consultants available remotely in Europe.",
    },
  },
  exec: [
    {
      title: "Who",
      headline: "Principal-level cloud leadership",
      body: "A Principal Cloud Architect and Platform Engineer with 10+ years across GCP, AWS, Azure and OCI — from hands-on Kubernetes and Terraform to architecture and team leadership.",
    },
    {
      title: "Why different",
      headline: "Engineering depth + FinOps + business sense",
      body: "Most engineers build; few also cut cost and translate cloud into board-level outcomes. Cesar does all three — removing ~30% waste while keeping platforms resilient and observable.",
    },
    {
      title: "What he solves",
      headline: "Scale, spend, reliability and delivery speed",
      body: "Multi-cloud architecture, platform/DevOps modernization, cost optimization, data platforms and AI infrastructure — for regulated, enterprise-scale environments.",
    },
    {
      title: "How to engage",
      headline: "Available now, remote, worldwide",
      body: "Independent consulting via UP2CLOUD for international projects. Fractional architecture, platform builds or FinOps engagements. Usually replies within 24h.",
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
    prompts: [
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
    ],
  },
  portraitCaption: "Madrid · Gran Vía",
  contact: {
    briefingTitle: "Open a briefing",
    briefingDesc: "Cloud architecture, platform engineering, DevOps, FinOps or AI infrastructure — tell me what you're building.",
    emailCta: "Email Cesar",
    downloadCv: "Download CV",
    availability: "Available for international projects",
    responseTime: "Usually replies within 24h",
    rowLabels: {
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      location: "Location",
      responseTime: "Response time",
    },
    form: {
      name: "Your name",
      email: "Your email",
      message: "Tell me about your project...",
      send: "Send message",
      sending: "Sending...",
      success: "Message sent! I'll reply within 24h.",
      error: "Something went wrong. Try emailing directly.",
    },
  },
  statsLabels: ["Years in Tech", "Cloud Projects", "Certifications", "Cost Savings Generated"],
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
    available: "Disponível para consultoria remota global",
    roleLine:
      "Principal Cloud Architect · Engenharia de Plataformas · DevOps · FinOps · Infraestrutura de IA",
    desc: "Mais de 10 anos a construir, automatizar e otimizar plataformas multi-cloud à escala empresarial.",
    chips: [
      "10+ Anos de Experiência",
      "Especialista Multi-Cloud",
      "Consultoria Internacional",
      "Sistemas à Escala Empresarial",
      "Certificado GCP · AWS · Azure",
    ],
    ctaPrimary: "Marcar uma consultoria",
    ctaSecondary: "Ver casos de impacto",
  },
  sections: {
    summary: {
      label: "Resumo Executivo",
      title: "Um consultor cloud sénior, resumido para quem decide",
      intro:
        "O resumo de 30 segundos: quem é o Cesar, porque é diferente, o que resolve e como contratar.",
    },
    experience: {
      label: "Impacto na Carreira",
      title: "Resultados entregues ao longo de uma década de liderança cloud",
      intro:
        "Cada função apresentada como Desafio → Ação → Resultado. Expanda um cartão para ver o impacto de negócio, a escala e a stack.",
    },
    work: {
      label: "Casos de Impacto Selecionados",
      title: "Estudos de caso ao nível de consultoria, focados no resultado",
      intro:
        "Projetos reais como Problema → Arquitetura → Resultado. O resultado de negócio vem primeiro; o \"como\" segue-se.",
    },
    capabilities: {
      label: "Matriz de Competências de Engenharia",
      title: "Profundidade onde importa — sem métricas de vaidade",
      intro:
        "Cada competência apresentada por nível e pelas ferramentas que a sustentam. Âmbito e prova, não barras de progresso.",
    },
    trust: {
      label: "Validação Empresarial",
      title: "Confiado com sistemas regulados e críticos",
      intro:
        "Bancos, companhias aéreas e grandes empresas — em quatro fornecedores de cloud e seis indústrias.",
    },
    global: {
      label: "Mapa de Entrega Global",
      title: "Entrega cloud sénior, onde quer que opere",
      intro:
        "Uma década de trabalho na Europa e nas Américas — entregue presencialmente e totalmente remoto.",
    },
    certifications: {
      label: "Centro de Certificações",
      title: "Credenciais multi-cloud verificadas",
      intro: "Competências validadas nas três grandes clouds, mais prática de FinOps.",
      verified: "verificadas",
    },
    stack: {
      label: "Mapa de Arquitetura Multi-Cloud",
      title: "Uma galáxia de engenharia, não uma lista de crachás",
      intro:
        "Um grafo dinâmico de toda a stack — clouds, orquestração, CI/CD, dados e FinOps. Arraste, faça zoom e explore as ligações.",
    },
    finops: {
      label: "Centro de Operações FinOps",
      title: "Transformar o custo da cloud num ativo estratégico",
      intro:
        "Otimização de custos, dimensionamento, governança, previsão, imputação e automação — medido, não adivinhado.",
    },
    ai: {
      label: "Infraestrutura de IA & Automação",
      title: "Preparado para o futuro: plataformas para GenAI",
      intro:
        "De integrações com LLMs à engenharia de plataformas com GPUs — infraestrutura que torna a IA fiável, observável e consciente dos custos.",
    },
    testimonials: {
      label: "Reconhecimento",
      title: "Reconhecido por engenheiros e líderes",
    },
    contact: {
      label: "Consola de Briefing",
      title: "Vamos arquitetar a sua próxima plataforma",
      intro:
        "Um dos mais fortes consultores de Cloud, Plataformas, DevOps & FinOps disponível remotamente na Europa.",
    },
  },
  exec: [
    {
      title: "Quem",
      headline: "Liderança cloud ao nível Principal",
      body: "Um Principal Cloud Architect e Platform Engineer com mais de 10 anos em GCP, AWS, Azure e OCI — do Kubernetes e Terraform práticos à arquitetura e liderança de equipas.",
    },
    {
      title: "Porquê diferente",
      headline: "Profundidade de engenharia + FinOps + visão de negócio",
      body: "A maioria dos engenheiros constrói; poucos também reduzem custos e traduzem a cloud em resultados de administração. O Cesar faz os três — removendo ~30% de desperdício mantendo as plataformas resilientes e observáveis.",
    },
    {
      title: "O que resolve",
      headline: "Escala, custo, fiabilidade e velocidade de entrega",
      body: "Arquitetura multi-cloud, modernização de plataformas/DevOps, otimização de custos, plataformas de dados e infraestrutura de IA — para ambientes regulados e à escala empresarial.",
    },
    {
      title: "Como contratar",
      headline: "Disponível já, remoto, em todo o mundo",
      body: "Consultoria independente via UP2CLOUD para projetos internacionais. Arquitetura fracionada, construção de plataformas ou projetos de FinOps. Responde normalmente em 24h.",
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
    prompts: [
      "Por que devo contratar o Cesar?",
      "Que impacto de negócio o Cesar entregou?",
      "Mostrar experiência em arquitetura cloud",
      "Mostrar conquistas em FinOps",
      "Mostrar expertise em Kubernetes",
      "Mostrar certificações GCP",
      "Mostrar experiência em liderança",
      "Mostrar projetos empresariais",
      "Mostrar experiência em IA e automação",
      "Mostrar consultoria internacional",
    ],
  },
  portraitCaption: "Madrid · Gran Vía",
  contact: {
    briefingTitle: "Iniciar um briefing",
    briefingDesc: "Arquitetura cloud, engenharia de plataformas, DevOps, FinOps ou infraestrutura de IA — diga-me o que está a construir.",
    emailCta: "Enviar email ao Cesar",
    downloadCv: "Descarregar CV",
    availability: "Disponível para projetos internacionais",
    responseTime: "Responde normalmente em 24h",
    rowLabels: {
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      location: "Localização",
      responseTime: "Tempo de resposta",
    },
    form: {
      name: "O seu nome",
      email: "O seu email",
      message: "Conte-me sobre o seu projeto...",
      send: "Enviar mensagem",
      sending: "A enviar...",
      success: "Mensagem enviada! Responderei em 24h.",
      error: "Algo correu mal. Tente enviar email diretamente.",
    },
  },
  statsLabels: ["Anos em Tecnologia", "Projetos Cloud", "Certificações", "Poupança em Custos"],
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
    available: "Disponible para consultoría remota global",
    roleLine:
      "Principal Cloud Architect · Ingeniería de Plataformas · DevOps · FinOps · Infraestructura de IA",
    desc: "Más de 10 años construyendo, automatizando y optimizando plataformas multi-cloud a escala empresarial.",
    chips: [
      "10+ Años de Experiencia",
      "Especialista Multi-Cloud",
      "Consultoría Internacional",
      "Sistemas a Escala Empresarial",
      "Certificado GCP · AWS · Azure",
    ],
    ctaPrimary: "Reservar una consultoría",
    ctaSecondary: "Ver casos de impacto",
  },
  sections: {
    summary: {
      label: "Resumen Ejecutivo",
      title: "Un consultor cloud sénior, resumido para quien decide",
      intro:
        "El resumen de 30 segundos: quién es Cesar, por qué es diferente, qué resuelve y cómo contratarlo.",
    },
    experience: {
      label: "Impacto Profesional",
      title: "Resultados entregados durante una década de liderazgo cloud",
      intro:
        "Cada rol presentado como Reto → Acción → Resultado. Expande una tarjeta para ver el impacto de negocio, la escala y el stack.",
    },
    work: {
      label: "Casos de Impacto Seleccionados",
      title: "Casos de estudio de nivel consultoría, centrados en el resultado",
      intro:
        "Proyectos reales como Problema → Arquitectura → Resultado. El resultado de negocio va primero; el \"cómo\" después.",
    },
    capabilities: {
      label: "Matriz de Competencias de Ingeniería",
      title: "Profundidad donde importa — sin métricas de vanidad",
      intro:
        "Cada competencia mostrada por nivel y por las herramientas que la respaldan. Alcance y prueba, no barras de progreso.",
    },
    trust: {
      label: "Validación Empresarial",
      title: "De confianza para sistemas regulados y críticos",
      intro:
        "Bancos, aerolíneas y grandes empresas — en cuatro proveedores de cloud y seis industrias.",
    },
    global: {
      label: "Mapa de Entrega Global",
      title: "Entrega cloud sénior, dondequiera que operes",
      intro:
        "Una década de trabajo en Europa y América — entregado presencialmente y totalmente en remoto.",
    },
    certifications: {
      label: "Centro de Certificaciones",
      title: "Credenciales multi-cloud verificadas",
      intro: "Experiencia validada en las tres grandes clouds, más práctica de FinOps.",
      verified: "verificadas",
    },
    stack: {
      label: "Mapa de Arquitectura Multi-Cloud",
      title: "Una galaxia de ingeniería, no una lista de insignias",
      intro:
        "Un grafo dinámico de todo el stack — clouds, orquestación, CI/CD, datos y FinOps. Arrastra, haz zoom y explora las conexiones.",
    },
    finops: {
      label: "Centro de Operaciones FinOps",
      title: "Convertir el gasto cloud en un activo estratégico",
      intro:
        "Optimización de costes, dimensionamiento, gobierno, previsión, imputación y automatización — medido, no adivinado.",
    },
    ai: {
      label: "Infraestructura de IA y Automatización",
      title: "Preparado para el futuro: plataformas para GenAI",
      intro:
        "De integraciones con LLMs a la ingeniería de plataformas con GPUs — infraestructura que hace la IA fiable, observable y consciente del coste.",
    },
    testimonials: {
      label: "Reconocimiento",
      title: "Avalado por ingenieros y líderes",
    },
    contact: {
      label: "Consola de Briefing",
      title: "Diseñemos tu próxima plataforma",
      intro:
        "Uno de los consultores de Cloud, Plataformas, DevOps y FinOps más sólidos disponibles en remoto en Europa.",
    },
  },
  exec: [
    {
      title: "Quién",
      headline: "Liderazgo cloud de nivel Principal",
      body: "Un Principal Cloud Architect e ingeniero de plataformas con más de 10 años en GCP, AWS, Azure y OCI — desde Kubernetes y Terraform prácticos hasta arquitectura y liderazgo de equipos.",
    },
    {
      title: "Por qué diferente",
      headline: "Profundidad de ingeniería + FinOps + visión de negocio",
      body: "La mayoría de los ingenieros construye; pocos además reducen costes y traducen la cloud en resultados de dirección. Cesar hace los tres — eliminando ~30% de desperdicio manteniendo las plataformas resilientes y observables.",
    },
    {
      title: "Qué resuelve",
      headline: "Escala, gasto, fiabilidad y velocidad de entrega",
      body: "Arquitectura multi-cloud, modernización de plataformas/DevOps, optimización de costes, plataformas de datos e infraestructura de IA — para entornos regulados y a escala empresarial.",
    },
    {
      title: "Cómo contratar",
      headline: "Disponible ya, en remoto, en todo el mundo",
      body: "Consultoría independiente vía UP2CLOUD para proyectos internacionales. Arquitectura fraccional, construcción de plataformas o proyectos de FinOps. Suele responder en 24h.",
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
    prompts: [
      "¿Por qué debería contratar a Cesar?",
      "¿Qué impacto de negocio ha entregado Cesar?",
      "Mostrar experiencia en arquitectura cloud",
      "Mostrar logros en FinOps",
      "Mostrar experiencia en Kubernetes",
      "Mostrar certificaciones GCP",
      "Mostrar experiencia en liderazgo",
      "Mostrar proyectos empresariales",
      "Mostrar experiencia en IA y automatización",
      "Mostrar consultoría internacional",
    ],
  },
  portraitCaption: "Madrid · Gran Vía",
  contact: {
    briefingTitle: "Abrir un briefing",
    briefingDesc: "Arquitectura cloud, ingeniería de plataformas, DevOps, FinOps o infraestructura de IA — cuéntame qué estás construyendo.",
    emailCta: "Enviar email a Cesar",
    downloadCv: "Descargar CV",
    availability: "Disponible para proyectos internacionales",
    responseTime: "Suele responder en 24h",
    rowLabels: {
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      location: "Ubicación",
      responseTime: "Tiempo de respuesta",
    },
    form: {
      name: "Tu nombre",
      email: "Tu email",
      message: "Cuéntame sobre tu proyecto...",
      send: "Enviar mensaje",
      sending: "Enviando...",
      success: "¡Mensaje enviado! Responderé en 24h.",
      error: "Algo salió mal. Intenta escribir directamente.",
    },
  },
  statsLabels: ["Años en Tecnología", "Proyectos Cloud", "Certificaciones", "Ahorro en Costes"],
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
    available: "Disponible pour des missions de conseil à distance",
    roleLine:
      "Principal Cloud Architect · Ingénierie de Plateformes · DevOps · FinOps · Infrastructure IA",
    desc: "Plus de 10 ans à construire, automatiser et optimiser des plateformes multi-cloud à l'échelle entreprise.",
    chips: [
      "10+ Ans d'expérience",
      "Spécialiste Multi-Cloud",
      "Conseil International",
      "Systèmes à Échelle Entreprise",
      "Certifié GCP · AWS · Azure",
    ],
    ctaPrimary: "Réserver une consultation",
    ctaSecondary: "Voir les résultats",
  },
  sections: {
    summary: {
      label: "Résumé Exécutif",
      title: "Un consultant cloud senior, résumé pour les décideurs",
      intro:
        "Le résumé en 30 secondes : qui est Cesar, pourquoi il est différent, ce qu'il résout et comment l'engager.",
    },
    experience: {
      label: "Impact Carrière",
      title: "Résultats livrés au cours d'une décennie de leadership cloud",
      intro:
        "Chaque rôle présenté comme Défi → Action → Résultat. Développez une carte pour voir l'impact business, l'échelle et la stack.",
    },
    work: {
      label: "Études de cas sélectionnées",
      title: "Cas pratiques niveau conseil, axés sur les résultats",
      intro:
        "Missions réelles comme Problème → Architecture → Résultat. Le résultat business est en premier ; le comment suit.",
    },
    capabilities: {
      label: "Matrice de Compétences",
      title: "Profondeur là où ça compte — sans métriques de vanité",
      intro:
        "Chaque compétence présentée par niveau et par les outils qui la soutiennent. Périmètre et preuves, pas des barres de progression.",
    },
    trust: {
      label: "Validation Entreprise",
      title: "Approuvé pour des systèmes réglementés et critiques",
      intro:
        "Banques, compagnies aériennes et multinationales — sur quatre fournisseurs cloud et six secteurs.",
    },
    global: {
      label: "Carte de Livraison Mondiale",
      title: "Expertise cloud senior, où que vous opériez",
      intro:
        "Une décennie de travail en Europe et dans les Amériques — livré sur site et entièrement à distance.",
    },
    certifications: {
      label: "Centre de Certifications",
      title: "Certifications multi-cloud vérifiées",
      intro: "Expertise validée sur les trois grands clouds et la pratique FinOps.",
      verified: "vérifiées",
    },
    stack: {
      label: "Carte d'Architecture Multi-Cloud",
      title: "Une galaxie d'ingénierie, pas une liste de badges",
      intro:
        "Un graphe dynamique de la stack complète — clouds, orchestration, CI/CD, données et FinOps. Faites glisser, zoomez et explorez les connexions.",
    },
    finops: {
      label: "Centre d'Opérations FinOps",
      title: "Transformer les dépenses cloud en actif stratégique",
      intro:
        "Optimisation des coûts, redimensionnement, gouvernance, prévision, refacturation et automatisation — mesuré, pas deviné.",
    },
    ai: {
      label: "Infrastructure IA & Automatisation",
      title: "Préparé pour l'avenir : plateformes conçues pour GenAI",
      intro:
        "Des intégrations LLM à l'ingénierie de plateformes GPU — infrastructure qui rend l'IA fiable, observable et économe.",
    },
    testimonials: {
      label: "Références",
      title: "Reconnu par les ingénieurs et les dirigeants",
    },
    contact: {
      label: "Console de Briefing",
      title: "Construisons votre prochaine plateforme",
      intro:
        "L'un des consultants Cloud, Plateformes, DevOps & FinOps les plus solides disponibles à distance en Europe.",
    },
  },
  exec: [
    {
      title: "Qui",
      headline: "Leadership cloud au niveau Principal",
      body: "Un Principal Cloud Architect et ingénieur de plateformes avec 10+ ans sur GCP, AWS, Azure et OCI — du Kubernetes et Terraform pratiques à l'architecture et au management d'équipes.",
    },
    {
      title: "Pourquoi différent",
      headline: "Profondeur technique + FinOps + sens des affaires",
      body: "La plupart des ingénieurs construisent ; peu réduisent aussi les coûts et traduisent le cloud en résultats au niveau direction. Cesar fait les trois — supprimant ~30% de gaspillage tout en maintenant la résilience et l'observabilité.",
    },
    {
      title: "Ce qu'il résout",
      headline: "Échelle, coûts, fiabilité et vitesse de livraison",
      body: "Architecture multi-cloud, modernisation plateformes/DevOps, optimisation des coûts, plateformes de données et infrastructure IA — pour les environnements réglementés à l'échelle entreprise.",
    },
    {
      title: "Comment engager",
      headline: "Disponible maintenant, à distance, partout",
      body: "Conseil indépendant via UP2CLOUD pour des projets internationaux. Architecture fractionnée, construction de plateformes ou missions FinOps. Répond généralement sous 24h.",
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
    prompts: [
      "Pourquoi devrais-je recruter Cesar ?",
      "Quel impact business Cesar a-t-il apporté ?",
      "Montrer l'expérience en architecture cloud",
      "Montrer les réalisations FinOps",
      "Montrer l'expertise Kubernetes",
      "Montrer les certifications GCP",
      "Montrer l'expérience en leadership",
      "Montrer les projets entreprise",
      "Montrer l'expérience en IA et automatisation",
      "Montrer le conseil international",
    ],
  },
  portraitCaption: "Madrid · Gran Vía",
  contact: {
    briefingTitle: "Ouvrir un briefing",
    briefingDesc: "Architecture cloud, ingénierie de plateformes, DevOps, FinOps ou infrastructure IA — dites-moi ce que vous construisez.",
    emailCta: "Écrire à Cesar",
    downloadCv: "Télécharger le CV",
    availability: "Disponible pour des projets internationaux",
    responseTime: "Répond généralement sous 24h",
    rowLabels: {
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      location: "Localisation",
      responseTime: "Délai de réponse",
    },
    form: {
      name: "Votre nom",
      email: "Votre email",
      message: "Parlez-moi de votre projet...",
      send: "Envoyer le message",
      sending: "Envoi en cours...",
      success: "Message envoyé ! Je répondrai sous 24h.",
      error: "Une erreur s'est produite. Essayez d'écrire directement.",
    },
  },
  statsLabels: ["Ans dans la Tech", "Projets Cloud", "Certifications", "Économies Générées"],
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
    available: "可提供全球远程咨询服务",
    roleLine:
      "首席云架构师 · 平台工程 · DevOps · FinOps · AI基础设施",
    desc: "10余年构建、自动化和优化企业级多云平台的丰富经验。",
    chips: [
      "10年以上经验",
      "多云专家",
      "国际咨询",
      "企业级系统",
      "GCP · AWS · Azure认证",
    ],
    ctaPrimary: "预约咨询",
    ctaSecondary: "查看成功案例",
  },
  sections: {
    summary: {
      label: "执行摘要",
      title: "面向决策者的高级云顾问简介",
      intro:
        "30秒简介：Cesar是谁、为何与众不同、解决什么问题，以及如何合作。",
    },
    experience: {
      label: "职业成就",
      title: "十年云领导力交付的成果",
      intro:
        "每个职位按挑战→行动→结果呈现。展开卡片查看业务成果、规模和技术栈。",
    },
    work: {
      label: "精选影响力案例",
      title: "咨询级案例研究，以成果为先",
      intro:
        "真实项目按问题→架构→结果呈现。业务结果优先，实现方式随后。",
    },
    capabilities: {
      label: "工程能力矩阵",
      title: "深度聚焦关键领域——拒绝虚荣指标",
      intro:
        "每项能力按级别和支撑工具展示。范围与证明，而非进度条。",
    },
    trust: {
      label: "企业认可",
      title: "受托于受监管的关键业务系统",
      intro:
        "银行、航空公司和全球企业——跨越四大云服务商和六个行业。",
    },
    global: {
      label: "全球交付地图",
      title: "高级云交付，无论您在哪里运营",
      intro:
        "十年间在欧洲和美洲的工作经历——现场和完全远程交付。",
    },
    certifications: {
      label: "认证中心",
      title: "已验证的多云认证",
      intro: "三大主流云及FinOps实践的验证专业知识。",
      verified: "已验证",
    },
    stack: {
      label: "多云架构图",
      title: "工程星系，而非徽章列表",
      intro:
        "全栈实时力导向图——云、编排、CI/CD、数据和FinOps。拖拽、缩放，探索连接关系。",
    },
    finops: {
      label: "FinOps运营中心",
      title: "将云支出转化为战略资产",
      intro:
        "成本优化、合理配置、治理、预测、成本分摊和自动化——精准测量，而非猜测。",
    },
    ai: {
      label: "AI基础设施与自动化",
      title: "面向未来：为GenAI打造的平台",
      intro:
        "从LLM集成到GPU感知的平台工程——让AI可靠、可观测且成本可控的基础设施。",
    },
    testimonials: {
      label: "认可",
      title: "获工程师和领导者认可",
    },
    contact: {
      label: "任务简报台",
      title: "让我们共同架构您的下一个平台",
      intro:
        "欧洲最优秀的云、平台、DevOps和FinOps顾问之一，可远程提供服务。",
    },
  },
  exec: [
    {
      title: "关于",
      headline: "首席级云领导力",
      body: "Principal云架构师和平台工程师，在GCP、AWS、Azure和OCI拥有10年以上经验——从Kubernetes和Terraform实践到架构设计和团队领导。",
    },
    {
      title: "与众不同",
      headline: "技术深度 + FinOps + 商业洞察",
      body: "大多数工程师只负责构建；能同时削减成本并将云翻译为董事会级成果的人凤毛麟角。Cesar三者兼备——在保持平台弹性和可观测性的同时消除约30%的浪费。",
    },
    {
      title: "解决方案",
      headline: "规模、成本、可靠性和交付速度",
      body: "多云架构、平台/DevOps现代化、成本优化、数据平台和AI基础设施——面向受监管的企业级环境。",
    },
    {
      title: "合作方式",
      headline: "现在可用，远程，全球",
      body: "通过UP2CLOUD为国际项目提供独立咨询服务。分散式架构、平台构建或FinOps项目。通常24小时内回复。",
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
    prompts: [
      "为什么我应该聘用Cesar？",
      "Cesar带来了哪些业务影响？",
      "展示云架构经验",
      "展示FinOps成就",
      "展示Kubernetes专业知识",
      "展示GCP认证",
      "展示领导力经验",
      "展示企业项目",
      "展示AI和自动化经验",
      "展示国际咨询经验",
    ],
  },
  portraitCaption: "马德里 · 格兰大道",
  contact: {
    briefingTitle: "发起项目咨询",
    briefingDesc: "云架构、平台工程、DevOps、FinOps或AI基础设施——告诉我您正在构建什么。",
    emailCta: "发邮件给Cesar",
    downloadCv: "下载简历",
    availability: "可承接国际项目",
    responseTime: "通常24小时内回复",
    rowLabels: {
      email: "邮箱",
      linkedin: "LinkedIn",
      github: "GitHub",
      location: "地点",
      responseTime: "回复时间",
    },
    form: {
      name: "您的姓名",
      email: "您的邮箱",
      message: "告诉我您的项目需求...",
      send: "发送消息",
      sending: "发送中...",
      success: "消息已发送！我将在24小时内回复。",
      error: "出现错误，请直接发送邮件。",
    },
  },
  statsLabels: ["技术年限", "云项目", "认证", "节省成本"],
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

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(KEY, l);
  }, []);

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t: DICT[lang] }), [lang, setLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) return { lang: "en", setLang: () => {}, t: DICT.en };
  return ctx;
}
