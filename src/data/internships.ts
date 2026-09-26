export type Internship = {
  id: string;
  title: string;
  company: string;
  sector: string;
  location: string;
  mode: "Remote" | "Hybrid" | "On-site";
  duration: string;
  stipend: string;
  match: number;
  matched: string[];
  gaps: { skill: string; tip: string }[];
  why: [string, string];
  eligibility: { degree: string; batch: string; other: string };
  breakdown: { label: string; weight: number; score: number }[];
  url: string;
};

const bd = (s: number[]) =>
  [
    ["Skills Match", 30],
    ["Education Match", 20],
    ["Career Goal Match", 20],
    ["Interests Match", 15],
    ["Location Match", 10],
    ["Experience Match", 5],
  ].map(([label, weight], i) => ({ label: label as string, weight: weight as number, score: s[i] ?? 0 }));

export const internships: Internship[] = [
  {
    id: "1",
    title: "Software Development Intern",
    company: "ABC Technologies",
    sector: "IT Services",
    location: "Mumbai",
    mode: "Hybrid",
    duration: "3 Months",
    stipend: "₹15,000 / Month",
    match: 94,
    matched: ["Python", "SQL", "Git"],
    gaps: [
      { skill: "React", tip: "Build a to-do app with the official React tutorial." },
      { skill: "REST APIs", tip: "Try a free Postman API fundamentals course." },
    ],
    why: ["Your Python and SQL skills cover 3 of 5 core requirements.", "Hybrid role in your preferred city, Mumbai."],
    eligibility: { degree: "BCA, B.Tech, B.Sc CS or MCA", batch: "Graduating 2025–2027", other: "Age 21–24, not in full-time employment" },
    breakdown: bd([27, 20, 18, 14, 10, 5]),
    url: "https://pminternship.mca.gov.in/",
  },
  {
    id: "2",
    title: "Data Analyst Intern",
    company: "Insight Analytics Pvt Ltd",
    sector: "Analytics",
    location: "Pune",
    mode: "Remote",
    duration: "6 Months",
    stipend: "₹12,000 / Month",
    match: 88,
    matched: ["SQL", "Data Analysis", "Python"],
    gaps: [
      { skill: "Power BI", tip: "Follow Microsoft Learn's free Power BI path." },
      { skill: "Statistics", tip: "Khan Academy statistics basics in 2 weeks." },
    ],
    why: ["Strong SQL and data analysis match the core stack.", "Fully remote, fits any location."],
    eligibility: { degree: "Any graduate with CS/Maths background", batch: "Graduating 2025–2028", other: "Basic Excel proficiency" },
    breakdown: bd([25, 18, 18, 13, 9, 5]),
    url: "https://pminternship.mca.gov.in/",
  },
  {
    id: "3",
    title: "Machine Learning Intern",
    company: "NeuroByte AI Labs",
    sector: "Artificial Intelligence",
    location: "Bengaluru",
    mode: "On-site",
    duration: "6 Months",
    stipend: "₹20,000 / Month",
    match: 81,
    matched: ["Python", "Machine Learning"],
    gaps: [
      { skill: "TensorFlow", tip: "Complete the TensorFlow beginner notebooks." },
      { skill: "Docker", tip: "Learn Docker basics on YouTube in a weekend." },
    ],
    why: ["Your ML interest aligns with the team's focus.", "Python is the primary language used daily."],
    eligibility: { degree: "B.Tech or MCA", batch: "Graduating 2025–2026", other: "One ML project in portfolio" },
    breakdown: bd([22, 20, 17, 14, 4, 4]),
    url: "https://pminternship.mca.gov.in/",
  },
  {
    id: "4",
    title: "Frontend Developer Intern",
    company: "PixelCraft Studios",
    sector: "Product Design",
    location: "Mumbai",
    mode: "Hybrid",
    duration: "4 Months",
    stipend: "₹14,000 / Month",
    match: 78,
    matched: ["HTML", "JavaScript", "Git"],
    gaps: [
      { skill: "React", tip: "Scrimba's free React course is a great start." },
      { skill: "Tailwind CSS", tip: "Rebuild a landing page using Tailwind docs." },
    ],
    why: ["HTML and JavaScript cover the fundamentals.", "Located in Mumbai with hybrid flexibility."],
    eligibility: { degree: "BCA, B.Tech, Diploma", batch: "Graduating 2025–2027", other: "Portfolio link preferred" },
    breakdown: bd([20, 16, 16, 12, 10, 4]),
    url: "https://pminternship.mca.gov.in/",
  },
  {
    id: "5",
    title: "Cloud & DevOps Intern",
    company: "SkyStack Infra",
    sector: "Cloud Computing",
    location: "Hyderabad",
    mode: "Remote",
    duration: "3 Months",
    stipend: "₹16,000 / Month",
    match: 72,
    matched: ["Linux", "Git"],
    gaps: [
      { skill: "AWS", tip: "Take the free AWS Cloud Practitioner essentials." },
      { skill: "Docker", tip: "Learn Docker basics on YouTube in a weekend." },
      { skill: "CI/CD", tip: "Set up GitHub Actions on a personal repo." },
    ],
    why: ["Linux and Git are the foundation of DevOps work.", "Remote role with mentorship programme."],
    eligibility: { degree: "B.Tech, B.Sc CS, MCA", batch: "Graduating 2025–2027", other: "Comfort with command line" },
    breakdown: bd([17, 18, 15, 12, 7, 3]),
    url: "https://pminternship.mca.gov.in/",
  },
  {
    id: "6",
    title: "Cybersecurity Analyst Intern",
    company: "SecureNet India",
    sector: "Cybersecurity",
    location: "Delhi",
    mode: "On-site",
    duration: "6 Months",
    stipend: "₹18,000 / Month",
    match: 65,
    matched: ["Linux", "Python"],
    gaps: [
      { skill: "Networking", tip: "Cisco's free Intro to Networking course." },
      { skill: "OWASP Top 10", tip: "Practice on TryHackMe beginner rooms." },
    ],
    why: ["Python scripting is useful for security automation.", "Linux skills match SOC tooling."],
    eligibility: { degree: "B.Tech, BCA, MCA", batch: "Graduating 2025–2026", other: "Interest in security certifications" },
    breakdown: bd([16, 18, 12, 10, 5, 4]),
    url: "https://pminternship.mca.gov.in/",
  },
];

export const getInternship = (id: string) => internships.find((i) => i.id === id);
