import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Check,
  Globe2,
  Handshake,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Scale,
  ShieldCheck,
} from "lucide-react";
import "./index.css";

const services = [
  {
    icon: BriefcaseBusiness,
    title: "Management & Legal Advisory",
    text: "Practical advisory for local and international companies on market entry, operating models, governance, commercial arrangements, and regulatory coordination.",
    items: [
      "Entity and operating structure",
      "Governance and commercial arrangements",
      "Regulatory coordination roadmap",
    ],
  },
  {
    icon: BarChart3,
    title: "Feasibility Studies & SIDF Packages",
    text: "Feasibility studies, market analysis, financial models, and submission-ready documentation for Saudi Industrial Development Fund applications.",
    items: [
      "Market and demand assessment",
      "Financial model and assumptions",
      "SIDF submission documentation",
    ],
  },
  {
    icon: Globe2,
    title: "Foreign Investor Soft-Landing",
    text: "Guided entry into Saudi Arabia, including licensing coordination, local introductions, banking readiness, partner search, and early operating setup.",
    items: [
      "Entry pathway and licensing sequence",
      "Banking and administrative readiness",
      "Local partner and stakeholder access",
    ],
  },
  {
    icon: Scale,
    title: "Legal Representation Through Partners",
    text: "When formal legal representation is required, Burooj coordinates licensed legal services through Muhammad Gamal Rushdi Law Firm.",
    items: [
      "Representation pathway coordination",
      "Legal document and case handoff",
      "Licensed Saudi law firm support",
    ],
  },
] as const;

const engagementTypes = [
  {
    label: "For international investors",
    text: "Understand the Saudi opportunity, choose the right entry path, and identify the local steps needed before committing capital or resources.",
  },
  {
    label: "For Saudi companies",
    text: "Prepare credible expansion, financing, and partnership documentation for growth projects, industrial investments, and strategic initiatives.",
  },
  {
    label: "For lenders and stakeholders",
    text: "Present feasibility, legal coordination, and operating assumptions in a disciplined format that supports review, discussion, and decision-making.",
  },
] as const;

const requestPathways = [
  {
    value: "management_consulting",
    label: "Management consulting",
    summary: "Strategy, operating model, governance, partnerships, and practical execution support.",
    checklist: ["Business objective", "Current challenge", "Decision timeline"],
  },
  {
    value: "legal_consulting",
    label: "Legal consulting coordination",
    summary: "Legal advisory coordination, document review pathway, and partner-law-firm handoff where needed.",
    checklist: ["Matter type", "Relevant parties", "Documents available"],
  },
  {
    value: "legal_representation",
    label: "Legal representation",
    summary: "Formal representation pathway coordinated through Muhammad Gamal Rushdi Law Firm.",
    checklist: ["Matter background", "Counterparties", "Urgent deadlines"],
  },
  {
    value: "feasibility_study",
    label: "Feasibility study",
    summary: "Market, technical, financial, and commercial feasibility documentation for Saudi projects.",
    checklist: ["Project brief", "Capex range", "Available assumptions"],
  },
  {
    value: "sidf_submission",
    label: "SIDF submission preparation",
    summary: "Submission-ready feasibility, financial model, and support documentation for SIDF review.",
    checklist: ["Project sector", "Financing need", "Existing study/model"],
  },
  {
    value: "soft_landing",
    label: "Foreign investor soft-landing",
    summary: "Market-entry, licensing, banking, local partner, and operating readiness support.",
    checklist: ["Home country", "Saudi entry status", "Setup timeline"],
  },
  {
    value: "opportunity_inquiry",
    label: "iinvestinsaudi opportunity",
    summary: "Opportunity-specific advisory, feasibility, SIDF, or soft-landing request from iinvestinsaudi.com.",
    checklist: ["Opportunity reference", "Investor role", "Required support"],
  },
  {
    value: "general_market_entry",
    label: "General Saudi market entry",
    summary: "Early guidance for companies exploring whether and how to enter the Saudi market.",
    checklist: ["Sector", "Target activity", "Questions to resolve"],
  },
] as const;

type RequestPathway = (typeof requestPathways)[number]["value"];

