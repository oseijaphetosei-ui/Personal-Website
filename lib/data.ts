export const siteConfig = {
  name: "Osei Japhet Acquah",
  shortName: "Osei",
  initials: "OJA",
  title: "Full-Stack Engineer & AI Developer",
  tagline: "Building intelligent products that matter.",
  description:
    "CS & Data Science student at Pomona College. I build AI-powered products across web, mobile, and data — driven by a passion for real-world impact.",
  email: "oseijaphetosei@gmail.com",
  phone: "+1 (840) 205-7727",
  location: "Claremont, California",
  availableFor: "Summer 2027",
  social: {
    github: "https://github.com/oseijaphetosei-ui",
    linkedin: "https://www.linkedin.com/in/japhetacquh795/",
  },
  resume: "/Osei_Acquah_Resume.docx",
};

export const roles = [
  "Full-Stack Engineer",
  "AI Developer",
  "Data Scientist",
  "Builder",
];

export const education = {
  school: "Pomona College",
  location: "Claremont, California, USA",
  degree: "B.S. in Computer Science / Data Science & Mathematics",
  expected: "May 2028",
  coursework: [
    "Foundations of Data Science",
    "Data Structures & Algorithms",
    "OOP",
    "Calc III",
    "Computer Systems",
  ],
};

export const aboutStats = [
  { value: "3", label: "Products Shipped" },
  { value: "35+", label: "Students Mentored" },
  { value: "1K+", label: "Events/sec Processed" },
  { value: "93%", label: "College Admission Rate" },
];

export const experiences = [
  {
    id: "aass",
    company: "Asante Automation & Security",
    companyShort: "AASS",
    role: "Front-End Engineer & AI Developer",
    period: "March 2026 – Present",
    type: "work" as const,
    award: null,
    bullets: [
      "Built AI-powered front-end systems for smart security/IoT, integrating Edge AI to reduce false alarms by ~40%.",
      "Scaled real-time interfaces to support 100+ devices, improving latency by ~15%.",
      "Engineered event-driven pipelines processing 1K+ events/sec across distributed automation systems.",
    ],
    stack: ["React", "TypeScript", "Python", "FastAPI", "Edge AI"],
  },
  {
    id: "pathsense-hackathon",
    company: "Gemini Glitch AI Hackathon",
    companyShort: "PathSense",
    role: "Team Lead & Full-Stack Developer",
    period: "March 2026 · UCLA, Los Angeles, CA",
    type: "hackathon" as const,
    award: "Best Use of Live API",
    bullets: [
      "Led a team of 4 to design and ship PathSense, an AI-powered accessible navigation web app within a hackathon sprint.",
      "Implemented real-time crowd-sourced accessibility reporting via Firebase Firestore with live GPS turn-by-turn navigation.",
      "Integrated Gemini Vision camera guidance delivering real-time environmental descriptions for mobility-impaired users.",
    ],
    stack: [
      "React",
      "TypeScript",
      "Gemini 2.5 Flash",
      "Gemini Vision",
      "Google Maps API",
      "Firebase",
    ],
  },
  {
    id: "datafest",
    company: "UCLA DataFest 2025",
    companyShort: "DataFest",
    role: "Data Analyst — Savills Dataset",
    period: "April 2025",
    type: "competition" as const,
    award: null,
    bullets: [
      "Architected a modular data pipeline to clean and preprocess 1M+ leasing records, cutting preparation time by 35%.",
      "Designed and optimized SQL queries enabling interactive dashboards that visualized post-COVID commercial leasing trends.",
      "Led version control and collaborative Git workflows, delivering a working solution within the 48-hour window.",
    ],
    stack: ["Python", "SQL", "Pandas", "Git", "Data Visualization"],
  },
  {
    id: "pomona-its",
    company: "Pomona College — ITS",
    companyShort: "Pomona ITS",
    role: "Student Service Desk Consultant",
    period: "October 2024 – Present",
    type: "work" as const,
    award: null,
    bullets: [
      "Triaged and resolved software, hardware, and network issues for students and faculty across campus.",
      "Authored technical setup guides that reduced user-reported support tickets by 40%.",
      "Standardized support workflows to improve security practices and onboarding efficiency for new users.",
    ],
    stack: ["Technical Support", "Documentation", "Security"],
  },
];

