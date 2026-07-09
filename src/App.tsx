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
  Languages,
  Mail,
  MapPin,
  Phone,
  Scale,
  ShieldCheck,
} from "lucide-react";
import "./index.css";

type Language = "en" | "ar";

type RequestPathway =
  | "management_consulting"
  | "legal_consulting"
  | "legal_representation"
  | "feasibility_study"
  | "sidf_submission"
  | "soft_landing"
  | "opportunity_inquiry"
  | "health_law_inquiry"
  | "general_market_entry";

const serviceIcons = [BriefcaseBusiness, BarChart3, Globe2, Scale] as const;

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

const content = {
  en: {
    meta: {
      lang: "en",
      dir: "ltr",
      toggleLabel: "العربية",
      navLabel: "Primary navigation",
      brandAria: "Burooj Consulting home",
    },
    brand: {
      name: "Burooj",
      subtitle: "Management and Legal Consulting",
      fullName: "Burooj Management and Legal Consulting Firm",
      location: "Jeddah, Saudi Arabia",
    },
    nav: {
      services: "Services",
      approach: "Approach",
      request: "Request",
      platforms: "Platforms",
      contact: "Contact",
      cta: "I INVEST IN SAUDI",
      ctaHref: "https://iinvestinsaudi.com/",
    },
    hero: {
      kicker: "Jeddah-based Saudi advisory firm",
      title: "BUROOJ CONSULTING",
      subtitle: "Venture Strategy, Market Entry & Counsel",
      copy:
        "We deliver premium venture strategy and legal advisory to help high-growth startups secure capital, build investment-ready infrastructure, and scale with absolute compliance, guiding international founders through a seamless investor soft landing, complete KSA company registration, and every legal requirement to establish a bulletproof presence in the Kingdom.",
      primary: "I INVEST IN SAUDI",
      primaryHref: "https://iinvestinsaudi.com/",
      secondary: "Start Your KSA Market Entry",
      tertiary: "Book a Venture Strategy Consultation",
      proofAria: "Firm highlights",
      proof: [
        "Jeddah, Saudi Arabia",
        "Legal Counsel & Compliance",
        "SIDF-ready documentation",
      ],
    },
    intro: {
      kicker: "Parent advisory firm",
      title: "A practical partner for doing business in Saudi Arabia.",
      copy:
        "Burooj is a Jeddah-based management and legal consulting firm for companies that need clear advice, credible documentation, and local coordination in Saudi Arabia. The firm connects strategy with the practical work behind licensing, financing, partnerships, and legal representation through trusted partners.",
    },
    servicesHeading: {
      kicker: "Services",
      title: "Advisory built around decisions, submissions, and execution.",
      copy:
        "Burooj supports clients before, during, and after market entry: clarifying the opportunity, preparing investor and lender-ready materials, and coordinating the local steps needed to move forward.",
    },
    services: [
      {
        title: "Management & Legal Advisory",
        text:
          "Practical advisory for local and international companies on market entry, operating models, governance, commercial arrangements, and regulatory coordination.",
        items: [
          "Entity and operating structure",
          "Governance and commercial arrangements",
          "Regulatory coordination roadmap",
        ],
      },
      {
        title: "Feasibility Studies & SIDF Packages",
        text:
          "Feasibility studies, market analysis, financial models, and submission-ready documentation for Saudi Industrial Development Fund applications.",
        items: [
          "Market and demand assessment",
          "Financial model and assumptions",
          "SIDF submission documentation",
        ],
      },
      {
        title: "Foreign Investor Soft-Landing",
        text:
          "Guided entry into Saudi Arabia, including licensing coordination, local introductions, banking readiness, partner search, and early operating setup.",
        items: [
          "Entry pathway and licensing sequence",
          "Banking and administrative readiness",
          "Local partner and stakeholder access",
        ],
      },
      {
        title: "Legal Representation Through Partners",
        text:
          "When formal legal representation is required, Burooj coordinates licensed legal services through Muhammad Gamal Rushdi Law Firm.",
        items: [
          "Representation pathway coordination",
          "Legal document and case handoff",
          "Licensed Saudi law firm support",
        ],
      },
    ],
    engagementHeading: {
      kicker: "Engagement focus",
      title: "Clear advisory for the parties around the decision.",
      copy:
        "Burooj is positioned to support the business owner, the foreign investor, the lender, and the local partner with documentation and coordination that can be acted on.",
    },
    engagementTypes: [
      {
        label: "For international investors",
        text:
          "Understand the Saudi opportunity, choose the right entry path, and identify the local steps needed before committing capital or resources.",
      },
      {
        label: "For Saudi companies",
        text:
          "Prepare credible expansion, financing, and partnership documentation for growth projects, industrial investments, and strategic initiatives.",
      },
      {
        label: "For lenders and stakeholders",
        text:
          "Present feasibility, legal coordination, and operating assumptions in a disciplined format that supports review, discussion, and decision-making.",
      },
    ],
    approach: {
      kicker: "Approach",
      title: "Structured enough for lenders and regulators. Practical enough for founders and operators.",
      process: [
        "Define the business objective and Saudi market pathway",
        "Map licensing, legal, financing, and operating requirements",
        "Prepare the feasibility, financial, and commercial documentation",
        "Coordinate submissions, partners, and on-the-ground execution support",
      ],
    },
    capabilities: {
      kicker: "Capabilities",
      title: "Where Burooj is most useful.",
      copy:
        "The firm is positioned for companies that are ready to make a real decision about Saudi Arabia, whether they are assessing feasibility, preparing for SIDF, seeking a local partner, or establishing a first operating presence.",
      items: [
        "Saudi market-entry strategy",
        "SIDF-ready feasibility studies",
        "MISA and sector licensing coordination",
        "Commercial and legal document coordination",
        "Local partner and stakeholder introductions",
        "Specialized platform development",
      ],
    },
    legal: {
      kicker: "Legal representation",
      title: "Partner law firm coordination where licensed representation is required.",
      copyBefore:
        "Burooj provides management consulting and legal advisory coordination. Formal legal representation and licensed legal services are provided through our partnering Saudi law firm,",
      partnerFirm: "Muhammad Gamal Rushdi Law Firm",
      panelText: "Partner Saudi law firm for formal legal representation and licensed legal services.",
    },
    platform: {
      kicker: "Platforms",
      title: "Burooj platforms and specialized initiatives",
      copy:
        "Burooj develops focused platforms under its advisory umbrella so each audience has a clear entry point, while serious requests are still handled through a disciplined professional review path.",
      items: [
        {
          title: "iinvestinsaudi.com",
          type: "Investment opportunities platform",
          copy:
            "A Burooj platform focused on making Saudi investment opportunities easier to understand, evaluate, and move into advisory review when an investor is ready to act.",
          link: "https://iinvestinsaudi.com/",
          linkLabel: "Visit iInvest in Saudi",
          sectors: [
            "Industrial investment",
            "Manufacturing",
            "Petrochemicals and downstream",
            "Professional services",
            "Real estate and infrastructure",
            "International expansion",
          ],
        },
        {
          title: "Burooj Health Law",
          type: "Healthcare legal services platform",
          copy:
            "A specialized Burooj platform for healthcare legal services in Saudi Arabia, serving patients, practitioners, medical facilities, insurance claims, and expert medical review pathways.",
          link: "https://buroojhealthlaw.com/",
          linkLabel: "Visit Burooj Health Law",
          sectors: [
            "Patients and families",
            "Healthcare practitioners",
            "Hospitals and clinics",
            "Medical insurance claims",
            "Medical expert review",
            "Partner law firm representation",
          ],
        },
      ],
    },
    review: {
      kicker: "Request journey",
      title: "One professional intake desk for advisory, feasibility, SIDF, soft-landing, and legal coordination.",
      copy:
        "iinvestinsaudi.com remains the opportunity showcase, while Burooj Health Law serves specialized healthcare legal matters. Serious inquiries from both platforms are routed into the appropriate Burooj review path so every request can be documented and moved through a clear decision process.",
      steps: [
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
      ],
    },
    request: {
      kicker: "Start a request",
      title: "Tell us what you need reviewed.",
      copy:
        "Choose the pathway that best fits your request. Burooj will use the information to route the matter for advisory review, legal partner coordination, feasibility/SIDF assessment, or soft-landing scoping.",
      pathwaysAria: "Request pathways",
      submitIdle: "Submit request for review",
      submitBusy: "Submitting request...",
      successWithRef: (reference: string) =>
        `Your request was submitted successfully. Reference: ${reference}. Burooj will review it and respond with the next step.`,
      success: "Your request was submitted successfully. Burooj will review it and respond with the next step.",
      fallback:
        "Your email client has been opened with the request details. Secure attachment upload and status tracking will activate when the backend is connected.",
      error: "The request could not be submitted. Please try again or email us directly.",
      pathways: [
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
          value: "health_law_inquiry",
          label: "Burooj Health Law request",
          summary: "Healthcare legal services, medical insurance claims, facility matters, or medical expert review coordination.",
          checklist: ["Matter type", "Medical documents", "Urgency and parties"],
        },
        {
          value: "general_market_entry",
          label: "General Saudi market entry",
          summary: "Early guidance for companies exploring whether and how to enter the Saudi market.",
          checklist: ["Sector", "Target activity", "Questions to resolve"],
        },
      ] satisfies Array<{
        value: RequestPathway;
        label: string;
        summary: string;
        checklist: string[];
      }>,
    },
    form: {
      applicantType: "Applicant type",
      selectType: "Select type",
      applicantOptions: [
        "International investor",
        "Saudi company",
        "Foreign company",
        "Individual investor",
        "Lender or stakeholder",
        "Legal client",
        "Healthcare client or facility",
      ],
      fullName: "Full name *",
      workEmail: "Work email *",
      phone: "Phone / WhatsApp",
      company: "Company",
      country: "Country",
      preferredLanguage: "Preferred language",
      languageOptions: ["English", "Arabic", "French", "German", "Chinese", "Japanese", "Korean", "Hindi", "Turkish", "Indonesian"],
      preferredContact: "Preferred contact",
      contactOptions: ["Email", "WhatsApp", "Phone call"],
      sourceSite: "Source site",
      sourcePlaceholder: "Direct, iinvestinsaudi, or Burooj Health Law",
      opportunityReference: "Opportunity reference",
      opportunityPlaceholder: "Optional unless sent from iinvestinsaudi",
      requestTitle: "Request title",
      requestTitlePlaceholder: "Example: SIDF feasibility support for industrial project",
      sector: "Sector",
      sectorPlaceholder: "Manufacturing, real estate, services...",
      investmentSize: "Investment size / budget",
      selectRange: "Select range",
      investmentOptions: ["Under SAR 1M", "SAR 1M - 10M", "SAR 10M - 50M", "SAR 50M - 200M", "SAR 200M+", "Not decided yet"],
      timeline: "Timeline",
      selectTimeline: "Select timeline",
      timelineOptions: ["Urgent", "Within 30 days", "1 - 3 months", "3 - 6 months", "Exploratory"],
      projectType: "Project type",
      projectTypePlaceholder: "Industrial, logistics, tourism, platform...",
      studyStatus: "Current study/model status",
      selectStatus: "Select status",
      studyOptions: ["No study yet", "Initial concept only", "Draft feasibility available", "Financial model available", "Ready for SIDF preparation"],
      misaStatus: "Saudi setup / MISA status",
      misaOptions: ["Not started", "Exploring MISA license", "MISA license in progress", "Entity already established", "Need banking/admin/local partner support"],
      legalMatterType: "Legal matter type",
      legalMatterPlaceholder: "Contract, dispute, licensing, corporate...",
      counterparty: "Counterparty / authority",
      counterpartyPlaceholder: "For conflict/scope screening",
      requestDescription: "Request description *",
      descriptionPlaceholder:
        "Describe the project, legal matter, feasibility need, SIDF requirement, or soft-landing support you need.",
      documents: "Supporting documents",
      documentsHelp: "PDF, DOCX, XLSX, PPTX, CSV, JPG, PNG. Up to 10 files, 25 MB each.",
      privacy:
        "I confirm that the submitted information may be reviewed by Burooj for advisory triage and, where relevant, shared with the partner law firm for legal scope review.",
      legalConsent:
        "I understand that formal legal representation and licensed legal services are provided through Muhammad Gamal Rushdi Law Firm after conflict and engagement checks.",
    },
    errors: {
      fullName: "Please enter your full name.",
      email: "Please enter a valid work email.",
      message: "Please describe the request.",
      privacyAccepted: "Please confirm the review and privacy notice.",
      partnerConsent: "Please acknowledge that representation is handled through the partner law firm.",
      opportunityId: "Please include the opportunity reference.",
      maxFiles: `Please upload no more than ${MAX_FILES} files.`,
      maxFileSize: "Each file must be 25 MB or smaller.",
      maxTotalSize: "Total attachment size must be 100 MB or smaller.",
      fileTypes: "Accepted files: PDF, DOCX, XLSX, PPTX, CSV, JPG, and PNG.",
    },
    contact: {
      kicker: "Contact",
      title: "Discuss your Saudi market entry, feasibility study, or advisory need.",
      copy:
        "Share where you are in the process, and Burooj will help define the next practical step with the right mix of advisory, documentation, and partner coordination.",
      whatsapp: "WhatsApp",
    },
    footer: {
      credit: "Hero photo: Jeddah, Saudi Arabia by shahad hassan on Unsplash.",
    },
  },
  ar: {
    meta: {
      lang: "ar",
      dir: "rtl",
      toggleLabel: "English",
      navLabel: "التنقل الرئيسي",
      brandAria: "الصفحة الرئيسية لبروج للاستشارات",
    },
    brand: {
      name: "بروج",
      subtitle: "للاستشارات الإدارية والقانونية",
      fullName: "مكتب بروج للاستشارات الإدارية والقانونية",
      location: "جدة، المملكة العربية السعودية",
    },
    nav: {
      services: "الخدمات",
      approach: "المنهجية",
      request: "تقديم طلب",
      platforms: "المنصات",
      contact: "التواصل",
      cta: "I INVEST IN SAUDI",
      ctaHref: "https://iinvestinsaudi.com/",
    },
    hero: {
      kicker: "مكتب استشاري سعودي مقره جدة",
      title: "بروج للاستشارات",
      subtitle: "استراتيجية المشاريع، دخول السوق والاستشارات القانونية",
      copy:
        "نقدم استراتيجية مشاريع واستشارات قانونية متميزة لمساعدة الشركات الناشئة عالية النمو على جذب رأس المال، وبناء بنية جاهزة للاستثمار، والتوسع مع التزام كامل، مع إرشاد المؤسسين الدوليين عبر دخول استثماري سلس إلى السوق السعودي، وتأسيس الشركة في المملكة، واستيفاء المتطلبات القانونية اللازمة لبناء حضور قوي في المملكة.",
      primary: "I INVEST IN SAUDI",
      primaryHref: "https://iinvestinsaudi.com/",
      secondary: "ابدأ دخولك إلى السوق السعودي",
      tertiary: "احجز استشارة استراتيجية للمشروع",
      proofAria: "أبرز ملامح المكتب",
      proof: [
        "جدة، المملكة العربية السعودية",
        "استشارات قانونية والتزام",
        "توثيق جاهز لمتطلبات الصندوق الصناعي",
      ],
    },
    intro: {
      kicker: "المكتب الاستشاري الرئيسي",
      title: "شريك عملي لممارسة الأعمال والاستثمار في المملكة العربية السعودية.",
      copy:
        "بروج مكتب استشارات إدارية وقانونية مقره جدة، يخدم الشركات التي تحتاج إلى مشورة واضحة، ووثائق مهنية موثوقة، وتنسيق محلي داخل المملكة. يربط المكتب بين الرؤية الاستراتيجية ومتطلبات التنفيذ العملية، بما يشمل التراخيص، والتمويل، والشراكات، والتمثيل القانوني من خلال شركاء مرخصين.",
    },
    servicesHeading: {
      kicker: "الخدمات",
      title: "خدمات استشارية مصممة لدعم القرار، والملفات الرسمية، والتنفيذ.",
      copy:
        "يدعم بروج عملاءه قبل دخول السوق وأثناءه وبعده، من خلال توضيح الفرصة، وإعداد مواد مهنية مناسبة للمستثمرين والممولين، وتنسيق الخطوات المحلية اللازمة للمضي قدما.",
    },
    services: [
      {
        title: "الاستشارات الإدارية والقانونية",
        text:
          "دعم استشاري عملي للشركات المحلية والدولية في دخول السوق، ونماذج التشغيل، والحوكمة، والترتيبات التجارية، والتنسيق مع الجهات ذات العلاقة.",
        items: [
          "هيكلة الكيان ونموذج التشغيل",
          "حوكمة وترتيبات تجارية قابلة للتطبيق",
          "خارطة طريق للتنسيق النظامي والتنظيمي",
        ],
      },
      {
        title: "دراسات الجدوى وملفات صندوق التنمية الصناعية",
        text:
          "إعداد دراسات الجدوى، وتحليل السوق، والنماذج المالية، والوثائق الداعمة بصورة مناسبة لتقديمها ضمن متطلبات صندوق التنمية الصناعية السعودي.",
        items: [
          "تقييم السوق وحجم الطلب",
          "النموذج المالي والافتراضات الرئيسية",
          "ملف تقديم منظم للصندوق الصناعي",
        ],
      },
      {
        title: "خدمات التهيئة للمستثمر الأجنبي",
        text:
          "مساندة المستثمر في بدء أعماله داخل المملكة، بما يشمل تسلسل التراخيص، والربط المحلي، وجاهزية الحسابات البنكية والإجراءات الإدارية، والبحث عن الشركاء.",
        items: [
          "مسار دخول وتسلسل تراخيص واضح",
          "جاهزية مصرفية وإدارية أولية",
          "وصول منظم إلى شركاء وأطراف محلية",
        ],
      },
      {
        title: "التمثيل القانوني عبر شركاء مرخصين",
        text:
          "عند الحاجة إلى تمثيل قانوني رسمي، ينسق بروج الخدمات القانونية المرخصة من خلال مكتب محمد جمال رشدي للمحاماة.",
        items: [
          "تنسيق مسار التمثيل القانوني",
          "تجهيز وتسليم المستندات ذات الصلة",
          "دعم من مكتب محاماة سعودي مرخص",
        ],
      },
    ],
    engagementHeading: {
      kicker: "نطاق التعامل",
      title: "استشارات واضحة للأطراف المعنية بالقرار.",
      copy:
        "صمم بروج خدماته لدعم مالك النشاط، والمستثمر الأجنبي، والممول، والشريك المحلي، من خلال وثائق وتنسيق يمكن الاعتماد عليهما في المراجعة واتخاذ القرار.",
    },
    engagementTypes: [
      {
        label: "للمستثمرين الدوليين",
        text:
          "فهم الفرصة الاستثمارية في المملكة، واختيار مسار الدخول المناسب، وتحديد الخطوات المحلية المطلوبة قبل تخصيص رأس المال أو الموارد.",
      },
      {
        label: "للشركات السعودية",
        text:
          "إعداد وثائق توسع وتمويل وشراكات بمستوى مهني يدعم مشاريع النمو، والاستثمارات الصناعية، والمبادرات الاستراتيجية.",
      },
      {
        label: "للممولين وأصحاب المصلحة",
        text:
          "عرض الجدوى، والتنسيق القانوني، وافتراضات التشغيل في صيغة منظمة تساعد على المراجعة والنقاش واتخاذ القرار.",
      },
    ],
    approach: {
      kicker: "المنهجية",
      title: "منهجية منظمة بما يكفي للممولين والجهات التنظيمية، وعملية بما يكفي للمؤسسين والمشغلين.",
      process: [
        "تحديد الهدف التجاري ومسار الدخول إلى السوق السعودي",
        "حصر المتطلبات الترخيصية والقانونية والتمويلية والتشغيلية",
        "إعداد وثائق الجدوى والنماذج المالية والملفات التجارية",
        "تنسيق التقديمات والشركاء ودعم التنفيذ الميداني",
      ],
    },
    capabilities: {
      kicker: "مجالات الخبرة",
      title: "المجالات التي يضيف فيها بروج أعلى قيمة.",
      copy:
        "يناسب بروج الشركات الجادة في اتخاذ قرار فعلي بشأن السوق السعودي، سواء كانت في مرحلة تقييم الجدوى، أو الاستعداد للتقديم على صندوق التنمية الصناعية، أو البحث عن شريك محلي، أو تأسيس حضور تشغيلي أول.",
      items: [
        "استراتيجية دخول السوق السعودي",
        "دراسات جدوى مناسبة لمتطلبات الصندوق الصناعي",
        "تنسيق تراخيص الاستثمار والقطاعات ذات العلاقة",
        "تنسيق الوثائق التجارية والقانونية",
        "التعريف بالشركاء وأصحاب المصلحة محليا",
        "تطوير منصات متخصصة",
      ],
    },
    legal: {
      kicker: "التمثيل القانوني",
      title: "تنسيق مع مكتب محاماة شريك عند الحاجة إلى تمثيل مرخص.",
      copyBefore:
        "يقدم بروج خدمات الاستشارات الإدارية وتنسيق الاستشارات القانونية. أما التمثيل القانوني الرسمي والخدمات القانونية المرخصة فتقدم من خلال مكتب المحاماة السعودي الشريك،",
      partnerFirm: "مكتب محمد جمال رشدي للمحاماة",
      panelText: "مكتب محاماة سعودي شريك للتمثيل القانوني الرسمي والخدمات القانونية المرخصة.",
    },
    platform: {
      kicker: "المنصات",
      title: "منصات بروج ومبادراتها المتخصصة",
      copy:
        "يطور بروج منصات ومبادرات متخصصة تحت مظلته الاستشارية، بحيث تخدم كل منصة مسارا واضحا لجمهورها، مع بقاء الطلبات الجادة ضمن مسار مراجعة مهني ومنظم.",
      items: [
        {
          title: "iinvestinsaudi.com",
          type: "منصة فرص استثمارية",
          copy:
            "منصة تابعة لبروج تركز على عرض الفرص الاستثمارية في المملكة وتسهيل فهمها وتقييمها، ثم تحويل الاستفسارات الجادة إلى مسار مراجعة استشارية عند جاهزية المستثمر للتحرك.",
          link: "https://iinvestinsaudi.com/",
          linkLabel: "زيارة منصة iInvest in Saudi",
          sectors: [
            "الاستثمار الصناعي",
            "التصنيع",
            "البتروكيماويات والصناعات التحويلية",
            "الخدمات المهنية",
            "العقار والبنية التحتية",
            "التوسع الدولي",
          ],
        },
        {
          title: "بروج للخدمات القانونية الصحية",
          type: "منصة خدمات قانونية صحية",
          copy:
            "منصة متخصصة تابعة لبروج للخدمات القانونية الصحية في المملكة، تخدم المرضى وذويهم، والممارسين الصحيين، والمنشآت الصحية، ومطالبات التأمين الطبي، ومسارات مراجعة الخبراء الطبيين.",
          link: "https://buroojhealthlaw.com/",
          linkLabel: "زيارة بروج للخدمات القانونية الصحية",
          sectors: [
            "المرضى وذووهم",
            "الممارسون الصحيون",
            "المستشفيات والعيادات",
            "مطالبات التأمين الطبي",
            "مراجعة الخبراء الطبيين",
            "التمثيل عبر مكتب المحاماة الشريك",
          ],
        },
      ],
    },
    review: {
      kicker: "رحلة الطلب",
      title: "بوابة استقبال موحدة للاستشارات، والجدوى، والصندوق الصناعي، والتهيئة الاستثمارية، والتنسيق القانوني.",
      copy:
        "تبقى منصة iinvestinsaudi.com واجهة لعرض الفرص الاستثمارية، بينما تمثل بروج للخدمات القانونية الصحية مسارا متخصصا للمسائل القانونية الصحية. وتحول الطلبات الجادة من المنصتين إلى مسار المراجعة المناسب لدى بروج لتوثيقها وتحريكها ضمن إجراء واضح.",
      steps: [
        {
          label: "استلام الطلب",
          text: "يستلم الطلب برقم مرجعي ويوجه إلى مسار المراجعة المناسب.",
        },
        {
          label: "قيد المراجعة",
          text: "يراجع بروج ملاءمة الخدمة، واكتمال المستندات، وجاهزية الجدوى أو ملف الصندوق الصناعي، والنطاق القانوني.",
        },
        {
          label: "قرار أولي",
          text: "يصنف الطلب إلى مقبول، أو بانتظار معلومات إضافية، أو غير ملائم في هذه المرحلة.",
        },
        {
          label: "الخطوة التالية",
          text: "تنتقل الطلبات المقبولة إلى الاستشارة، أو تحديد النطاق، أو التنسيق مع الشريك القانوني، أو إعداد العرض.",
        },
      ],
    },
    request: {
      kicker: "تقديم طلب",
      title: "أخبرنا بما ترغب في مراجعته.",
      copy:
        "اختر المسار الأقرب لطبيعة طلبك. سيستخدم بروج المعلومات لتوجيه الطلب إلى مسار المراجعة الاستشارية، أو التنسيق القانوني، أو تقييم الجدوى والصندوق الصناعي، أو تحديد نطاق خدمات التهيئة للمستثمر.",
      pathwaysAria: "مسارات الطلب",
      submitIdle: "إرسال الطلب للمراجعة",
      submitBusy: "جار إرسال الطلب...",
      successWithRef: (reference: string) =>
        `تم إرسال طلبك بنجاح. الرقم المرجعي: ${reference}. سيقوم بروج بمراجعة الطلب والرد بالخطوة التالية.`,
      success: "تم إرسال طلبك بنجاح. سيقوم بروج بمراجعة الطلب والرد بالخطوة التالية.",
      fallback:
        "تم فتح برنامج البريد لديك متضمنا تفاصيل الطلب. ستفعل خدمة رفع المرفقات ومتابعة الحالة عند اكتمال ربط النظام الخلفي.",
      error: "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة عبر البريد الإلكتروني.",
      pathways: [
        {
          value: "management_consulting",
          label: "استشارات إدارية",
          summary: "استراتيجية، نموذج تشغيل، حوكمة، شراكات، ودعم عملي للتنفيذ.",
          checklist: ["الهدف التجاري", "التحدي الحالي", "الإطار الزمني للقرار"],
        },
        {
          value: "legal_consulting",
          label: "تنسيق استشارات قانونية",
          summary: "تنسيق المشورة القانونية، ومسار مراجعة المستندات، والإحالة إلى مكتب المحاماة الشريك عند الحاجة.",
          checklist: ["نوع المسألة", "الأطراف ذات العلاقة", "المستندات المتوفرة"],
        },
        {
          value: "legal_representation",
          label: "تمثيل قانوني",
          summary: "مسار تمثيل رسمي ينسق من خلال مكتب محمد جمال رشدي للمحاماة.",
          checklist: ["خلفية المسألة", "الأطراف المقابلة", "المواعيد العاجلة"],
        },
        {
          value: "feasibility_study",
          label: "دراسة جدوى",
          summary: "توثيق جدوى سوقية وفنية ومالية وتجارية للمشاريع داخل المملكة.",
          checklist: ["ملخص المشروع", "نطاق الإنفاق الرأسمالي", "الافتراضات المتاحة"],
        },
        {
          value: "sidf_submission",
          label: "تجهيز ملف الصندوق الصناعي",
          summary: "دراسة جدوى ونموذج مالي ووثائق داعمة بصيغة مناسبة لمراجعة صندوق التنمية الصناعية السعودي.",
          checklist: ["قطاع المشروع", "احتياج التمويل", "الدراسة أو النموذج المتوفر"],
        },
        {
          value: "soft_landing",
          label: "تهيئة المستثمر الأجنبي",
          summary: "دعم دخول السوق، والتراخيص، والحسابات البنكية، والشركاء المحليين، وجاهزية التشغيل.",
          checklist: ["دولة المستثمر", "حالة الدخول إلى المملكة", "الجدول الزمني للتأسيس"],
        },
        {
          value: "opportunity_inquiry",
          label: "فرصة عبر iinvestinsaudi",
          summary: "طلب متعلق بفرصة محددة، ويشمل الاستشارة أو الجدوى أو الصندوق الصناعي أو التهيئة الاستثمارية.",
          checklist: ["مرجع الفرصة", "دور المستثمر", "نوع الدعم المطلوب"],
        },
        {
          value: "health_law_inquiry",
          label: "طلب عبر بروج للخدمات القانونية الصحية",
          summary: "خدمات قانونية صحية، أو مطالبات تأمين طبي، أو مسائل منشآت صحية، أو تنسيق مراجعة خبير طبي.",
          checklist: ["نوع المسألة", "المستندات الطبية", "درجة الاستعجال والأطراف"],
        },
        {
          value: "general_market_entry",
          label: "دخول عام للسوق السعودي",
          summary: "إرشاد أولي للشركات التي تدرس إمكانية دخول السوق السعودي وآلية ذلك.",
          checklist: ["القطاع", "النشاط المستهدف", "الأسئلة المطلوب حسمها"],
        },
      ] satisfies Array<{
        value: RequestPathway;
        label: string;
        summary: string;
        checklist: string[];
      }>,
    },
    form: {
      applicantType: "صفة مقدم الطلب",
      selectType: "اختر الصفة",
      applicantOptions: [
        "مستثمر دولي",
        "شركة سعودية",
        "شركة أجنبية",
        "مستثمر فرد",
        "جهة تمويل أو صاحب مصلحة",
        "عميل قانوني",
        "عميل أو منشأة في القطاع الصحي",
      ],
      fullName: "الاسم الكامل *",
      workEmail: "البريد الإلكتروني المهني *",
      phone: "الهاتف / واتساب",
      company: "اسم الشركة",
      country: "الدولة",
      preferredLanguage: "لغة التواصل المفضلة",
      languageOptions: ["الإنجليزية", "العربية", "الفرنسية", "الألمانية", "الصينية", "اليابانية", "الكورية", "الهندية", "التركية", "الإندونيسية"],
      preferredContact: "وسيلة التواصل المفضلة",
      contactOptions: ["البريد الإلكتروني", "واتساب", "اتصال هاتفي"],
      sourceSite: "مصدر الطلب",
      sourcePlaceholder: "مباشر أو iinvestinsaudi أو بروج للخدمات القانونية الصحية",
      opportunityReference: "مرجع الفرصة",
      opportunityPlaceholder: "اختياري إلا إذا كان الطلب محالا من iinvestinsaudi",
      requestTitle: "عنوان الطلب",
      requestTitlePlaceholder: "مثال: دعم دراسة جدوى للصندوق الصناعي لمشروع صناعي",
      sector: "القطاع",
      sectorPlaceholder: "التصنيع، العقار، الخدمات...",
      investmentSize: "حجم الاستثمار / الميزانية",
      selectRange: "اختر النطاق",
      investmentOptions: ["أقل من مليون ريال", "من مليون إلى 10 ملايين ريال", "من 10 إلى 50 مليون ريال", "من 50 إلى 200 مليون ريال", "أكثر من 200 مليون ريال", "لم يحدد بعد"],
      timeline: "الإطار الزمني",
      selectTimeline: "اختر الإطار الزمني",
      timelineOptions: ["عاجل", "خلال 30 يوما", "من شهر إلى 3 أشهر", "من 3 إلى 6 أشهر", "استكشافي"],
      projectType: "نوع المشروع",
      projectTypePlaceholder: "صناعي، لوجستي، سياحي، منصة...",
      studyStatus: "حالة الدراسة أو النموذج المالي",
      selectStatus: "اختر الحالة",
      studyOptions: ["لا توجد دراسة بعد", "فكرة أولية فقط", "توجد مسودة دراسة جدوى", "يوجد نموذج مالي", "جاهز لتجهيز ملف الصندوق الصناعي"],
      misaStatus: "حالة التأسيس / ترخيص الاستثمار",
      misaOptions: ["لم يبدأ بعد", "دراسة الحصول على ترخيص استثماري", "ترخيص الاستثمار قيد الإجراء", "تم تأسيس الكيان", "توجد حاجة لدعم بنكي أو إداري أو شريك محلي"],
      legalMatterType: "نوع المسألة القانونية",
      legalMatterPlaceholder: "عقد، نزاع، ترخيص، شركات...",
      counterparty: "الطرف المقابل / الجهة",
      counterpartyPlaceholder: "لأغراض فحص التعارض وتحديد النطاق",
      requestDescription: "وصف الطلب *",
      descriptionPlaceholder:
        "صف المشروع، أو المسألة القانونية، أو احتياج دراسة الجدوى، أو متطلبات الصندوق الصناعي، أو الدعم المطلوب للتهيئة الاستثمارية.",
      documents: "المستندات الداعمة",
      documentsHelp: "PDF، DOCX، XLSX، PPTX، CSV، JPG، PNG. بحد أقصى 10 ملفات، وحجم 25 ميجابايت لكل ملف.",
      privacy:
        "أقر بأن المعلومات المقدمة يجوز لبروج مراجعتها لغرض فرز الطلب استشاريا، ومشاركتها عند اللزوم مع مكتب المحاماة الشريك لمراجعة النطاق القانوني.",
      legalConsent:
        "أدرك أن التمثيل القانوني الرسمي والخدمات القانونية المرخصة تقدم من خلال مكتب محمد جمال رشدي للمحاماة بعد استكمال فحص التعارض وإجراءات الارتباط.",
    },
    errors: {
      fullName: "يرجى إدخال الاسم الكامل.",
      email: "يرجى إدخال بريد إلكتروني مهني صحيح.",
      message: "يرجى وصف الطلب.",
      privacyAccepted: "يرجى تأكيد إشعار المراجعة والخصوصية.",
      partnerConsent: "يرجى الإقرار بأن التمثيل يتم من خلال مكتب المحاماة الشريك.",
      opportunityId: "يرجى إدخال مرجع الفرصة.",
      maxFiles: `يرجى عدم رفع أكثر من ${MAX_FILES} ملفات.`,
      maxFileSize: "يجب ألا يتجاوز حجم كل ملف 25 ميجابايت.",
      maxTotalSize: "يجب ألا يتجاوز إجمالي حجم المرفقات 100 ميجابايت.",
      fileTypes: "الصيغ المقبولة: PDF و DOCX و XLSX و PPTX و CSV و JPG و PNG.",
    },
    contact: {
      kicker: "التواصل",
      title: "ناقش احتياجك لدخول السوق السعودي أو دراسة الجدوى أو الخدمات الاستشارية.",
      copy:
        "شاركنا المرحلة التي وصلتم إليها، وسيساعد بروج في تحديد الخطوة العملية التالية بالمزيج المناسب من الاستشارة، والتوثيق، وتنسيق الشركاء.",
      whatsapp: "واتساب",
    },
    footer: {
      credit: "صورة الواجهة: جدة، المملكة العربية السعودية، بعدسة shahad hassan على Unsplash.",
    },
  },
} as const;