const reviewSteps = [
  {
    label: "Submitted",
    text: "Your request is received with a reference number and routed to the right review path.",
  },
  {
    label: "Under review",
    text: "Burooj reviews service fit, document completeness, feasibility/SIDF readiness, and legal scope.",
  },
  {
    label: "Decision",
    text: "The request is marked accepted, pending more information, or not a fit at this stage.",
  },
  {
    label: "Next step",
    text: "Accepted requests move into consultation, scoping, legal partner coordination, or proposal preparation.",
  },
] as const;

interface RequestFormState {
  sourceSite: string;
  opportunityId: string;
  servicePath: RequestPathway;
  applicantType: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  preferredLanguage: string;
  preferredContact: string;
  requestTitle: string;
  message: string;
  sector: string;
  investmentSize: string;
  timeline: string;
  projectType: string;
  currentStudyStatus: string;
  misaStatus: string;
  legalMatterType: string;
  counterparty: string;
  privacyAccepted: boolean;
  partnerConsent: boolean;
}

type FormErrors = Partial<Record<keyof RequestFormState | "attachments", string>>;

const SERVICE_PARAM_MAP: Record<string, RequestPathway> = {
  management: "management_consulting",
  consulting: "management_consulting",
  legal: "legal_consulting",
  representation: "legal_representation",
  feasibility: "feasibility_study",
  sidf: "sidf_submission",
  softlanding: "soft_landing",
  "soft-landing": "soft_landing",
  opportunity: "opportunity_inquiry",
  market_entry: "general_market_entry",
};

const MAX_FILES = 10;
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_TOTAL_FILE_SIZE = 100 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/csv",
  "image/jpeg",
  "image/png",
] as const;

const getInitialRequestState = (): RequestFormState => {
  const params =
    typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search);
  const serviceParam = params.get("service")?.toLowerCase() ?? "";
  const opportunityId = params.get("opportunity") ?? params.get("opportunityId") ?? "";
  const sourceSite = params.get("source") ?? "";
  const opportunityTitle = params.get("title") ?? "";
  const sector = params.get("sector") ?? "";
  const servicePath =
    opportunityId.length > 0
      ? "opportunity_inquiry"
      : SERVICE_PARAM_MAP[serviceParam] ?? "general_market_entry";

  return {
    sourceSite,
    opportunityId,
    servicePath,
    applicantType: "",
    fullName: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    preferredLanguage: "English",
    preferredContact: "Email",
    requestTitle: opportunityTitle ? `Advisory review for ${opportunityTitle}` : "",
    message: "",
    sector,
    investmentSize: "",
    timeline: "",
    projectType: "",
    currentStudyStatus: "",
    misaStatus: "",
    legalMatterType: "",
    counterparty: "",
    privacyAccepted: false,
    partnerConsent: false,
  };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requestEndpoint = import.meta.env.VITE_BUROOJ_REQUEST_ENDPOINT as string | undefined;

