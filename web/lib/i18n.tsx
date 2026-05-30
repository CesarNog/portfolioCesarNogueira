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

export type Lang = "en" | "pt" | "es";
export const LANGS: { code: Lang; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "pt", label: "PT", name: "Português" },
  { code: "es", label: "ES", name: "Español" },
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
  };
  portraitCaption: string;
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
  },
  portraitCaption: "Madrid · Gran Vía",
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
  },
  portraitCaption: "Madrid · Gran Vía",
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
  },
  portraitCaption: "Madrid · Gran Vía",
};

const DICT: Record<Lang, Dict> = { en, pt, es };

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
