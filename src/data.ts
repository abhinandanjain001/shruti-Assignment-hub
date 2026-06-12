import { AcademicService, FeaturedProject, Testimonial } from "./types";

export const ACADEMIC_SERVICES: AcademicService[] = [
  {
    id: "assignment-writing",
    title: "Assignment Writing",
    description: "Well-researched, scholarly responses designed to secure high grades with complete citations and reference reports.",
    iconName: "FileText",
    basePriceInquiry: "From ₹499 per page"
  },
  {
    id: "homework-assistance",
    title: "Homework Assistance",
    description: "Daily task solutions across sciences, engineering, and business fields with detailed step-by-step working formulas.",
    iconName: "BookOpen",
    basePriceInquiry: "From ₹799 per hour"
  },
  {
    id: "programming-projects",
    title: "Programming Projects",
    description: "Clean, documented, and fully commented codebase deliverables in Python, Java, C++, and database environments.",
    iconName: "Code",
    basePriceInquiry: "From ₹2,499 onwards"
  },
  {
    id: "web-dev-projects",
    title: "Web Development Projects",
    description: "High-end responsive fullstack web apps utilizing React, Node.js, and databases for practical projects and submissions.",
    iconName: "Laptop",
    basePriceInquiry: "From ₹3,999 onwards"
  },
  {
    id: "ai-ml-projects",
    title: "AI & Machine Learning Projects",
    description: "Modern implementations of machine learning pipelines, predictive engines, and neural models with dataset reports.",
    iconName: "BrainCircuit",
    basePriceInquiry: "From ₹5,999 onwards"
  },
  {
    id: "research-papers",
    title: "Research Papers",
    description: "Scholarly, publication-ready research drafts drafted by academic writers in IEEE, APA, Harvard, or Chicago formats.",
    iconName: "Award",
    basePriceInquiry: "From ₹4,999 onwards"
  },
  {
    id: "dissertation-support",
    title: "Dissertation Support",
    description: "End-to-end consulting spanning literature reviews, structural formulation, survey methodology, and primary data testing.",
    iconName: "Bookmark",
    basePriceInquiry: "From ₹7,999 onwards"
  },
  {
    id: "case-study-solutions",
    title: "Case Study Solutions",
    description: "In-depth corporate analysis, SWOT models, financial calculations, and strategic operational assessments for MBA tasks.",
    iconName: "Presentation",
    basePriceInquiry: "From ₹1,499 onwards"
  },
  {
    id: "lab-reports",
    title: "Lab Reports",
    description: "Accurate compilations of engineering, physics, and networking lab results accompanied by screenshots and code diagrams.",
    iconName: "FlaskConical",
    basePriceInquiry: "From ₹999 onwards"
  },
  {
    id: "presentation-design",
    title: "Presentation Design",
    description: "Pristine, sleek executive Google Slides / PowerPoint deck designs that secure instant approval from examiners and juries.",
    iconName: "LayoutTemplate",
    basePriceInquiry: "From ₹1,199 onwards"
  },
  {
    id: "data-analytics",
    title: "Data Analytics Projects",
    description: "Professional evaluations, R projects, Jupyter notebook workflows, and interactive power BI dashboard deliverables.",
    iconName: "BarChart3",
    basePriceInquiry: "From ₹2,999 onwards"
  },
  {
    id: "cloud-computing",
    title: "Cloud Computing Projects",
    description: "Configured multi-regional Cloud architectures, infrastructure configs via Terraform, and secured server deployment drafts.",
    iconName: "Cloud",
    basePriceInquiry: "From ₹3,499 onwards"
  },
  {
    id: "database-projects",
    title: "Database Projects",
    description: "Normalized PostgreSQL, MySQL or MongoDB database solutions, complete with ERDs, raw scripts, and speed optimization indices.",
    iconName: "Database",
    basePriceInquiry: "From ₹1,999 onwards"
  },
  {
    id: "final-year",
    title: "Final Year Capstone Projects",
    description: "Elite end-to-end deliverables incorporating software apps, code manuals, abstract drafts, and presentation briefings.",
    iconName: "Cpu",
    basePriceInquiry: "From ₹7,999 onwards"
  }
];

