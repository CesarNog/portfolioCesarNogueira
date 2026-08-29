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
  // External citations backing the technical claims in `body` (standards
  // bodies, official vendor docs). Every URL here has been fetched and
  // confirmed live, not guessed at, since a dead or fabricated citation
  // undermines the "proof, not claims" brand principle worse than having
  // no citation at all.
  references: { label: string; url: string }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "whose-name-is-on-the-pull-request",
    domain: "architecture",
    domainLabel: "Cloud Architecture",
    title: "Whose Name Is on the Pull Request",
    metaDescription:
      "Notes on running an embedded cloud and FinOps practice since 2022: what clients need in the first weeks of an engagement, how embedding differs from advising, and the real costs of ramp-up time, trust, and time zones that a services page never mentions.",
    dek: "Notes on running an embedded cloud and FinOps practice since 2022: what clients need in the first weeks of an engagement, how embedding differs from advising, and the real costs of ramp-up time, trust, and time zones that a services page never mentions.",
    publishedDate: "2026-08-28",
    readMinutes: 4,
    body: [
      "Founding UP2CLOUD in 2022 came out of a pattern I had seen from the inside at every mid-size company I had worked for: they needed someone with a decade-plus of architecture decisions behind them, but only for a defined stretch, not for good. Hiring a full-time principal architect is hard to justify when the backlog of hard problems is six months deep, not permanent. Handing the platform to a large consultancy solves the staffing problem, but often means the people who scoped the work are not the people doing it. What most companies needed, it turned out, was judgment on tap: senior enough to be trusted near production, temporary enough to make financial sense.",
      "The first weeks of an embedded engagement look nothing like the discovery workshop some clients expect. I ask for read access before I ask for a meeting: the infrastructure-as-code repos, the billing exports, the incident channel, whatever passes for a runbook. I sit quietly in standups. I want to see what breaks on an ordinary Tuesday, not what the roadmap slide promises for next quarter. Clients used to large consultancies sometimes wait for a findings deck that never comes. Instead they get someone cross-referencing the Terraform state against the cloud bill, because those two documents tell different, sometimes contradictory stories about the same infrastructure, and the gap between them is usually where the real problems live.",
      "The difference between advising and embedding shows up in whose name is on the pull request. An advisor reviews an architecture and hands back a recommendation; the client's team owns whatever happens next, and if it stalls, the advisor has already moved on to the next engagement. Embedding means I open the ticket, write the module, sit through the review comments, and I am still reachable when the change I proposed causes a problem three weeks later. That changes what I am willing to propose. Recommending a rewrite is easy when someone else has to live with it. It is a different decision when I am the one debugging it against the client's own SLA at two in the morning.",
      "None of this is free, and I have stopped pretending otherwise. Ramp-up time is real: the first month of any engagement runs slower than clients want, because understanding why a system was built a certain way takes longer than reading its diagram. Trust builds the way it does for any new hire, through small correct calls before anyone lets you near anything that matters, except there is less time to earn it, since the engagement itself has an end date. Working from Vila Real for clients in Spain, the Netherlands, the UK, Brazil, and the US adds its own cost: a two-hour overlap window with a team in Sao Paulo, an 8am standup for one client and a midnight change window for another. The week gets built around whoever has the least overlap with me, not the other way around.",
      "What makes the model work is specificity, not flexibility. Companies rarely need generic cloud advice; they need someone who has already made a particular kind of mistake (a multi-account billing setup nobody can reconcile, a shared Kubernetes cluster where teams do not trust each other's workloads, a schema that cannot absorb next quarter's data volume) and can recognize it faster the second time. Where it does not fit is anywhere that needs a person in the building every day for years, accumulating the institutional memory a full-time employee builds by default. I have learned to say so plainly when what a client needs is a hire, not a consultant of any kind. The engagements that go well are the ones where both sides were honest, from week one, about which of those two things they actually needed.",
    ],
    references: [
      { label: "Harvard Business Review: How to Make Fractional Leadership Work", url: "https://hbr.org/podcast/2025/08/how-to-make-fractional-leadership-work" },
      { label: "FinOps Foundation: FinOps Framework Personas", url: "https://www.finops.org/framework/personas/" },
    ],
  },
  {
    slug: "four-clouds-one-compliance-boundary",
    domain: "architecture",
    domainLabel: "Cloud Architecture",
    title: "Four Clouds, One Compliance Boundary",
    metaDescription:
      "At everis, isolating PII-handling workloads for banking and aviation clients meant redrawing the same compliance boundary four times, once for each cloud's idea of what a network actually is.",
    dek: "At everis, isolating PII-handling workloads for banking and aviation clients meant redrawing the same compliance boundary four times, once for each cloud's idea of what a network actually is.",
    publishedDate: "2026-08-28",
    readMinutes: 5,
    relatedCaseStudyId: "banking-cloud",
    body: [
      "When I joined the engagements with AndBank, Santander, and LATAM Airlines at everis, the brief sounded like a single sentence: isolate the workloads that touch PII, control what talks to what, and be able to prove it. In practice that sentence had to be translated four times, because the clients' infrastructure spanned GCP, AWS, Azure, and OCI, and none of those four platforms agree on what a network boundary is made of. A VPC in GCP is a global resource with regional subnets. A VPC in AWS is regional by default, with peering and transit gateways doing the work GCP gives you for free. Azure's VNets carry their own service endpoint and private link model. OCI, still newer to most architects at the time, had its own take on security lists and network security groups layered on top of a topology that borrowed from all three of the others without matching any of them exactly. Compliance doesn't care about any of that. It just asks whether cardholder data or personal information can reach somewhere it shouldn't. The architecture has to answer that question consistently, even when the underlying primitives don't.",
      "The actual work started with mapping, not building. Before any subnet got drawn, I had to establish which workloads handled PII at all, because sensitive data is not self-declaring in a running system: it hides in log pipelines, in caching layers, in batch jobs that pull a nightly extract for reconciliation. Once that inventory existed, the segmentation question became simpler to state and harder to solve: put every PII-handling workload behind a boundary where east-west traffic is default-deny, and make every exception to that default an explicit, auditable rule rather than an accident of a permissive security group. On AWS that meant security groups scoped tightly enough that a compromised instance in the general application tier had no route to the tier holding customer records. On GCP it meant VPC Service Controls and firewall rules built around service accounts rather than IP ranges, since IP-based trust breaks down fast in an autoscaling environment. On Azure it meant NSGs paired with subnet delegation so that PaaS services didn't quietly get a default path into the same address space as everything else. On OCI it meant learning, sometimes the hard way, which of its network security constructs mapped to concepts I already trusted, and which just looked like them.",
      "The harder problem was never any single cloud's controls. It was translation. A compliance boundary defined once, for a banking regulator or an aviation security standard, has to be mapped onto four different enforcement surfaces so that the statement 'PII workloads are isolated' means the same thing everywhere an auditor might look. I ended up keeping a boundary map that was independent of any provider: which workloads are in scope, what they are allowed to talk to, what they are never allowed to talk to, and then a per-cloud translation layer underneath it showing exactly which security group, firewall rule, or NSG enforced each line. Without that separation, the temptation is to let the architecture drift toward whichever cloud's model is easiest to reason about, and quietly under-segment the others to match. That drift is invisible until an audit or an incident makes it visible, and by then it is a finding, not a design conversation.",
      "IAM made this harder still, because network segmentation and identity segmentation are supposed to reinforce each other, and across four clouds they don't share a vocabulary either. A network boundary that is airtight but paired with an identity model that lets a service account or app registration reach across it accomplishes nothing: the perimeter is fine and the actual control has moved elsewhere. Part of the design was making sure the IAM boundary and the network boundary were drawn around the same set of workloads on every platform, not just conceptually similar sets. That required going platform by platform and asking the same question with no shortcuts: given this identity's actual permissions, not its intended permissions, can it reach a PII-handling resource it shouldn't. GCP service accounts, AWS IAM roles, Azure managed identities, and OCI dynamic groups all needed that same audit, and none of the answers transferred cleanly from one cloud to the next.",
      "What stayed with me from that engagement is that multi-cloud segmentation is not a networking problem that happens to touch compliance. It is a compliance problem that happens to require four separate networking implementations. The regulator's boundary is the constant. The VPC, the VNet, and whatever OCI calls its equivalent are just the current vocabulary for expressing it, and that vocabulary will keep changing as providers add new primitives. The discipline that survives a platform migration is keeping the compliance boundary defined once, in provider-neutral terms, and treating every cloud-specific control as a translation of it that can be checked, not a policy in its own right.",
    ],
    references: [
      { label: "PCI Security Standards Council: Guidance for PCI DSS Scoping and Network Segmentation", url: "https://www.pcisecuritystandards.org/documents/Guidance-PCI-DSS-Scoping-and-Segmentation_v1.pdf" },
      { label: "NIST SP 800-125B: Secure Virtual Network Configuration for Virtual Machine Protection", url: "https://csrc.nist.gov/pubs/sp/800/125/b/final" },
      { label: "Google Cloud: VPC Network Overview", url: "https://cloud.google.com/vpc/docs/vpc" },
    ],
  },
  {
    slug: "platform-adoption-is-a-training-problem",
    domain: "platform",
    domainLabel: "Platform Engineering",
    title: "The Cluster Was the Easy Part",
    metaDescription:
      "At Accenture Interactive I stood up GKE and CD automation for enterprise clients in months. Training 120+ engineers to trust it, and get certified on it, took the rest of the year.",
    dek: "At Accenture Interactive I stood up GKE and CD automation for enterprise clients in months. Training 120+ engineers to trust it, and get certified on it, took the rest of the year.",
    publishedDate: "2026-08-28",
    readMinutes: 5,
    body: [
      "When I took on the Technology Architecture Manager role at Accenture Interactive in Sao Paulo in 2020, the brief looked like an infrastructure problem: enterprise clients wanted GKE clusters, and they wanted CI/CD automation with Jenkins and Spinnaker feeding into them so releases stopped being a manual, ticket-driven ordeal. That part I could scope in a planning meeting: cluster topology, namespace boundaries, pipeline stages, rollback strategy, all known shapes. What the brief did not say out loud, because nobody had framed it as a deliverable yet, was that none of it would matter if the delivery teams inheriting these clusters didn't trust them enough to use them the way they were designed to be used. A GKE cluster nobody trusts becomes a very expensive place to run three services and route everything else around.",
      "The harder project sat next to the infrastructure one: getting 120-plus Accenture Interactive professionals through Google Cloud certifications. On paper this reads as a training line item. In practice it was the actual adoption mechanism, and it was a much messier problem than the platform build. The clusters had one right answer per decision; the people did not start from one place. Some had run production systems on VMs for a decade and treated containers as a mild inconvenience layered on top of deployment habits they weren't going to abandon on faith. Others were early-career and had never operated anything, so Kubernetes wasn't replacing a mental model, it was their first one. A single curriculum pitched at the median would have bored the first group into disengagement and lost the second group in week one. I couldn't design one on-ramp; I had to design a program that let people enter at different points and still converge on the same certification bar.",
      "The pre-sales angle made this harder before it made it better. I was running technical pre-sales conversations with clients at the same time I was trying to get the enablement team fluent enough to deliver what those conversations promised. That ordering is backwards from how you'd design it on a whiteboard, and there was no clean way to sequence it differently, since the whole point of the engagement was to win the work by demonstrating the capability existed. So the training program had to produce credible competence under a deadline that came from sales cycles, not from a learning schedule. That's a different constraint than training people well. It's training people well enough, fast enough, that the client believes the delivery risk is gone. Certification became the proof point precisely because it was external and verifiable: nobody has to take my word for a team's Kubernetes readiness if 120 of them are Google Cloud certified.",
      "What actually worked was pairing the certification track with real cluster work rather than running it as a parallel classroom exercise. People who were skeptical of a new deployment model didn't get convinced by slides explaining why Kubernetes was better than what they knew; they got convinced by being handed a real GKE namespace, a real Spinnaker pipeline, and a low-stakes service to push through it before anything client-facing depended on the outcome. The certification study gave people the vocabulary and the exam gave them a checkpoint, but the trust came from doing the thing themselves and watching a rollback actually roll back. If I were redesigning the program today, I'd push that pairing earlier and harder: less time establishing concepts in the abstract before touching a cluster, more supervised production-adjacent reps from day one, with certification study running alongside rather than ahead of it.",
      "The lesson I carried forward from that year is that a platform migration and a training program are the same project wearing different clothes, and treating them as sequential (build the platform, then train people on it) is how you end up with a working cluster and a delivery team that still routes around it out of habit. The certifications mattered less as credentials and more as a forcing function that made the learning path concrete and gave 120 people a shared, verifiable finish line at different starting speeds. The technical build was necessary. It was also the part I'd already done before. The enablement design was the part that determined whether any of it survived contact with a production deadline.",
    ],
    references: [
      { label: "Google Cloud Certification Program", url: "https://cloud.google.com/certification" },
      { label: "Kubernetes Documentation: Concepts and Overview", url: "https://kubernetes.io/docs/concepts/overview/" },
      { label: "DORA: DevOps Research and Assessment", url: "https://dora.dev/research/" },
    ],
  },
  {
    slug: "self-serve-bigquery-is-an-interface-problem",
    domain: "platform",
    domainLabel: "Platform & Data",
    title: "Self-Serve BigQuery Is an Interface Problem, Not a Data Problem",
    metaDescription:
      "On a media analytics platform at CI&T, the hard part of letting editors and product managers query BigQuery directly wasn't the warehouse. It was designing curated views, cost guardrails, and naming that a non-engineer could trust without an engineer in the loop.",
    dek: "On a media analytics platform at CI&T, the hard part of letting editors and product managers query BigQuery directly wasn't the warehouse. It was designing curated views, cost guardrails, and naming that a non-engineer could trust without an engineer in the loop.",
    publishedDate: "2026-08-28",
    readMinutes: 5,
    relatedCaseStudyId: "bigdata-platform",
    body: [
      "When we built the analytics platform for a US mass-media corporation at CI&T (Apache Beam pipelines on Dataflow feeding a BigQuery warehouse, with App Engine services and a React front end on top), the pipelines were the part that got the attention. Ingesting massive event streams reliably, keeping schemas from breaking downstream consumers: that was the visible engineering problem. What took longer to get right, and what I think about more now as a FinOps consultant, was something quieter: getting the warehouse into a state where a product manager or an editor could open it and ask their own question, without filing a ticket and waiting for an engineer to write the SQL.",
      "Self-serve sounds like a permissions checkbox. Grant read access to the dataset, point people at a query editor, done. In practice that's the fastest way to make a warehouse unusable to the people you built it for. Raw event tables in a system like this are denormalized, partitioned for ingestion efficiency rather than readability, and full of columns that only make sense if you know how the pipeline populated them. A non-engineer given direct access to that layer doesn't get self-serve, they get a wall of tables named after internal pipeline stages, and they go back to asking an engineer to write the query. The access was never the bottleneck. The interface was.",
      "What actually made self-serve work was a curated layer sitting between the raw tables and the people using them: views built specifically to be read by someone who doesn't know the ingestion internals, named after the business concepts editors and product managers already used in conversation, not after the tables they were derived from. BigQuery's authorized views were the mechanism for this: they let you expose a query result to a group of users without granting them access to the underlying dataset at all, so the raw layer could stay locked down while the curated layer stayed open. That separation did two things at once. It gave analysts a stable, comprehensible surface to query against, and it gave engineers room to change the raw schema underneath without breaking anyone's dashboard, since the view's contract to its consumers was independent of how the source tables were structured. Getting the naming and grouping of those views right took more iteration than the query logic inside them: you're designing for someone who thinks in 'articles read by region last week', not in join keys.",
      "The other half of the problem was cost, and it's the half that gets skipped when self-serve is treated as a solved problem once the views exist. BigQuery bills on-demand queries by bytes scanned, and a self-serve user exploring a warehouse of event-level media data can trigger a query that scans terabytes without realizing it, especially against a table that isn't partitioned or clustered the way they'd expect. An engineer writing a query knows to check the bytes-processed estimate first. A product manager clicking through a query editor generally doesn't, and shouldn't have to. The fix wasn't to trust people to be careful, it was to build the guardrails into the platform: custom per-user and per-project query quotas so a single runaway query couldn't consume a disproportionate share of the daily budget, and views scoped tightly enough that an accidental full-table scan hit a curated subset instead of the entire event stream. Cost control, in a self-serve context, is a design constraint on the interface, not a monitoring dashboard you check after the fact.",
      "The lesson I carried forward into FinOps work is that self-serve analytics fails or succeeds on decisions that look unrelated to data modeling: what you name a view, who gets access to which layer, what happens by default when someone runs an expensive query without knowing it's expensive. None of that shows up in a pipeline diagram. All of it determines whether a warehouse actually gets used by the people it was built for, or quietly reverts to asking an engineer, which is the state you were trying to escape in the first place. The engineering effort to build the warehouse and the design effort to make it approachable are different disciplines, and treating the second as an afterthought to the first is the most common way these platforms underdeliver on their promise.",
    ],
    references: [
      { label: "BigQuery: Introduction to Authorized Views", url: "https://cloud.google.com/bigquery/docs/authorized-views" },
      { label: "BigQuery: Custom Query Quotas", url: "https://cloud.google.com/bigquery/docs/custom-quotas" },
      { label: "BigQuery: Estimate and Control Costs", url: "https://cloud.google.com/bigquery/docs/best-practices-costs" },
    ],
  },
  {
    slug: "forecast-accuracy-is-a-feedback-loop",
    domain: "finops",
    domainLabel: "FinOps & Cost",
    title: "What It Costs to Keep a Forecast Honest",
    metaDescription:
      "Getting a cloud cost forecast within a few points of actual spend is not a modeling exercise you finish once. It is a monthly habit of checking the model against reality, and it is the only thing that makes a thousand automated cost actions safe to leave running.",
    dek: "Getting a cloud cost forecast within a few points of actual spend is not a modeling exercise you finish once. It is a monthly habit of checking the model against reality, and it is the only thing that makes a thousand automated cost actions safe to leave running.",
    publishedDate: "2026-08-28",
    readMinutes: 5,
    body: [
      "The number people ask about first is the accuracy figure: plus or minus 4 percent, across the engagements where I've built this practice. What they usually mean by the question is 'what's the model', as if forecast accuracy were a property of an algorithm. It isn't. I have used simple moving averages that landed within a couple of points in a stable environment, and I have watched a more sophisticated regression drift 15 points off in an environment with lumpy commitment renewals. The model matters far less than whether anyone is checking it against what actually happened, on a fixed cadence, and adjusting it when it's wrong. That check is the entire practice. Everything else is bookkeeping.",
      "Forecasts degrade for a small number of recurring reasons, and none of them are exotic. Seasonality is the obvious one: a retail workload in November does not look like the same workload in February, and a forecast trained on a flat baseline will miss the spike every time until someone tells it to expect one. One-off spend is the quieter problem: a data migration, a load test left running over a weekend, a one-time licensing true-up. If you don't tag and exclude these from the training data, the model learns that irregular spend is normal, and it starts predicting noise as if it were signal. And then there are changes to the commercial terms underneath everything: a new savings plan, a reserved instance renewal, a committed-use discount that resets on a different date than the last one. None of these are hard to explain after the fact. They are only hard to catch before the fact, and the only way to catch them before they wreck a forecast is to have already built the habit of looking.",
      "That habit is the forecasting feedback loop, and it is less glamorous than it sounds: at the end of each month, pull the forecast that was generated at the start of it, put it next to what was actually spent, and look at the gap. Not just the aggregate gap: the gap by service, by account, by the categories that actually move independently of each other. Most of the time the gap is small and boring, and that's fine, that's what a working forecast looks like. The times it matters are when the gap has a pattern: the same service overshooting three months running, or a business unit whose actuals keep coming in under forecast because someone quietly rightsized a fleet and never told finance. Those patterns are where you adjust the model, tighten a seasonal adjustment, add a variable, exclude a cost center that behaves differently from the rest. Skip this step and the forecast doesn't fail loudly. It just slowly stops being trusted, and the finance team goes back to spreadsheets and gut checks, which is the actual failure mode you're trying to avoid.",
      "The automation side has its own version of this problem, and it took me longer to see it clearly. Running around 1,200 automated cost-governance actions a month sounds like a lot, and it is, but volume was never the hard part. Writing a rule that shuts down an idle dev environment at 9pm or resizes an over-provisioned instance based on a week of utilization data is not difficult. What's difficult is trusting that the rule is still doing what you think it's doing three months later, after the workload it was written for has changed shape. A rightsizing policy tuned against last quarter's traffic pattern can start downsizing something that's actually grown, and if you're not watching for it, the first sign is an incident, not a report. Automation at that volume is not free once it's running. It just moves the cost from manual review of individual actions to periodic audit of the rules themselves, and if you don't pay that second cost, you're carrying risk you can't see.",
      "So the discipline that actually protects both halves of this, the forecast and the automation, is the same discipline: sampling your own output and comparing it to reality on a schedule you don't skip. For forecasting, that means the actual-versus-predicted review every month, not at renewal time or when something looks off. For automation, it means pulling a sample of actions taken by each policy and asking whether a human would have made the same call, not assuming that because an action fired without an alert, it fired correctly. Tagging coverage at 98 percent is what makes both of these checks possible at all. You cannot audit a rightsizing policy's decisions by team if half the instances it touched aren't attributed to a team. Forecast accuracy and safe automation volume are not two separate wins. They're the same feedback loop, applied to two different outputs, and the loop is the part nobody puts on a slide.",
    ],
    references: [
      { label: "FinOps Foundation: Forecasting Capability", url: "https://www.finops.org/framework/capabilities/forecasting/" },
      { label: "AWS: Forecasting with Cost Explorer", url: "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-forecast.html" },
    ],
  },
  {
    slug: "why-i-recertified-as-a-cloud-architect",
    domain: "architecture",
    domainLabel: "Cloud Architecture",
    title: "Why I Sat the Cloud Architect Exam a Second Time",
    metaDescription:
      "A cloud certification is not a diploma you hang on a wall once. The services, the pricing, and the guidance underneath it change enough in two years that letting it lapse quietly would have meant letting my own knowledge lapse with it.",
    dek: "A cloud certification is not a diploma you hang on a wall once. The services, the pricing, and the guidance underneath it change enough in two years that letting it lapse quietly would have meant letting my own knowledge lapse with it.",
    publishedDate: "2026-08-28",
    readMinutes: 5,
    body: [
      "I've been asked more than once why I bothered recertifying as a Google Cloud Professional Cloud Architect instead of just leaving the first certification on my resume and moving on. It's a fair question, because on paper the credential doesn't expire in any way that shows up in a client conversation. Nobody has ever asked me for the issue date. But I sat the exam again anyway, because the thing the certification is supposed to represent, current, working knowledge of how to architect on that platform, is not the same thing two years apart. The badge doesn't decay. The knowledge under it does, whether or not you notice it happening.",
      "The concrete reason is that the exam itself changes, and it changes because the platform underneath it changes. Services get deprecated. Reference architectures that were the right answer get quietly replaced by better ones. The Well-Architected guidance gets revised as the provider learns from how people actually run workloads at scale, and a design pattern I would have confidently recommended two years ago might now be the thing the current exam guide flags as an anti-pattern. I have 10-plus years across GCP, AWS, and Azure, and the honest version of that sentence is not 'I learned this once and it still applies.' It's 'I've had to keep re-learning parts of this every year, because standing still on any one of these platforms means falling behind on all of them within about eighteen months.'",
      "What made the second exam different from the first wasn't the format, it was what I had to unlearn going in. I went into my recertification prep expecting to skim and refresh. Instead I found myself re-deriving my own default answers on cost optimization and reliability patterns, because the guidance had moved and my working assumptions hadn't caught up automatically just from doing client work. That's the uncomfortable part of this: day-to-day project work keeps you sharp on the things you're actively using, and lets everything else quietly go stale. Recertifying forces a full pass across the whole surface area again, including the parts of the platform you haven't touched on a client engagement in a year. That's exactly the part that day-to-day billable work will never force you to do on its own.",
      "I hold the Associate Cloud Engineer certification alongside the Professional Cloud Architect, and separately AWS Cloud Practitioner and Azure Fundamentals, and I don't treat any of the three providers' programs as optional once you're actually operating across all three. Multi-cloud work doesn't mean you get to have one deep credential and wave at the other two. It means the pricing models, the shared-responsibility boundaries, and the native tooling are genuinely different across GCP, AWS, and Azure, and a mistake made from assuming one provider's defaults apply to another is exactly the kind of mistake a client notices immediately, usually on their bill. Keeping a live certification on each isn't about the badge count. It's a forcing function to actually go back and update the mental model for a platform I'm not touching every week.",
      "None of this is an argument that certification substitutes for hands-on delivery experience, and I'd be skeptical of anyone who implied otherwise. What it is, is a check against a specific failure mode: knowing a platform well enough to have opinions about it, and not knowing that some of those opinions are two years out of date. Cloud architecture is one of the few technical disciplines where the ground genuinely moves under a credential that never expires on paper. Recertifying is just the practice of admitting that and doing something about it on a schedule, instead of finding out the hard way, mid-engagement, that the pattern I recommended from memory got deprecated a year ago.",
    ],
    references: [
      { label: "Google Cloud: Professional Cloud Architect Certification", url: "https://cloud.google.com/learn/certification/cloud-architect" },
      { label: "Microsoft: Azure Fundamentals (AZ-900) Certification", url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/" },
    ],
  },
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
    references: [
      { label: "Kubernetes: Resource Management for Pods and Containers", url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/" },
      { label: "Kubernetes: Pod Priority and Preemption", url: "https://kubernetes.io/docs/concepts/scheduling-eviction/pod-priority-preemption/" },
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
    references: [
      { label: "PCI Security Standards Council: Standards", url: "https://www.pcisecuritystandards.org/standards/" },
      { label: "NIST SP 800-53 Rev. 5: Security and Privacy Controls", url: "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final" },
      { label: "AWS Well-Architected Framework", url: "https://aws.amazon.com/architecture/well-architected/" },
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
    references: [
      { label: "Apache Beam Documentation", url: "https://beam.apache.org/documentation/" },
      { label: "Google Cloud: Managing Table Schemas (BigQuery)", url: "https://cloud.google.com/bigquery/docs/managing-table-schemas" },
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
    references: [
      { label: "FinOps Foundation: The FinOps Framework", url: "https://www.finops.org/framework/" },
      { label: "AWS Whitepaper: Best Practices for Tagging AWS Resources", url: "https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/tagging-best-practices.html" },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