const formatFileSize = (size: number) => {
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(size / 1024))} KB`;
};

const buildMailBody = (request: RequestFormState, attachments: File[]) =>
  [
    "New Burooj advisory request",
    "",
    `Source site: ${request.sourceSite || "Direct"}`,
    `Opportunity ID: ${request.opportunityId || "-"}`,
    `Service path: ${request.servicePath}`,
    `Applicant type: ${request.applicantType || "-"}`,
    "",
    `Name: ${request.fullName}`,
    `Email: ${request.email}`,
    `Phone: ${request.phone || "-"}`,
    `Company: ${request.company || "-"}`,
    `Country: ${request.country || "-"}`,
    `Preferred language: ${request.preferredLanguage || "-"}`,
    `Preferred contact: ${request.preferredContact || "-"}`,
    "",
    `Request title: ${request.requestTitle || "-"}`,
    `Sector: ${request.sector || "-"}`,
    `Investment size: ${request.investmentSize || "-"}`,
    `Timeline: ${request.timeline || "-"}`,
    `Project type: ${request.projectType || "-"}`,
    `Current study status: ${request.currentStudyStatus || "-"}`,
    `MISA / setup status: ${request.misaStatus || "-"}`,
    `Legal matter type: ${request.legalMatterType || "-"}`,
    `Counterparty: ${request.counterparty || "-"}`,
    "",
    "Message:",
    request.message,
    "",
    "Attachments selected in browser:",
    attachments.length > 0
      ? attachments.map((file) => `- ${file.name} (${formatFileSize(file.size)})`).join("\n")
      : "- None",
  ].join("\n");

const process = [
  "Define the business objective and Saudi market pathway",
  "Map licensing, legal, financing, and operating requirements",
  "Prepare the feasibility, financial, and commercial documentation",
  "Coordinate submissions, partners, and on-the-ground execution support",
] as const;

const capabilities = [
  "Saudi market-entry strategy",
  "SIDF-ready feasibility studies",
  "MISA and sector licensing coordination",
  "Commercial and legal document coordination",
  "Local partner and stakeholder introductions",
  "Investor-facing platform development",
] as const;

const sectors = [
  "Industrial investment",
  "Manufacturing",
  "Petrochemicals and downstream",
  "Professional services",
  "Real estate and infrastructure",
  "International expansion",
] as const;

function App() {
  const [request, setRequest] = useState<RequestFormState>(() => getInitialRequestState());
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "sent" | "fallback" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [shouldFocusRequest] = useState(() => {
    const initial = getInitialRequestState();
    return Boolean(initial.sourceSite || initial.opportunityId);
  });

  const activePathway = useMemo(
    () => requestPathways.find((pathway) => pathway.value === request.servicePath) ?? requestPathways[0],
    [request.servicePath],
  );

  useEffect(() => {
    if (!shouldFocusRequest) return;
    window.setTimeout(() => {
      const requestSection = document.getElementById("request");
      if (!requestSection) return;
      const top = requestSection.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior: "auto" });
    }, 50);
  }, [shouldFocusRequest]);

  const setField = <K extends keyof RequestFormState>(key: K, value: RequestFormState[K]) => {
    setRequest((current) => ({ ...current, [key]: value }));
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  };

  const validateRequest = () => {
    const next: FormErrors = {};
    if (!request.fullName.trim()) next.fullName = "Please enter your full name.";
    if (!EMAIL_RE.test(request.email.trim())) next.email = "Please enter a valid work email.";
    if (!request.message.trim()) next.message = "Please describe the request.";
    if (!request.privacyAccepted) next.privacyAccepted = "Please confirm the review and privacy notice.";
    if (request.servicePath === "legal_representation" && !request.partnerConsent) {
      next.partnerConsent = "Please acknowledge that representation is handled through the partner law firm.";
    }
    if (request.servicePath === "opportunity_inquiry" && !request.opportunityId.trim()) {
      next.opportunityId = "Please include the opportunity reference.";
    }
    return next;
  };

  const onAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const totalSize = files.reduce((total, file) => total + file.size, 0);
    let attachmentError = "";

    if (files.length > MAX_FILES) {
      attachmentError = `Please upload no more than ${MAX_FILES} files.`;
    } else if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      attachmentError = "Each file must be 25 MB or smaller.";
    } else if (totalSize > MAX_TOTAL_FILE_SIZE) {
      attachmentError = "Total attachment size must be 100 MB or smaller.";
    } else if (
      files.some((file) => file.type && !ALLOWED_FILE_TYPES.includes(file.type as (typeof ALLOWED_FILE_TYPES)[number]))
    ) {
      attachmentError = "Accepted files: PDF, DOCX, XLSX, PPTX, CSV, JPG, and PNG.";
    }

    if (attachmentError) {
      setAttachments([]);
      setErrors((current) => ({ ...current, attachments: attachmentError }));
      event.target.value = "";
      return;
    }

    setAttachments(files);
    setErrors((current) => ({ ...current, attachments: undefined }));
  };

  const onSubmitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateRequest();
    setErrors(nextErrors);
    setSubmitMessage("");
    setSubmitState("idle");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const subject = `Burooj request - ${activePathway.label} - ${request.fullName}`;

    if (!requestEndpoint) {
      window.location.href = `mailto:fhindi@iinvestinsaudi.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        buildMailBody(request, attachments),
      )}`;
      setSubmitState("fallback");
      setSubmitMessage(
        "Your email client has been opened with the request details. Secure attachment upload and status tracking will activate when the Supabase backend is connected.",
      );
      return;
    }

    setSubmitState("submitting");
    try {
      const formData = new FormData();
      Object.entries(request).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      attachments.forEach((file) => formData.append("attachments", file));

      const response = await fetch(requestEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Request submission failed");

      setSubmitState("sent");
      setSubmitMessage("Your request was submitted successfully. Burooj will review it and respond with the next step.");
      setRequest(getInitialRequestState());
      setAttachments([]);
      setErrors({});
    } catch (error) {
      console.error("Burooj request submission failed:", error);
      setSubmitState("error");
      setSubmitMessage("The request could not be submitted. Please try again or email us directly.");
    }
  };

  return (
    <main>
      <header className="site-header">
        <a href="#top" className="brand" aria-label="Burooj Consulting home">
          <span className="brand-mark">B</span>
          <span>
            <strong>Burooj</strong>
            <small>Management and Legal Consulting</small>
          </span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#services">Services</a>
          <a href="#approach">Approach</a>
          <a href="#request">Request</a>
          <a href="#platforms">Platforms</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-action" href="#request">
          Start a request
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">Jeddah-based Saudi advisory firm</p>
          <h1>Burooj Management and Legal Consulting Firm</h1>
          <p className="hero-copy">
            We help local and international companies understand the Saudi
            market, prepare serious feasibility and financing documentation, and
            move from interest to practical execution.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#services">
              Explore services
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="secondary-button" href="#request">
              Start advisory request
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="hero-proof" aria-label="Firm highlights">
          <span>
            <MapPin size={18} aria-hidden="true" />
            Jeddah, Saudi Arabia
          </span>
          <span>
            <ShieldCheck size={18} aria-hidden="true" />
            Legal representation via partner firm
          </span>
          <span>
            <Landmark size={18} aria-hidden="true" />
            SIDF-ready documentation
          </span>
        </div>
      </section>

      <section className="intro-section">
        <div className="intro-grid">
          <div>
            <p className="section-kicker">Parent advisory firm</p>
            <h2>A practical partner for doing business in Saudi Arabia.</h2>
          </div>
          <p>
            Burooj is a Jeddah-based management and legal consulting firm for
            companies that need clear advice, credible documentation, and local
            coordination in Saudi Arabia. The firm connects strategy with the
            practical work behind licensing, financing, partnerships, and legal
            representation through trusted partners.
          </p>
        </div>
      </section>

      <section className="section" id="services">
        <div className="section-heading">
          <p className="section-kicker">Services</p>
          <h2>Advisory built around decisions, submissions, and execution.</h2>
          <p>
            Burooj supports clients before, during, and after market entry:
            clarifying the opportunity, preparing investor and lender-ready
            materials, and coordinating the local steps needed to move forward.
          </p>
        </div>
        <div className="service-grid">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article className="service-card" key={service.title}>
                <Icon size={24} aria-hidden="true" />
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <ul>
                  {service.items.map((item) => (
                    <li key={item}>
                      <Check size={15} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section engagement-section">
        <div className="section-heading">
          <p className="section-kicker">Engagement focus</p>
          <h2>Clear advisory for the parties around the decision.</h2>
          <p>
            Burooj is positioned to support the business owner, the foreign
            investor, the lender, and the local partner with documentation and
            coordination that can be acted on.
          </p>
        </div>
        <div className="engagement-grid">
          {engagementTypes.map((item) => (
            <article key={item.label}>
              <h3>{item.label}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="band" id="approach">
        <div className="band-inner">
          <div className="section-heading align-left">
            <p className="section-kicker">Approach</p>
            <h2>Structured enough for lenders and regulators. Practical enough for founders and operators.</h2>
          </div>
          <div className="process-list">
            {process.map((item, index) => (
              <div className="process-item" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section split-section">
        <div>
          <p className="section-kicker">Capabilities</p>
          <h2>Where Burooj is most useful.</h2>
          <p>
            The firm is positioned for companies that are ready to make a real
            decision about Saudi Arabia, whether they are assessing feasibility,
            preparing for SIDF, seeking a local partner, or establishing a
            first operating presence.
          </p>
        </div>
        <div className="check-grid">
          {capabilities.map((item) => (
            <span key={item}>
              <Check size={17} aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="section legal-section">
        <div className="legal-copy">
          <p className="section-kicker">Legal representation</p>
          <h2>Partner law firm coordination where licensed representation is required.</h2>
          <p>
            Burooj provides management consulting and legal advisory
            coordination. Formal legal representation and licensed legal
            services are provided through our partnering Saudi law firm,{" "}
            <strong>Muhammad Gamal Rushdi Law Firm</strong>.
          </p>
        </div>
        <div className="legal-panel">
          <BadgeCheck size={28} aria-hidden="true" />
          <h3>Muhammad Gamal Rushdi Law Firm</h3>
          <p>Partner Saudi law firm for formal legal representation and licensed legal services.</p>
        </div>
      </section>

      <section className="section platform-section" id="platforms">
        <div className="platform-copy">
          <p className="section-kicker">Platforms</p>
          <h2>iinvestinsaudi.com</h2>
          <p>
            Burooj is developing investor-facing platforms that connect market
            intelligence, opportunity discovery, and advisory support.
            iinvestinsaudi.com is part of that initiative, focused on making
            Saudi investment opportunities easier to understand and evaluate.
          </p>
          <a className="text-link" href="https://iinvestinsaudi.com/">
            Visit the platform
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="sector-list">
          {sectors.map((sector) => (
            <span key={sector}>
              <Building2 size={16} aria-hidden="true" />
              {sector}
            </span>
          ))}
        </div>
      </section>

      <section className="section review-section">
        <div className="section-heading">
          <p className="section-kicker">Request journey</p>
          <h2>One professional intake desk for advisory, feasibility, SIDF, soft-landing, and legal coordination.</h2>
          <p>
            iinvestinsaudi.com remains the opportunity showcase. Serious
            inquiries are routed to Burooj so every request can be reviewed,
            documented, and moved through a clear decision process.
          </p>
        </div>
        <div className="review-steps">
          {reviewSteps.map((step, index) => (
            <article key={step.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.label}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="request-section" id="request">
        <div className="request-shell">
          <div className="request-copy">
            <p className="section-kicker">Start a request</p>
            <h2>Tell us what you need reviewed.</h2>
            <p>
              Choose the pathway that best fits your request. Burooj will use
              the information to route the matter for advisory review, legal
              partner coordination, feasibility/SIDF assessment, or
              soft-landing scoping.
            </p>
            <div className="active-pathway">
              <strong>{activePathway.label}</strong>
              <p>{activePathway.summary}</p>
              <ul>
                {activePathway.checklist.map((item) => (
                  <li key={item}>
                    <Check size={15} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <form className="request-form" onSubmit={onSubmitRequest} noValidate>
            <div className="pathway-grid" aria-label="Request pathways">
              {requestPathways.map((pathway) => (
                <button
                  type="button"
                  key={pathway.value}
                  className={request.servicePath === pathway.value ? "selected" : ""}
                  onClick={() => setField("servicePath", pathway.value)}
                >
                  <span>{pathway.label}</span>
                </button>
              ))}
            </div>

            <div className="form-grid">
              <label>
                Applicant type
                <select
                  value={request.applicantType}
                  onChange={(event) => setField("applicantType", event.target.value)}
                >
                  <option value="">Select type</option>
                  <option>International investor</option>
                  <option>Saudi company</option>
                  <option>Foreign company</option>
                  <option>Individual investor</option>
                  <option>Lender or stakeholder</option>
                  <option>Legal client</option>
                </select>
              </label>
              <label>
                Full name *
                <input
                  value={request.fullName}
                  onChange={(event) => setField("fullName", event.target.value)}
                  className={errors.fullName ? "invalid" : ""}
                  autoComplete="name"
                />
                {errors.fullName && <span className="form-error">{errors.fullName}</span>}
              </label>
              <label>
                Work email *
                <input
                  type="email"
                  value={request.email}
                  onChange={(event) => setField("email", event.target.value)}
                  className={errors.email ? "invalid" : ""}
                  autoComplete="email"
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </label>
              <label>
                Phone / WhatsApp
                <input
                  value={request.phone}
                  onChange={(event) => setField("phone", event.target.value)}
                  autoComplete="tel"
                />
              </label>
              <label>
                Company
                <input
                  value={request.company}
                  onChange={(event) => setField("company", event.target.value)}
                  autoComplete="organization"
                />
              </label>
              <label>
                Country
                <input
                  value={request.country}
                  onChange={(event) => setField("country", event.target.value)}
                  autoComplete="country-name"
                />
              </label>
              <label>
                Preferred language
                <select
                  value={request.preferredLanguage}
                  onChange={(event) => setField("preferredLanguage", event.target.value)}
                >
                  <option>English</option>
                  <option>Arabic</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Chinese</option>
                  <option>Japanese</option>
                  <option>Korean</option>
                  <option>Hindi</option>
                  <option>Turkish</option>
                  <option>Indonesian</option>
                </select>
              </label>
              <label>
                Preferred contact
                <select
                  value={request.preferredContact}
                  onChange={(event) => setField("preferredContact", event.target.value)}
                >
                  <option>Email</option>
                  <option>WhatsApp</option>
                  <option>Phone call</option>
                </select>
              </label>
              <label>
                Source site
                <input
                  value={request.sourceSite}
                  onChange={(event) => setField("sourceSite", event.target.value)}
                  placeholder="Direct or iinvestinsaudi"
                />
              </label>
              <label>
                Opportunity reference
                <input
                  value={request.opportunityId}
                  onChange={(event) => setField("opportunityId", event.target.value)}
                  className={errors.opportunityId ? "invalid" : ""}
                  placeholder="Optional unless sent from iinvestinsaudi"
                />
                {errors.opportunityId && <span className="form-error">{errors.opportunityId}</span>}
              </label>
              <label className="full">
                Request title
                <input
                  value={request.requestTitle}
                  onChange={(event) => setField("requestTitle", event.target.value)}
                  placeholder="Example: SIDF feasibility support for industrial project"
                />
              </label>
              <label>
                Sector
                <input
                  value={request.sector}
                  onChange={(event) => setField("sector", event.target.value)}
                  placeholder="Manufacturing, real estate, services..."
                />
              </label>
              <label>
                Investment size / budget
                <select
                  value={request.investmentSize}
                  onChange={(event) => setField("investmentSize", event.target.value)}
                >
                  <option value="">Select range</option>
                  <option>Under SAR 1M</option>
                  <option>SAR 1M - 10M</option>
                  <option>SAR 10M - 50M</option>
                  <option>SAR 50M - 200M</option>
                  <option>SAR 200M+</option>
                  <option>Not decided yet</option>
                </select>
              </label>
              <label>
                Timeline
                <select value={request.timeline} onChange={(event) => setField("timeline", event.target.value)}>
                  <option value="">Select timeline</option>
                  <option>Urgent</option>
                  <option>Within 30 days</option>
                  <option>1 - 3 months</option>
                  <option>3 - 6 months</option>
                  <option>Exploratory</option>
                </select>
              </label>

              {(request.servicePath === "feasibility_study" ||
                request.servicePath === "sidf_submission" ||
                request.servicePath === "opportunity_inquiry") && (
                <>
                  <label>
                    Project type
                    <input
                      value={request.projectType}
                      onChange={(event) => setField("projectType", event.target.value)}
                      placeholder="Industrial, logistics, tourism, platform..."
                    />
                  </label>
                  <label>
                    Current study/model status
                    <select
                      value={request.currentStudyStatus}
                      onChange={(event) => setField("currentStudyStatus", event.target.value)}
                    >
                      <option value="">Select status</option>
                      <option>No study yet</option>
                      <option>Initial concept only</option>
                      <option>Draft feasibility available</option>
                      <option>Financial model available</option>
                      <option>Ready for SIDF preparation</option>
                    </select>
                  </label>
                </>
              )}

              {request.servicePath === "soft_landing" && (
                <label className="full">
                  Saudi setup / MISA status
                  <select value={request.misaStatus} onChange={(event) => setField("misaStatus", event.target.value)}>
                    <option value="">Select status</option>
                    <option>Not started</option>
                    <option>Exploring MISA license</option>
                    <option>MISA license in progress</option>
                    <option>Entity already established</option>
                    <option>Need banking/admin/local partner support</option>
                  </select>
                </label>
              )}

              {(request.servicePath === "legal_consulting" || request.servicePath === "legal_representation") && (
                <>
                  <label>
                    Legal matter type
                    <input
                      value={request.legalMatterType}
                      onChange={(event) => setField("legalMatterType", event.target.value)}
                      placeholder="Contract, dispute, licensing, corporate..."
                    />
                  </label>
                  <label>
                    Counterparty / authority
                    <input
                      value={request.counterparty}
                      onChange={(event) => setField("counterparty", event.target.value)}
                      placeholder="For conflict/scope screening"
                    />
                  </label>
                </>
              )}

              <label className="full">
                Request description *
                <textarea
                  value={request.message}
                  onChange={(event) => setField("message", event.target.value)}
                  className={errors.message ? "invalid" : ""}
                  placeholder="Describe the project, legal matter, feasibility need, SIDF requirement, or soft-landing support you need."
                />
                {errors.message && <span className="form-error">{errors.message}</span>}
              </label>

              <label className="full file-field">
                Supporting documents
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.xlsx,.pptx,.csv,.jpg,.jpeg,.png"
                  onChange={onAttachmentChange}
                />
                <span>
                  PDF, DOCX, XLSX, PPTX, CSV, JPG, PNG. Up to 10 files, 25 MB each.
                </span>
                {errors.attachments && <span className="form-error">{errors.attachments}</span>}
                {attachments.length > 0 && (
                  <ul className="file-list">
                    {attachments.map((file) => (
                      <li key={`${file.name}-${file.size}`}>
                        {file.name} <span>{formatFileSize(file.size)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </label>

              <label className="full consent-field">
                <input
                  type="checkbox"
                  checked={request.privacyAccepted}
                  onChange={(event) => setField("privacyAccepted", event.target.checked)}
                />
                <span>
                  I confirm that the submitted information may be reviewed by
                  Burooj for advisory triage and, where relevant, shared with
                  the partner law firm for legal scope review.
                </span>
              </label>
              {errors.privacyAccepted && <span className="form-error full">{errors.privacyAccepted}</span>}

              {request.servicePath === "legal_representation" && (
                <>
                  <label className="full consent-field legal-consent">
                    <input
                      type="checkbox"
                      checked={request.partnerConsent}
                      onChange={(event) => setField("partnerConsent", event.target.checked)}
                    />
                    <span>
                      I understand that formal legal representation and licensed
                      legal services are provided through Muhammad Gamal Rushdi
                      Law Firm after conflict and engagement checks.
                    </span>
                  </label>
                  {errors.partnerConsent && <span className="form-error full">{errors.partnerConsent}</span>}
                </>
              )}
            </div>

            <button className="request-submit" type="submit" disabled={submitState === "submitting"}>
              {submitState === "submitting" ? "Submitting request..." : "Submit request for review"}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            {submitMessage && (
              <div className={`request-message ${submitState}`} role="status">
                {submitMessage}
              </div>
            )}
          </form>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div>
          <p className="section-kicker">Contact</p>
          <h2>Discuss your Saudi market entry, feasibility study, or advisory need.</h2>
          <p>
            Share where you are in the process, and Burooj will help define the
            next practical step with the right mix of advisory, documentation,
            and partner coordination.
          </p>
        </div>
        <div className="contact-actions">
          <a href="mailto:fhindi@iinvestinsaudi.com">
            <Mail size={18} aria-hidden="true" />
            fhindi@iinvestinsaudi.com
          </a>
          <a href="tel:+966554990187">
            <Phone size={18} aria-hidden="true" />
            +966 55 499 0187
          </a>
          <a href="https://wa.me/966554990187">
            <Handshake size={18} aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </section>

      <footer>
        <div>
          <strong>Burooj Management and Legal Consulting Firm</strong>
          <p>Jeddah, Saudi Arabia</p>
        </div>
        <p>
          Hero photo: Jeddah, Saudi Arabia by shahad hassan on Unsplash.
        </p>
      </footer>
    </main>
  );
}

export default App;