export const SUBJECT_EXPERTISE = [
  { name: "Computer Science", tag: "Algorithms, OS, Networks" },
  { name: "AI & ML", tag: "Neural Networks, NLP, CV" },
  { name: "Data Science", tag: "Python, R, Tableau, Pandas" },
  { name: "Python", tag: "Django, Flask, Scripting" },
  { name: "Java", tag: "OOP, Spring Boot, Android" },
  { name: "C++", tag: "Data Structures, STL, Systems" },
  { name: "DBMS", tag: "SQL, MongoDB, Indexing" },
  { name: "Cloud Computing", tag: "AWS, GCP, Azure" },
  { name: "Cyber Security", tag: "Cryptography, Network Security" },
  { name: "Mathematics", tag: "Calculus, Linear Algebra, Discrete" },
  { name: "Statistics", tag: "Probability, Regression Tests" },
  { name: "Business Studies", tag: "MBA Finance, Marketing, Strategy" }
];

export const INITIAL_PROJECTS: FeaturedProject[] = [
  {
    id: "proj_01",
    title: "Enterprise E-Commerce Microservices",
    category: "Web Development",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    academicLevel: "B.Tech Final Year",
    gradeReceived: "A+ / 10 CGPA",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "proj_02",
    title: "Automated Logistical Arrival Predictor",
    category: "AI & ML",
    technologies: ["Python", "TensorFlow", "Pandas", "FastAPI", "scikit-learn"],
    academicLevel: "MCA Post-Graduate",
    gradeReceived: "Grade Outstanding",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "proj_03",
    title: "Highly Available Sharded SQL Cluster",
    category: "Database Systems",
    technologies: ["PostgreSQL", "Redis", "Docker", "Bash Scripting"],
    academicLevel: "University Masters",
    gradeReceived: "First Class Distinction",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "proj_04",
    title: "Performance Assessment of Post-Quantum Cryptosystem",
    category: "Cyber Security Research",
    technologies: ["LaTeX", "SageMath", "OpenSSL", "Mathematics"],
    academicLevel: "Research Scholar (PhD Candidate)",
    gradeReceived: "IEEE standard published",
    featured: true,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "t_01",
    studentName: "Abhinandan Jain",
    course: "B.Tech Computer Science",
    academicLevel: "Undergraduate",
    rating: 5,
    review: "Shruti and her team helped me with my B.Tech final semester web app and dissertation. The delivery was clean, documentation was industrial strength, and my professors awarded me a perfect 10 CGPA!",
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "t_02",
    studentName: "Megha Singhal",
    course: "MBA Analytics & Strategy",
    academicLevel: "Postgraduate",
    rating: 5,
    review: "Unbelievable service. I was working full time and couldn't complete my market research case study deliverables. The depth of analysis and presentation decks was top-tier and saved my semester.",
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "t_03",
    studentName: "Siddharth Verma",
    course: "MCA Software Systems",
    academicLevel: "Postgraduate",
    rating: 5,
    review: "Stunning code quality on my neural network project. Fully commented files, clear architecture explanation, and immediate support for mock lab viva prepared me perfectly.",
    verified: true,
    createdAt: new Date().toISOString()
  }
];

export const FAQS = [
  {
    question: "Are your academic solutions original?",
    answer: "Absolutely. Zero plagiarism is our fundamental vow. We construct each deliverable completely customized from scratch and provide a free originality report if requested."
  },
  {
    question: "What if my supervisor requests modifications?",
    answer: "We support our users through their evaluation phase. We provide free, unlimited modifications matching the original guidelines for up to 15 days post-delivery."
  },
  {
    question: "Is my personal data and transaction completely confidential?",
    answer: "We guarantee complete data isolation. We do not sell, rent, or disclose student profiles, attachments, files, university names, or contact numbers to any third party."
  },
  {
    question: "What levels of academic courses do you support?",
    answer: "We serve students across school, university undergraduates (B.Tech, B.Sc), postgraduates (M.Tech, MBA, MCA, MS), and research scholars (PhD) as well as working executives."
  },
  {
    question: "How is the pricing determined for a task?",
    answer: "Pricing is calculated customly based on technical complexity (e.g. standard content vs AI algorithms), length, and the timeframe requested. You can submit our Instant Quote form to get a personalized pricing response."
  }
];
