export const siteConfig = {
  name: "Osei Japhet Acquah",
  shortName: "Osei",
  initials: "OJA",
  title: "Software Engineer",
  tagline: "Building intelligent products that matter.",
  description:
    "CS & Math student at Pomona College. I build across the stack and into AI — from production IoT security systems to accessible navigation apps.",
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

export const education = {
  school: "Pomona College",
  location: "Claremont, California, USA",
  degree: "B.A. in Computer Science & Mathematics",
  expected: "May 2028",
  coursework: [
    "Computer Systems",
    "Data Structures & Algorithms",
    "Object-Oriented Programming",
  ],
};

export const experiences = [
  {
    id: "aass",
    company: "Asante Automation & Security",
    companyShort: "AASS",
    role: "Software Engineering Intern",
    period: "May 2026 – August 2026",
    type: "work" as const,
    award: null,
    bullets: [
      "Developed C components for production IoT security systems, implementing process management, buffered I/O, and concurrent inter-process communication across 10+ connected devices.",
      "Integrated LLM-based event classification into IoT security pipelines, iteratively refining prompts and processing workflows to reduce false-positive security alerts by 30%+ across smart-security deployments.",
      "Built React/TypeScript dashboard features and REST API integrations for real-time security events, device status, and automation workflows deployed across 10+ client environments.",
    ],
    stack: ["C", "Python", "React", "TypeScript", "REST APIs", "LLMs"],
  },
  {
    id: "cs-course-assistant",
    company: "Pomona College — Computer Science Department",
    companyShort: "Pomona CS",
    role: "Undergraduate Course Assistant, Data Structures & Algorithms",
    period: "January 2026 – May 2026",
    type: "teaching" as const,
    award: null,
    bullets: [
      "Led weekly Data Structures & Algorithms labs for 30+ students, teaching object-oriented design, recursion, data structures, algorithms, and time/space complexity.",
      "Debugged and reviewed Java implementations during office hours, helping students reason about algorithm correctness, runtime complexity, edge cases, and implementation tradeoffs.",
    ],
    stack: ["Java", "Data Structures & Algorithms", "Teaching"],
  },
  {
    id: "pathsense-hackathon",
    company: "Gemini Glitch AI Hackathon — UCLA",
    companyShort: "PathSense",
    role: "Team Lead & Full-Stack Developer, PathSense",
    period: "March 2026",
    type: "hackathon" as const,
    award: "Best Use of Live API — Top 10 of 48+ teams",
    bullets: [
      "Led a 4-person engineering team to design and ship an AI-powered accessible-navigation web app in a single hackathon sprint, winning Best Use of Live API and placing Top 10 of 48+ teams.",
      "Integrated Gemini 2.5 Flash Vision with live camera input to process real-time visual context and generate scene descriptions and obstacle alerts for hands-free, eye-free navigation.",
      "Integrated Google Maps SDK and Firebase Realtime Database for GPS navigation and crowdsourced accessibility reporting, enabling real-time multi-user updates and supporting 12 concurrent users during the demo.",
    ],
    stack: ["React", "TypeScript", "Gemini 2.5 Flash Vision", "Google Maps SDK", "Firebase"],
    link: "https://accessible-path.vercel.app/",
  },
  {
    id: "pomona-its",
    company: "Pomona College — ITS",
    companyShort: "Pomona ITS",
    role: "Student Service Desk Consultant",
    period: "October 2025 – January 2026",
    type: "work" as const,
    award: null,
    bullets: [
      "Diagnosed and resolved 10+ software, hardware, account, and network issues per week, applying systematic troubleshooting to maintain a 100% same-day resolution rate for students and faculty.",
      "Authored 6 technical setup guides adopted as standard onboarding and self-service documentation, reducing repeat support requests by 50%.",
    ],
    stack: ["Technical Support", "Documentation", "Troubleshooting"],
  },
];

export const projects = [
  {
    id: "pathsense",
    name: "PathSense",
    tagline: "AI accessibility navigation · Best Use of Live API, Top 10 of 48+",
    description:
      "An AI-powered accessible navigation web app built in a single hackathon sprint with a 4-person team. Gemini 2.5 Flash Vision processes live camera input to generate real-time scene descriptions and obstacle alerts, with GPS navigation and crowdsourced accessibility reporting via Firebase Realtime Database.",
    stack: [
      "React",
      "TypeScript",
      "Gemini 2.5 Flash Vision",
      "Gemini Live API",
      "Google Maps SDK",
      "Firebase Realtime Database",
    ],
    links: {
      live: "https://accessible-path.vercel.app/",
      github: "https://github.com/oseijaphetosei-ui/PathSense-Navigation.git",
    },
    award: "Best Use of Live API — Gemini Glitch Hackathon, UCLA",
    accent: "emerald" as const,
    featured: true,
    image: "/pathsense-preview.jpeg" as string | null,
    demo: "/pathsense-demo.mp4" as string | null,
  },
  {
    id: "container-optimizer",
    name: "Container Design Optimization",
    tagline: "Numerical optimization app · 100% test coverage",
    description:
      "An optimization application using Lagrange multipliers and numerical methods to compute maximum container volumes under fixed surface-area constraints, translating mathematical requirements into practical software. Backed by pytest unit and integration suites covering optimization logic, constraint handling, and edge cases at 100% code coverage.",
    stack: ["Python", "NumPy", "SciPy", "pytest", "Streamlit"],
    links: {
      live: "https://container-optimization-project-wzg6za6grqwqimo8ekq9n2.streamlit.app/" as string | null,
      github: null as string | null,
    },
    award: null,
    accent: "indigo" as const,
    featured: true,
    image: null as string | null,
    demo: "/container-demo.mp4" as string | null,
  },
  {
    id: "bible-devotion-app",
    name: "Bible & Devotion App",
    tagline: "Duolingo-inspired Scripture learning · iOS & Android",
    description:
      "A Duolingo-inspired mobile learning platform with 60+ structured lessons, prerequisite-based unlocking, and cross-device progress tracking. Offline-first React Native frontend backed by Firebase Firestore, with multi-provider authentication (Google, Apple, email) and Gemini AI for conversational Bible study, personalized devotion generation, and cached AI audio for low-latency responses.",
    stack: ["React Native", "Firebase", "Firebase Auth", "Gemini API"],
    links: {
      live: null as string | null,
      github: "https://github.com/oseijaphetosei-ui/-Bible-Devotion-App.git" as string | null,
    },
    award: null,
    accent: "emerald" as const,
    featured: true,
    image: null as string | null,
    demo: null as string | null,
  },
];

type SkillCategory = {
  id: string;
  title: string;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "Languages",
    skills: ["Python", "Java", "C", "JavaScript/TypeScript", "SQL", "Haskell", "HTML/CSS"],
  },
  {
    id: "frameworks",
    title: "Frameworks & Technologies",
    skills: [
      "React",
      "React Native",
      "Expo",
      "Node.js",
      "FastAPI",
      "Firebase",
      "pandas",
      "NumPy",
      "Streamlit",
    ],
  },
  {
    id: "ai",
    title: "AI / LLM",
    skills: ["Gemini API", "Gemini 2.5 Flash Vision", "Gemini Live API"],
  },
  {
    id: "tools",
    title: "Developer Tools",
    skills: ["Git/GitHub", "pytest", "JUnit"],
  },
];

export const leadership = {
  org: "The Ckodon Foundation",
  role: "Past Scholar & Current Mentor",
  period: "August 2023 – Present",
  location: "Kumasi, Ghana",
  description:
    "Supporting the next generation of African scholars through mentorship, education, and community building. From SAT prep to college applications — we open doors.",
  bullets: [
    "Mentored 35+ students on SAT preparation and college applications, achieving a 93% admission rate to top universities.",
    "Expanded program reach to 250+ students and raised $10,000+ for educational initiatives across Ghana.",
  ],
  stats: [
    { value: "35+", label: "Students Mentored" },
    { value: "93%", label: "Admission Rate" },
    { value: "250+", label: "Program Reach" },
    { value: "$10K+", label: "Funding Raised" },
  ],
};
