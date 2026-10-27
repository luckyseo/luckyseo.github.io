import type { SiteContent } from "@/services/content/types";

/** Small, valid content used across tests. */
export function sampleContent(): SiteContent {
  return {
    profile: {
      name: "Test Person",
      shortName: "Test",
      location: "Sydney",
      timezone: "UTC+10",
      availability: "Open to work",
      intro: "Hello",
      interests: [{ icon: "☕", label: "coffee" }],
      contacts: [
        { icon: "mail", label: "Email", value: "me@example.com", href: "mailto:me@example.com" },
        { icon: "at-sign", label: "LinkedIn", value: "linkedin", href: "https://www.linkedin.com/in/test/" },
      ],
    },
    education: [{ place: "UTS", degree: "Bachelor of IT", detail: ["Major"], date: "2026" }],
    projects: [
      {
        year: "2026",
        title: "Portfolio",
        stack: ["Next.js"],
        excerpt: "Site",
        details: "More",
        images: ["https://example.com/a.png", null],
        likes: 0,
      },
    ],
    posts: [{ date: "1 Jan 2026", category: "Thought", title: "Hi", excerpt: "", details: "", likes: 0 }],
  };
}
