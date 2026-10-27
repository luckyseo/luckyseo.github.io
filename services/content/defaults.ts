import type { SiteContent } from "@/services/content/types";

/** Shown before content has loaded (and if loading fails). */
export const EMPTY_CONTENT: SiteContent = {
  profile: {
    name: "",
    shortName: "",
    location: "",
    timezone: "",
    availability: "",
    intro: "",
    interests: [],
    contacts: [],
    song: { title: "", artist: "", youtubeId: "" },
  },
  education: [],
  projects: [],
  posts: [],
};