export const projects = [
  {
    id: "pathsense",
    name: "PathSense",
    tagline: "AI accessibility navigation · Best Use of Live API",
    description:
      "An AI-powered accessible navigation web app built during the Gemini Glitch Hackathon. Helped mobility-impaired users navigate with real-time crowd-sourced barrier reporting, live GPS navigation, and Gemini Vision camera guidance for real-time environmental descriptions.",
    stack: [
      "React",
      "TypeScript",
      "Python",
      "Gemini 2.5 Flash",
      "Gemini Vision",
      "Gemini Live API",
      "Google Maps API",
      "Firebase Firestore",
    ],
    links: {
      live: "https://accessible-path.vercel.app/",
      github: "https://github.com/oseijaphetosei-ui/PathSense-Navigation.git",
    },
    award: "Best Use of Live API — Gemini Glitch Hackathon",
    accent: "emerald" as const,
    featured: true,
    image: "/pathsense-preview.jpeg" as string | null,
    demo: "/pathsense-demo.mp4" as string | null,
  },
  {
    id: "container-optimizer",
    name: "Container Design Optimizer",
    tagline: "Web-based optimization app · 100% test coverage",
    description:
      "A web-based optimization application for material and packaging design companies to minimize resource waste. Built with a modular Python codebase using OOP principles, a comprehensive test suite achieving 100% coverage, and a clean visualization-driven Streamlit interface.",
    stack: ["Python", "NumPy", "SciPy", "pytest", "Streamlit", "OOP"],
    links: {
      live: null as string | null,
      github: null as string | null,
    },
    award: null,
    accent: "indigo" as const,
    featured: true,
    image: null as string | null,
    demo: null as string | null,
  },
  {
    id: "scripture-ai",
    name: "Scripture AI",
    tagline: "Talk to Scripture · AI-powered Bible study companion",
    description:
      "A mobile app combining Bible reading, devotionals, notes, and AI-powered conversations in one platform. The signature \"Talk to Scripture\" feature lets users ask questions, explore passages, and gain deeper insights — making daily Bible study more interactive and meaningful.",
    stack: ["React Native", "TypeScript", "AI/ML", "Firebase"],
    links: {
      live: null as string | null,
      github: null as string | null,
    },
    award: null,
    accent: "emerald" as const,
    featured: true,
    image: null as string | null,
    demo: null as string | null,
  },
];

type CapabilityTech = {
  name: string;
  usedIn: string[];
};

export type Capability = {
  id: string;
  title: string;
  description: string;
  accent: "emerald" | "indigo";
  tech: CapabilityTech[];
};

export const capabilities: Capability[] = [
  {
    id: "ai",
    title: "Artificial Intelligence",
    description:
      "Building intelligent assistants and real-time LLM experiences that feel considered, not gimmicky.",
    accent: "emerald",
    tech: [
      { name: "Gemini Live API", usedIn: ["PathSense — real-time camera guidance for navigation"] },
      { name: "Edge AI", usedIn: ["AASS — 1K+ events/sec, 40% fewer false positives"] },
      { name: "LangChain", usedIn: ["Scripture AI — conversational Bible study"] },
      { name: "Prompt Engineering", usedIn: ["PathSense", "Scripture AI"] },
      { name: "Python", usedIn: ["AASS", "PathSense", "UCLA DataFest"] },
    ],
  },
  {
    id: "fullstack",
    title: "Full-Stack Engineering",
    description:
      "Building scalable web applications, APIs, and real-time systems end to end — not just the parts that are fun.",
    accent: "indigo",
    tech: [
      { name: "React", usedIn: ["PathSense", "AASS security dashboards"] },
      { name: "TypeScript", usedIn: ["PathSense", "AASS", "This portfolio"] },
      { name: "FastAPI", usedIn: ["AASS — event-driven pipelines at 1K+ events/sec"] },
      { name: "Firebase", usedIn: ["PathSense — crowd-sourced accessibility data", "Scripture AI"] },
      { name: "Next.js", usedIn: ["This portfolio — japhetsweb.dev"] },
    ],
  },
  {
    id: "mobile",
    title: "Mobile Development",
    description:
      "Designing polished, native-feeling mobile experiences people actually want to open every day.",
    accent: "emerald",
    tech: [
      { name: "React Native", usedIn: ["Scripture AI — iOS & Android"] },
      { name: "Expo", usedIn: ["Scripture AI"] },
      { name: "Mobile UI/UX", usedIn: ["Scripture AI — 'Talk to Scripture' interaction design"] },
      { name: "Firebase", usedIn: ["Scripture AI — auth & sync"] },
    ],
  },
  {
    id: "data",
    title: "Data Science & Analytics",
    description:
      "Turning raw, messy data into insight — pipelines, visualization, and decisions people can act on.",
    accent: "indigo",
    tech: [
      { name: "Pandas & SQL", usedIn: ["UCLA DataFest — 1M+ leasing records, 35% faster prep"] },
      { name: "NumPy / SciPy", usedIn: ["Container Design Optimizer"] },
      { name: "Streamlit", usedIn: ["Container Design Optimizer — visualization-driven UI"] },
      { name: "pytest", usedIn: ["Container Design Optimizer — 100% test coverage"] },
      { name: "Data Visualization", usedIn: ["UCLA DataFest — commercial leasing dashboards"] },
    ],
  },
  {
    id: "product",
    title: "Product & Engineering Craft",
    description:
      "Building products that are intuitive and accessible, not just functional — the details are the job.",
    accent: "emerald",
    tech: [
      { name: "Accessibility", usedIn: ["PathSense — built for mobility-impaired users"] },
      { name: "Design Systems", usedIn: ["This portfolio — full motion & component system"] },
      { name: "Framer Motion", usedIn: ["This portfolio — every interaction and transition"] },
      { name: "Performance", usedIn: ["AASS — ~15% latency reduction", "Pomona ITS — 40% fewer tickets"] },
    ],
  },
];

