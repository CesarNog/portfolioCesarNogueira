// Field Notes: long-form field reports, each one an expansion of a real
// lesson already on record in `projects` (site-config.ts). No new client
// claims are introduced here: every fact used (team counts, schema-change
// counts, availability figures, tool names) is already public on the
// matching /case-studies/[relatedCaseStudyId] page. English-only for now:
// unlike the short UI chrome (see lib/i18n.tsx `blog` namespace), full
// technical-essay translation is a deliberate fast-follow, not an oversight.

export type BlogDomain = "architecture" | "platform" | "finops";

// Maps 1:1 to the Domain-Color Rule in DESIGN.md and to the `.accent-*`
// utilities in app/globals.css: apply the class, then children read
// `text-accent` / `border-accent` / `bg-accent` without hardcoding a color.
export const DOMAIN_ACCENT_CLASS: Record<BlogDomain, string> = {
  architecture: "accent-blue",
  platform: "accent-cyan",
  finops: "accent-orange",
};

export type BlogPost = {
  slug: string;
  domain: BlogDomain;
  domainLabel: string;
  title: string;
  metaDescription: string;
  dek: string;
  publishedDate: string;
  readMinutes: number;
  // Not every post traces back to one of the three named case studies
  // (some, like a role held before UP2CLOUD, are only in `experience`).
  // The related-case-study callout in blog-post-body.tsx simply doesn't
  // render when this is absent.
  relatedCaseStudyId?: string;
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "noisy-neighbors-real-time-rendering",
    domain: "platform",
    domainLabel: "Platform Engineering",
    title: "Real-Time Rendering Doesn't Forgive Noisy Neighbors",
    metaDescription:
      "Configurator lag for one automotive brand is a UX bug. On shared Kubernetes infrastructure serving five, it's every brand's problem at once.",
    dek: "Configurator lag for one automotive brand is a UX bug. On shared Kubernetes infrastructure serving five, it's every brand's problem at once.",
    publishedDate: "2026-08-20",
    readMinutes: 5,
    body: [
      "Most Kubernetes horror stories are about scale: too many pods, not enough nodes, an autoscaler that reacts a beat too late. Building infrastructure for a real-time 3D visualization platform, the harder problem wasn't scale. It was that every millisecond of render latency was visible to a customer configuring a car.",
      "The platform served real-time visualization for several automotive OEM brands at once, including Volkswagen, Lucid, Vinfast, Mitsubishi and Cadillac, on shared multi-cloud infrastructure across AWS and GCP. Each brand's traffic pattern was different: a product launch for one client could spike load overnight, while another ran steady daytime traffic in a different region. Running that on shared Kubernetes clusters made resource utilization efficient. It also meant one brand's traffic spike was, by default, every other brand's latency problem.",
      "A configurator that renders a car in real time doesn't have the luxury of a queue. A batch job can wait its turn behind a noisy neighbor and nobody notices. A dropped frame during an interactive 3D render is immediately visible to whoever is looking at it, and it's visible on a screen with that brand's name on it, not the platform's. That asymmetry, invisible cost for us, visible cost for the client, is what made noisy-neighbor isolation a design requirement instead of an optimization to get to eventually.",
      "The fix wasn't exotic: resource requests and limits set from actual render-workload profiling rather than guesses, pod priority classes so a launch-day spike from one brand couldn't evict another brand's steady-state pods, and separating the loudest, most bursty workloads onto their own node pools instead of trusting the scheduler to sort it out under pressure. None of that shows up in a demo. It only shows up the first time two clients hit peak load in the same hour and nothing degrades.",
      "The broader lesson carries past rendering. On any shared platform serving multiple external clients, the question that matters isn't whether it can scale. It's what happens to client A when client B has a bad day. Design for that answer before a client ever asks it during an incident call.",
    ],
  },
  {
    slug: "observability-is-proof",
    domain: "architecture",
    domainLabel: "Cloud Architecture",
    title: "In Regulated Cloud, Observability Is Proof",
    metaDescription:
      "For banking and aviation clients, a dashboard isn't there to help you debug. It's there to show an auditor the system behaved.",
    dek: "For banking and aviation clients, a dashboard isn't there to help you debug. It's there to show an auditor the system behaved.",
    publishedDate: "2026-08-02",
    readMinutes: 5,
    relatedCaseStudyId: "banking-cloud",
    body: [
      "Most observability work is justified by mean time to resolution: faster alerts, clearer traces, less time spent guessing during an incident. That justification undersells what observability is for in a regulated industry. Building multi-cloud infrastructure across GCP, AWS, Azure and Oracle Cloud for AndBank, Santander and LATAM Airlines, the dashboards weren't primarily a debugging tool. They were the evidence.",
      "A compliance review in banking or aviation doesn't take your word that a system was available, that access was controlled, or that an incident was detected and handled within the required window. It asks for the record. If the record doesn't exist, or exists but can't be produced quickly and in the right format, the review fails regardless of how well the system actually performed.",
      "That reframes what 'observability' means as a deliverable. It's not enough for New Relic and PagerDuty to be wired up and generating alerts an on-call engineer can act on. The dashboards and the alert history need to be structured so an auditor, who has never seen the architecture before and doesn't have an engineer's patience for context, can look at them and see the compliance story: uptime, access, incident response, all with timestamps.",
      "Building that in from day one, rather than retrofitting it before an audit, changed the economics of the whole engagement. The platform ran at 99.9% availability, which is a real and hard-won number. But the reviews we passed on the first attempt, without a scramble to reconstruct six months of incident history from memory and Slack, were the difference the client actually noticed.",
      "The practical takeaway: when you're designing observability for a regulated workload, ask the compliance team what they'll be asked to prove before you ask the SRE team what they want to see at 3am. Both matter. Only one of them has a deadline that doesn't move.",
    ],
  },
  {
    slug: "design-for-schema-evolution",
    domain: "platform",
    domainLabel: "Platform & Data",
    title: "Design for Schema Evolution, Not Just Throughput",
    metaDescription:
      "A pipeline that survives six schema changes without a rewrite is worth more than one that only processes ten times the data.",
    dek: "A pipeline that survives six schema changes without a rewrite is worth more than one that only processes ten times the data.",
    publishedDate: "2026-06-22",
    readMinutes: 5,
    relatedCaseStudyId: "bigdata-platform",
    body: [
      "Throughput gets the attention in a big data build. Stakeholders ask how many events per second, how many terabytes per day, how the numbers compare to the old batch job. Those are fair questions, and the platform I built for a US media corporation answered them: real-time analytics over event streams that used to take a batch window to query, running on Apache Beam and BigQuery.",
      "What stakeholders don't ask about, and what actually determined whether the project succeeded, was what happens when the event schema changes. On this build it changed six times during development. A new field here, a renamed key there, a type that widened from an integer to a float once someone started measuring in decimals. None of those changes were mistakes. They were the product teams doing their job while the platform was being built underneath them.",
      "A pipeline that assumes a fixed schema treats every one of those six changes as an incident: a broken job, a Slack thread, a hotfix deployed under pressure. A pipeline designed for evolution treats them as Tuesday. The difference isn't a clever library. It's a decision made on day one to validate incoming events against a versioned schema, route anything that fails validation to a dead-letter path instead of crashing the job, and let downstream consumers declare which schema version they're reading rather than assuming there's only one.",
      "That decision costs something upfront. It means writing the schema registry and the validation layer before you've proven the pipeline works at all, which feels like solving a problem you don't have yet. By the third schema change, it's the reason the platform kept running while the roadmap kept moving.",
      "If I rebuilt this platform today, throughput would still matter, and BigQuery and Beam would still be the right tools for the volume. But the first design review wouldn't start with a load test. It would start with a fake schema change, run through the pipeline, to see what breaks.",
    ],
  },
  {
    slug: "governance-before-optimization",
    domain: "finops",
    domainLabel: "FinOps & Cost",
    title: "Governance Before Optimization",
    metaDescription:
      "Why the hardest part of cutting cloud waste wasn't the automation. It was getting twelve platform teams to agree on what to call a resource.",
    dek: "Why the hardest part of cutting cloud waste wasn't the automation. It was getting twelve platform teams to agree on what to call a resource.",
    publishedDate: "2026-05-14",
    readMinutes: 6,
    relatedCaseStudyId: "finops-automation",
    body: [
      "The instinct with a FinOps engagement is to start with the dashboard. Pull the billing export, build the chart, show finance where the money goes. That instinct is backwards. On a multi-account estate spanning GCP, AWS and Azure, the first project isn't visibility. It's vocabulary.",
      "At a global staffing company I worked with, the billing data was accurate and completely useless. Every team named its resources differently: some by project code, some by environment, some by whichever engineer happened to provision the instance that week. Cost allocation software can ingest any tagging convention. It cannot ingest twelve of them at once and produce a number finance can act on.",
      "So before a line of automation shipped, the work was organizational: a single tagging taxonomy, agreed on by twelve platform teams who each had a reasonable argument for keeping their own. That negotiation took longer than building the Python jobs that eventually read the tags. It also mattered more. Automation applied to inconsistent metadata just produces inconsistent reports faster.",
      "Once the taxonomy held, the rest followed a familiar shape: scheduled jobs against the CloudHealth and native billing APIs, auto-tagging for resources that slipped through provisioning without one, and a chargeback report finance could read without a translator. The waste we found, about 30% of spend, was real, but it was findable only because every dollar now traced back to a team, an environment and a purpose.",
      "The lesson generalizes past FinOps. Any system that reports on infrastructure inherits the infrastructure's naming discipline. Skip the governance step because it's slower and less visible than shipping a dashboard, and you'll ship a dashboard that lies convincingly.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
