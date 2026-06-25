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
      live: null as string | null,
      github: null as string | null,
    },
    award: "Best Use of Live API — Gemini Glitch Hackathon",
    accent: "emerald" as const,
    featured: true,
    image: null as string | null,
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
  },
];

export const skills = {
  Languages: ["Python", "TypeScript", "JavaScript", "Java", "Haskell", "SQL"],
  Frontend: ["React", "Next.js", "React Native", "Tailwind CSS", "Framer Motion"],
  "Backend & APIs": ["Node.js", "FastAPI", "Firebase", "REST APIs"],
  "AI & Data": [
    "Edge AI",
    "Gemini API",
    "pandas",
    "NumPy",
    "scikit-learn",
    "Matplotlib",
    "Streamlit",
  ],
  Tools: ["Git", "GitHub", "pytest", "JUnit", "Figma"],
};

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
