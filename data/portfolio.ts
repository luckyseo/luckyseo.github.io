export const profile = {
  name: "Yunseo Park",
  shortName: "Yun",
  location: "Sydney",
  timezone: "UTC+10",
  email: "ityun777@gmail.com",
  linkedin: "https://www.linkedin.com/in/yunseo-park-profile/",
  github: "https://github.com/luckyseo",
  availability: "Open to work",
  intro: "Explore, Experience, Evolve and Share positivity",
  interests: [
    { icon: "☕", label: "coffee" },
    { icon: "🏃", label: "park walk" },
    { icon: "📖", label: "reading(trying)" },
    { icon: "🎧", label: "asmr" },
    { icon: "🧀", label: "too much cheese" },
    { icon: "🌹", label: "rose perfume" },
  ],
};

export const education = [
  {
    place: "University of Technology, Sydney",
    degree: "Bachelor of IT",
    detail: [
      "Major · Enterprise Software Development",
      "Sub major · Data Analytics",
      "Dean's List 2025 · 2026 | GPA 6.94/7.00",
      "Ex - UXID · Project Society Secretary",
      "Lucy Mentoring Program",
    ],
    date: "Jun 2026",
  },
  {
    place: "Microsoft Bootcamp",
    detail: ["Azure-900"],
    date: "Mar 2025",
  },
];

export const projects = [
  {
    year: "2026",
    title: "Portfolio/Vlog Website",
    stack: ["Next.js", "TypeScript", "Claude Design"],
    excerpt:
      "A personal portfolio built from a serif-first design system, with a few small human details kept in.",
    details:
      "The goal is a portfolio that reads clearly, loads quickly and still feels like a person made it. I translated a prototype design handoff into reusable Next.js components and editable content records.",
    images: [null, null, null, null, null],
    likes: 12,
  },
  {
    year: "2026",
    title: "FreshBasket",
    stack: ["ASP.NET", "Razor Pages", "Checkout flow"],
    excerpt:
      "A grocery ordering app with product browsing, cart behaviour and checkout feedback.",
    details:
      "I focused on the everyday paths: adding items, seeing totals, and confirming checkout without making the interface feel heavier than the task.",
    images: [null, null, null, null, null],
    likes: 7,
  },
];

export const posts = [
  {
    date: "9 Sep 2026",
    category: "Working on",
    title: "Working on: my portfolio, again",
    excerpt:
      "It took within two days to build... it should've taken much longer before ai become this familiar",
    details:
      "This is built using Next.js and I am planning to add editable feature so I can update the contents without touching codebase",
    likes: 0,
  },
];
