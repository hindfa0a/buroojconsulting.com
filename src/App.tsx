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
          <a href="#platforms">Platforms</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-action" href="#contact">
          Start a conversation
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
            <a className="secondary-button" href="https://iinvestinsaudi.com/">
              View iinvestinsaudi.com
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