const DEFAULT_LANGUAGE: Language = "en";

const getStoredLanguage = (): Language => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  return window.localStorage.getItem("burooj-language") === "ar" ? "ar" : DEFAULT_LANGUAGE;
};

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
  healthcare: "health_law_inquiry",
  healthlaw: "health_law_inquiry",
  "health-law": "health_law_inquiry",
  medical: "health_law_inquiry",
  market_entry: "general_market_entry",
};

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
const requestEndpoint = (import.meta.env.VITE_BUROOJ_REQUEST_ENDPOINT as string | undefined) ?? "/api/intake";

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

function App() {
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());
  const [request, setRequest] = useState<RequestFormState>(() => getInitialRequestState());
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "sent" | "fallback" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [shouldFocusRequest] = useState(() => {
    const initial = getInitialRequestState();
    return Boolean(initial.sourceSite || initial.opportunityId);
  });

  const t = content[language];
  const isArabic = language === "ar";
  const optionValues = content.en.form;

  const activePathway = useMemo(
    () => t.request.pathways.find((pathway) => pathway.value === request.servicePath) ?? t.request.pathways[0],
    [request.servicePath, t.request.pathways],
  );

  useEffect(() => {
    document.documentElement.lang = t.meta.lang;
    document.documentElement.dir = t.meta.dir;
    window.localStorage.setItem("burooj-language", language);
  }, [language, t.meta.dir, t.meta.lang]);

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
    if (!request.fullName.trim()) next.fullName = t.errors.fullName;
    if (!EMAIL_RE.test(request.email.trim())) next.email = t.errors.email;
    if (!request.message.trim()) next.message = t.errors.message;
    if (!request.privacyAccepted) next.privacyAccepted = t.errors.privacyAccepted;
    if (request.servicePath === "legal_representation" && !request.partnerConsent) {
      next.partnerConsent = t.errors.partnerConsent;
    }
    if (request.servicePath === "opportunity_inquiry" && !request.opportunityId.trim()) {
      next.opportunityId = t.errors.opportunityId;
    }
    return next;
  };

  const onAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const totalSize = files.reduce((total, file) => total + file.size, 0);
    let attachmentError = "";

    if (files.length > MAX_FILES) {
      attachmentError = t.errors.maxFiles;
    } else if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      attachmentError = t.errors.maxFileSize;
    } else if (totalSize > MAX_TOTAL_FILE_SIZE) {
      attachmentError = t.errors.maxTotalSize;
    } else if (
      files.some((file) => file.type && !ALLOWED_FILE_TYPES.includes(file.type as (typeof ALLOWED_FILE_TYPES)[number]))
    ) {
      attachmentError = t.errors.fileTypes;
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
      setSubmitMessage(t.request.fallback);
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

      const result = (await response.json().catch(() => ({}))) as { reference?: string; error?: string };
      if (!response.ok) throw new Error(result.error || "Request submission failed");

      setSubmitState("sent");
      setSubmitMessage(
        result.reference
          ? t.request.successWithRef(result.reference)
          : t.request.success,
      );
      setRequest(getInitialRequestState());
      setAttachments([]);
      setErrors({});
    } catch (error) {
      console.error("Burooj request submission failed:", error);
      setSubmitState("error");
      setSubmitMessage(t.request.error);
    }
  };

  return (
    <main className={isArabic ? "rtl" : "ltr"} lang={t.meta.lang} dir={t.meta.dir}>
      <header className="site-header">
        <a href="#top" className="brand" aria-label={t.meta.brandAria}>
          <img className="brand-logo" src="/assets/burooj-logo-inverted.png" alt="" />
        </a>
        <nav className="nav-links" aria-label={t.meta.navLabel}>
          <a href="#services">{t.nav.services}</a>
          <a href="#approach">{t.nav.approach}</a>
          <a href="#request">{t.nav.request}</a>
          <a href="#platforms">{t.nav.platforms}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>
        <div className="header-tools">
          <button
            className="language-toggle"
            type="button"
            onClick={() => setLanguage((current) => (current === "en" ? "ar" : "en"))}
          >
            <Languages size={16} aria-hidden="true" />
            {t.meta.toggleLabel}
          </button>
          <a className="header-action" href={t.nav.ctaHref}>
            {t.nav.cta}
          </a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">{t.hero.kicker}</p>
          <h1>{t.hero.title}</h1>
          <p className="hero-subtitle">{t.hero.subtitle}</p>
          <p className="hero-copy">{t.hero.copy}</p>
          <div className="hero-actions">
            <a className="primary-button" href={t.hero.primaryHref}>
              {t.hero.primary}
            </a>
            <a className="secondary-button" href="#request">
              {t.hero.secondary}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="secondary-button" href="#request">
              {t.hero.tertiary}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="hero-proof" aria-label={t.hero.proofAria}>
          <span>
            <MapPin size={18} aria-hidden="true" />
            {t.hero.proof[0]}
          </span>
          <span>
            <ShieldCheck size={18} aria-hidden="true" />
            {t.hero.proof[1]}
          </span>
          <span>
            <Landmark size={18} aria-hidden="true" />
            {t.hero.proof[2]}
          </span>
        </div>
      </section>

      <section className="intro-section">
        <div className="intro-grid">
          <div>
            <p className="section-kicker">{t.intro.kicker}</p>
            <h2>{t.intro.title}</h2>
          </div>
          <p>{t.intro.copy}</p>
        </div>
      </section>

      <section className="section" id="services">
        <div className="section-heading">
          <p className="section-kicker">{t.servicesHeading.kicker}</p>
          <h2>{t.servicesHeading.title}</h2>
          <p>{t.servicesHeading.copy}</p>
        </div>
        <div className="service-grid">
          {t.services.map((service, index) => {
            const Icon = serviceIcons[index];
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
          <p className="section-kicker">{t.engagementHeading.kicker}</p>
          <h2>{t.engagementHeading.title}</h2>
          <p>{t.engagementHeading.copy}</p>
        </div>
        <div className="engagement-grid">
          {t.engagementTypes.map((item) => (
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
            <p className="section-kicker">{t.approach.kicker}</p>
            <h2>{t.approach.title}</h2>
          </div>
          <div className="process-list">
            {t.approach.process.map((item, index) => (
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
          <p className="section-kicker">{t.capabilities.kicker}</p>
          <h2>{t.capabilities.title}</h2>
          <p>{t.capabilities.copy}</p>
        </div>
        <div className="check-grid">
          {t.capabilities.items.map((item) => (
            <span key={item}>
              <Check size={17} aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="section legal-section">
        <div className="legal-copy">
          <p className="section-kicker">{t.legal.kicker}</p>
          <h2>{t.legal.title}</h2>
          <p>
            {t.legal.copyBefore} <strong>{t.legal.partnerFirm}</strong>.
          </p>
        </div>
        <div className="legal-panel">
          <BadgeCheck size={28} aria-hidden="true" />
          <h3>{t.legal.partnerFirm}</h3>
          <p>{t.legal.panelText}</p>
        </div>
      </section>

      <section className="section platform-section" id="platforms">
        <div className="platform-copy">
          <p className="section-kicker">{t.platform.kicker}</p>
          <h2>{t.platform.title}</h2>
          <p>{t.platform.copy}</p>
        </div>
        <div className="platform-list">
          {t.platform.items.map((platform) => (
            <article className="platform-card" key={platform.title}>
              <p className="platform-type">{platform.type}</p>
              <h3>{platform.title}</h3>
              <p>{platform.copy}</p>
              <div className="sector-list platform-tags">
                {platform.sectors.map((sector) => (
                  <span key={sector}>
                    <Building2 size={16} aria-hidden="true" />
                    {sector}
                  </span>
                ))}
              </div>
              <a className="text-link" href={platform.link} target="_blank" rel="noreferrer">
                {platform.linkLabel}
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section review-section">
        <div className="section-heading">
          <p className="section-kicker">{t.review.kicker}</p>
          <h2>{t.review.title}</h2>
          <p>{t.review.copy}</p>
        </div>
        <div className="review-steps">
          {t.review.steps.map((step, index) => (
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
            <p className="section-kicker">{t.request.kicker}</p>
            <h2>{t.request.title}</h2>
            <p>{t.request.copy}</p>
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
            <div className="pathway-grid" aria-label={t.request.pathwaysAria}>
              {t.request.pathways.map((pathway) => (
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
                {t.form.applicantType}
                <select
                  value={request.applicantType}
                  onChange={(event) => setField("applicantType", event.target.value)}
                >
                  <option value="">{t.form.selectType}</option>
                  {t.form.applicantOptions.map((option, index) => (
                    <option key={optionValues.applicantOptions[index]} value={optionValues.applicantOptions[index]}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t.form.fullName}
                <input
                  value={request.fullName}
                  onChange={(event) => setField("fullName", event.target.value)}
                  className={errors.fullName ? "invalid" : ""}
                  autoComplete="name"
                />
                {errors.fullName && <span className="form-error">{errors.fullName}</span>}
              </label>
              <label>
                {t.form.workEmail}
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
                {t.form.phone}
                <input
                  value={request.phone}
                  onChange={(event) => setField("phone", event.target.value)}
                  autoComplete="tel"
                />
              </label>
              <label>
                {t.form.company}
                <input
                  value={request.company}
                  onChange={(event) => setField("company", event.target.value)}
                  autoComplete="organization"
                />
              </label>
              <label>
                {t.form.country}
                <input
                  value={request.country}
                  onChange={(event) => setField("country", event.target.value)}
                  autoComplete="country-name"
                />
              </label>
              <label>
                {t.form.preferredLanguage}
                <select
                  value={request.preferredLanguage}
                  onChange={(event) => setField("preferredLanguage", event.target.value)}
                >
                  {t.form.languageOptions.map((option, index) => (
                    <option key={optionValues.languageOptions[index]} value={optionValues.languageOptions[index]}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t.form.preferredContact}
                <select
                  value={request.preferredContact}
                  onChange={(event) => setField("preferredContact", event.target.value)}
                >
                  {t.form.contactOptions.map((option, index) => (
                    <option key={optionValues.contactOptions[index]} value={optionValues.contactOptions[index]}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t.form.sourceSite}
                <input
                  value={request.sourceSite}
                  onChange={(event) => setField("sourceSite", event.target.value)}
                  placeholder={t.form.sourcePlaceholder}
                />
              </label>
              <label>
                {t.form.opportunityReference}
                <input
                  value={request.opportunityId}
                  onChange={(event) => setField("opportunityId", event.target.value)}
                  className={errors.opportunityId ? "invalid" : ""}
                  placeholder={t.form.opportunityPlaceholder}
                />
                {errors.opportunityId && <span className="form-error">{errors.opportunityId}</span>}
              </label>
              <label className="full">
                {t.form.requestTitle}
                <input
                  value={request.requestTitle}
                  onChange={(event) => setField("requestTitle", event.target.value)}
                  placeholder={t.form.requestTitlePlaceholder}
                />
              </label>
              <label>
                {t.form.sector}
                <input
                  value={request.sector}
                  onChange={(event) => setField("sector", event.target.value)}
                  placeholder={t.form.sectorPlaceholder}
                />
              </label>
              <label>
                {t.form.investmentSize}
                <select
                  value={request.investmentSize}
                  onChange={(event) => setField("investmentSize", event.target.value)}
                >
                  <option value="">{t.form.selectRange}</option>
                  {t.form.investmentOptions.map((option, index) => (
                    <option key={optionValues.investmentOptions[index]} value={optionValues.investmentOptions[index]}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t.form.timeline}
                <select value={request.timeline} onChange={(event) => setField("timeline", event.target.value)}>
                  <option value="">{t.form.selectTimeline}</option>
                  {t.form.timelineOptions.map((option, index) => (
                    <option key={optionValues.timelineOptions[index]} value={optionValues.timelineOptions[index]}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              {(request.servicePath === "feasibility_study" ||
                request.servicePath === "sidf_submission" ||
                request.servicePath === "opportunity_inquiry") && (
                <>
                  <label>
                    {t.form.projectType}
                    <input
                      value={request.projectType}
                      onChange={(event) => setField("projectType", event.target.value)}
                      placeholder={t.form.projectTypePlaceholder}
                    />
                  </label>
                  <label>
                    {t.form.studyStatus}
                    <select
                      value={request.currentStudyStatus}
                      onChange={(event) => setField("currentStudyStatus", event.target.value)}
                    >
                      <option value="">{t.form.selectStatus}</option>
                      {t.form.studyOptions.map((option, index) => (
                        <option key={optionValues.studyOptions[index]} value={optionValues.studyOptions[index]}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              )}

              {request.servicePath === "soft_landing" && (
                <label className="full">
                  {t.form.misaStatus}
                  <select value={request.misaStatus} onChange={(event) => setField("misaStatus", event.target.value)}>
                    <option value="">{t.form.selectStatus}</option>
                    {t.form.misaOptions.map((option, index) => (
                      <option key={optionValues.misaOptions[index]} value={optionValues.misaOptions[index]}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {(request.servicePath === "legal_consulting" || request.servicePath === "legal_representation") && (
                <>
                  <label>
                    {t.form.legalMatterType}
                    <input
                      value={request.legalMatterType}
                      onChange={(event) => setField("legalMatterType", event.target.value)}
                      placeholder={t.form.legalMatterPlaceholder}
                    />
                  </label>
                  <label>
                    {t.form.counterparty}
                    <input
                      value={request.counterparty}
                      onChange={(event) => setField("counterparty", event.target.value)}
                      placeholder={t.form.counterpartyPlaceholder}
                    />
                  </label>
                </>
              )}

              <label className="full">
                {t.form.requestDescription}
                <textarea
                  value={request.message}
                  onChange={(event) => setField("message", event.target.value)}
                  className={errors.message ? "invalid" : ""}
                  placeholder={t.form.descriptionPlaceholder}
                />
                {errors.message && <span className="form-error">{errors.message}</span>}
              </label>

              <label className="full file-field">
                {t.form.documents}
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.xlsx,.pptx,.csv,.jpg,.jpeg,.png"
                  onChange={onAttachmentChange}
                />
                <span>{t.form.documentsHelp}</span>
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
                  {t.form.privacy}
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
                      {t.form.legalConsent}
                    </span>
                  </label>
                  {errors.partnerConsent && <span className="form-error full">{errors.partnerConsent}</span>}
                </>
              )}
            </div>

            <button className="request-submit" type="submit" disabled={submitState === "submitting"}>
              {submitState === "submitting" ? t.request.submitBusy : t.request.submitIdle}
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
          <p className="section-kicker">{t.contact.kicker}</p>
          <h2>{t.contact.title}</h2>
          <p>{t.contact.copy}</p>
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
            {t.contact.whatsapp}
          </a>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <img className="footer-logo" src="/assets/burooj-logo-transparent.png" alt="" />
          <strong>{t.brand.fullName}</strong>
          <p>{t.brand.location}</p>
        </div>
        <p>{t.footer.credit}</p>
      </footer>
    </main>
  );
}

export default App;
