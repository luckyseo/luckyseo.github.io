export const profile = {
  name: "Yunseo Park",
  shortName: "Yun",
  location: "Sydney",
  timezone: "UTC+10",
  email: "hello@yourdomain.com",
  linkedin: "https://www.linkedin.com/in/yunseo-park-profile/",
  github: "https://github.com/yourname",
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
    detail:
      "Bachelor of IT · Enterprise Software Development · Data Analytics · Dean's List 2025 and 2026 · GPA 6.94/7.00 · Project Society Secretary",
    date: "Jun 2026",
  },
  {
    place: "Microsoft Bootcamp",
    detail: "Azure-900",
    date: "Mar 2025",
  },
];

export const projects = [
  {
    year: "2026",
    title: "Portfolio rebuild",
    stack: ["Next.js", "TypeScript", "Design system"],
    excerpt: "A personal portfolio built from a serif-first design system, with a few small human details kept in.",
    details:
      "The goal is a portfolio that reads clearly, loads quickly and still feels like a person made it. I translated a prototype design handoff into reusable Next.js components and editable content records.",
    images: [null, null, null, null, null],
    likes: 12,
  },
  {
    year: "2026",
    title: "FreshBasket",
    stack: ["ASP.NET", "Razor Pages", "Checkout flow"],
    excerpt: "A grocery ordering app with product browsing, cart behaviour and checkout feedback.",
    details:
      "I focused on the everyday paths: adding items, seeing totals, and confirming checkout without making the interface feel heavier than the task.",
    images: [null, null, null, null, null],
    likes: 7,
  },
  {
    year: "2026",
    title: "Lyra chatbot",
    stack: ["Product thinking", "Conversation UI", "Research"],
    excerpt: "A chatbot concept shaped around clearer handoff, user trust and practical support flows.",
    details:
      "The work explored how a chat interface should explain itself, ask for the right amount of context and leave people with a useful next step.",
    images: [null, null, null, null, null],
    likes: 5,
  },
  {
    year: "2025",
    title: "Workplace Insights",
    stack: ["Data analytics", "Reporting", "Visualisation"],
    excerpt: "A reporting piece turning workplace data into readable patterns and recommendations.",
    details:
      "I worked on the story behind the numbers: what changed, what mattered and what a reader could do with the information.",
    images: [null, null, null, null, null],
    likes: 9,
  },
  {
    year: "2025",
    title: "Project Society operations",
    stack: ["Coordination", "Documentation", "Events"],
    excerpt: "Club operations, documents and event work across a student society context.",
    details:
      "This work was less about a single interface and more about making the moving pieces legible: people, dates, tasks and decisions.",
    images: [null, null, null, null, null],
    likes: 3,
  },
];

export const posts = [
  {
    date: "2 Sep 2026",
    category: "Working on",
    title: "Working on: my portfolio, again",
    excerpt: "Times New Roman, a white page, one wine accent and a tiny bit of chaos in the margins.",
    details:
      "Third rebuild this year. This time the brief was to keep the page still and let the interactions carry the personality: a heading that leans toward the cursor, rows that unfold instead of linking away, a record player that actually spins. Content and layout are locked; I'm just filling in the real project write-ups now.",
    likes: 8,
  },
  {
    date: "21 Aug 2026",
    category: "Tech note",
    title: "What I learned from rebuilding small UI pieces",
    excerpt: "The component is rarely the hard part. The real work is naming the states clearly.",
    details:
      "Every row on this page — education, projects, posts — is the same object with different props. Once I named the states properly (expanded, active, hasSlot) instead of reaching for one-off flags, the three lists collapsed into a single PostCard and a lot of duplicate CSS disappeared.",
    likes: 21,
  },
  {
    date: "9 Aug 2026",
    category: "Thought",
    title: "Dense is not the same as cluttered",
    excerpt: "A useful screen can hold a lot, as long as the hierarchy is doing honest work.",
    details:
      "A page with five projects and six posts can still read as calm if the type scale and the hairlines are doing their job. Cluttered isn't a row count, it's a hierarchy that isn't earning its keep.",
    likes: 4,
  },
  {
    date: "28 Jul 2026",
    category: "Tech note",
    title: "Inlining SVG icons so exports stop breaking",
    excerpt: "Masked icons can look fine in a browser and still publish as squares. The fix is boring, useful and worth writing down.",
    details:
      "The icon set gets fetched and inlined as markup rather than referenced with a mask, so `currentColor` keeps working in both themes and nothing silently turns into a black square when it's exported or printed.",
    likes: 14,
  },
  {
    date: "14 Jul 2026",
    category: "Thought",
    title: "Small details are allowed to be small",
    excerpt: "Not every personal touch needs a whole section. Sometimes a tiny phrase does enough.",
    details:
      "The \"Into lately\" row and the little caption underneath it are the only emoji on this whole site, and they're confined on purpose. One honest, scoped exception says more than personality sprinkled everywhere.",
    likes: 31,
  },
  {
    date: "30 Jun 2026",
    category: "Working on",
    title: "Working on: rewriting my own portfolio, again",
    excerpt: "Times New Roman, a white page, one wine accent and a few things I like lately.",
    details:
      "Starting from a design system instead of a blank file this time: tokens first, then components, then the page. Slower to start, much faster once the second and third section needed the same row pattern as the first.",
    likes: 6,
  },
];