export const exploringSkills = [
  "Rust",
  "WebAssembly",
  "Kubernetes",
  "Vector Databases",
  "LLM Fine-tuning",
  "GraphQL",
];

type AIProduct = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  award: string | null;
  tech: string[];
  metrics: { value: string; label: string }[];
  live: string | null;
  github: string | null;
  accent: "emerald" | "indigo";
};

export const aiShowcase: AIProduct[] = [
  {
    id: "pathsense-ai",
    name: "PathSense",
    category: "Accessibility AI",
    tagline: "Real-time AI navigation for mobility-impaired users",
    description:
      "Award-winning hackathon product. Gemini Live API delivers real-time environmental audio descriptions as users move, while crowd-sourced barrier data and live GPS rerouting create a fully accessible navigation experience.",
    award: "Best Use of Live API — Gemini Glitch Hackathon",
    tech: ["Gemini 2.5 Flash", "Gemini Live API", "Google Maps API", "Firebase"],
    metrics: [
      { value: "1st", label: "Hackathon Winner" },
      { value: "Live", label: "Deployed App" },
      { value: "AI", label: "Camera Guidance" },
    ],
    live: "https://accessible-path.vercel.app/",
    github: "https://github.com/oseijaphetosei-ui/PathSense-Navigation.git",
    accent: "emerald" as const,
  },
  {
    id: "scripture-ai",
    name: "Scripture AI",
    category: "Consumer AI",
    tagline: "Talk to Scripture — AI-powered Bible study",
    description:
      "Mobile app that makes Scripture interactive. The signature 'Talk to Scripture' feature lets users ask questions, explore passages, and receive layered insights through AI — turning daily devotion into a two-way dialogue.",
    award: null,
    tech: ["React Native", "TypeScript", "Gemini API", "Firebase"],
    metrics: [
      { value: "Mobile", label: "iOS & Android" },
      { value: "AI", label: "Conversational" },
      { value: "Daily", label: "Active Users" },
    ],
    live: null,
    github: null,
    accent: "indigo" as const,
  },
  {
    id: "edge-ai-security",
    name: "Edge AI Security",
    category: "Industrial AI",
    tagline: "1,000+ security events per second at the edge",
    description:
      "Production AI system built at AASS. Real-time intrusion detection runs inference directly on edge hardware — no cloud round-trip — enabling sub-millisecond threat classification at scale with dramatically reduced false positives.",
    award: null,
    tech: ["Edge AI", "Python", "FastAPI", "React", "TypeScript"],
    metrics: [
      { value: "1K+", label: "Events / sec" },
      { value: "40%", label: "Fewer False Positives" },
      { value: "Edge", label: "On-Device Inference" },
    ],
    live: null,
    github: null,
    accent: "emerald" as const,
  },
];

export const leadership = {
  org: "The Ckedon Foundation",
  role: "Scholar & Mentor",
  period: "August 2023 – Present",
  location: "Kumasi, Ghana",
  description:
    "Supporting the next generation of African scholars through mentorship, education, and community building. From SAT prep to college applications — we open doors.",
  bullets: [
    "Mentored 35+ students on SAT preparation and college applications, achieving a 93% admission success rate to top universities.",
    "Expanded program reach to 250+ students and raised $10,000+ in funding for educational initiatives in local and remote areas across Ghana.",
  ],
  stats: [
    { value: "35+", label: "Students Mentored" },
    { value: "93%", label: "Admission Success Rate" },
    { value: "250+", label: "Lives Reached" },
    { value: "$10K+", label: "Funding Raised" },
  ],
};

export const testimonials = [
  {
    id: 1,
    quote:
      "Osei brought incredible technical depth and leadership to our team. His ability to ship fast without cutting corners is rare at this level.",
    name: "Collaborator",
    title: "Hackathon Teammate",
    avatar: null,
  },
  {
    id: 2,
    quote:
      "Working with Osei was a masterclass in clean, well-tested code. The container optimization project set a new bar for what I expected from a student project.",
    name: "Peer Engineer",
    title: "Pomona College",
    avatar: null,
  },
  {
    id: 3,
    quote:
      "The impact Osei has had on our students in Ghana is immeasurable. His commitment to education and community is as strong as his engineering talent.",
    name: "Foundation Member",
    title: "The Ckedon Foundation",
    avatar: null,
  },
];
