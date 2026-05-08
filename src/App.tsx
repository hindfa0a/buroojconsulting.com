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
    title: "Management & Legal Consulting",
    text: "Advisory support for Saudi and international firms across business structuring, governance, commercial documentation, and regulatory coordination.",
  },
  {
    icon: BarChart3,
    title: "Feasibility Studies & SIDF",
    text: "Bankable feasibility studies, market analysis, financial modeling, and submission support for Saudi Industrial Development Fund applications.",
  },
  {
    icon: Globe2,
    title: "Soft-Landing for Foreign Investors",
    text: "Market-entry guidance, licensing coordination, local introductions, banking support, partner search, and early operational setup in Saudi Arabia.",
  },
  {
    icon: Scale,
    title: "Legal Representation Coordination",
    text: "Formal legal representation and licensed legal services are coordinated through our partnering law firm, Muhammad Gamal Rushdi Law Firm.",
  },
] as const;

const process = [
  "Clarify the investment or expansion objective",
  "Map the legal, licensing, and operating requirements",
  "Prepare feasibility and financial documentation",
  "Coordinate submissions, partners, and execution support",
] as const;

const capabilities = [
  "Saudi market entry",
  "SIDF feasibility packages",
  "MISA and licensing coordination",
  "Commercial and legal documentation",
  "Partner and stakeholder introductions",
  "Investment platform development",
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
            <small>Management & Legal Consulting</small>
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
          <p className="eyebrow">Jeddah-based advisory for Saudi market entry</p>
          <h1>Burooj Management and Legal Consulting Firm</h1>
          <p className="hero-copy">
            Management, investment, and legal consulting for local and
            international companies entering, operating, and growing in Saudi
            Arabia.
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
            Partner law firm support
          </span>
          <span>
            <Landmark size={18} aria-hidden="true" />
            SIDF submission advisory
          </span>
        </div>
      </section>

      <section className="intro-section">
        <div className="intro-grid">
          <div>
            <p className="section-kicker">Parent advisory firm</p>
            <h2>Your practical partner for doing business in Saudi Arabia.</h2>
          </div>
          <p>
            Burooj brings together management consulting, legal coordination,
            feasibility preparation, investor soft-landing, and local execution
            support. The firm helps clients move from interest in the Saudi
            market to a clear path for licensing, financing, partnerships, and
            operations.
          </p>
        </div>
      </section>

      <section className="section" id="services">
        <div className="section-heading">
          <p className="section-kicker">Services</p>
          <h2>Advisory built around decisions, filings, and execution.</h2>
          <p>
            The work is designed for companies that need more than a report:
            they need a route through Saudi requirements, stakeholders, and
            practical next steps.
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
              </article>
            );
          })}
        </div>
      </section>

      <section className="band" id="approach">
        <div className="band-inner">
          <div className="section-heading align-left">
            <p className="section-kicker">Approach</p>
            <h2>Structured enough for banks and regulators. Practical enough for founders and operators.</h2>
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
          <h2>Where Burooj supports clients.</h2>
          <p>
            Burooj is built for the moments when a company needs to understand
            the Saudi market, prepare serious documentation, and coordinate with
            the right legal and institutional partners.
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
            Burooj provides management, investment, and legal consulting
            coordination. Formal legal representation is provided through our
            partnering licensed law firm, <strong>Muhammad Gamal Rushdi Law Firm</strong>.
          </p>
        </div>
        <div className="legal-panel">
          <BadgeCheck size={28} aria-hidden="true" />
          <h3>Muhammad Gamal Rushdi Law Firm</h3>
          <p>Licensed Saudi law firm partner for formal legal representation and legal services.</p>
        </div>
      </section>

      <section className="section platform-section" id="platforms">
        <div className="platform-copy">
          <p className="section-kicker">Platforms</p>
          <h2>iinvestinsaudi.com</h2>
          <p>
            Burooj is developing investor-facing platforms that connect market
            intelligence, opportunity discovery, and advisory support. The
            iinvestinsaudi.com platform focuses on investment opportunities and
            market-entry guidance in Saudi Arabia.
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
            Share where you are in the process, and Burooj can help define the
            next practical step.
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
