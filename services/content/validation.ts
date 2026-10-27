import { z } from "zod";

/*
 * Single source of truth for the shape of site content.
 * Limits here are mirrored (where Firestore rules can express them) in firestore.rules.
 */

export const LIMITS = {
  shortText: 120,
  mediumText: 400,
  longText: 3000,
  url: 500,
  interests: 20,
  contacts: 10,
  education: 20,
  detailLines: 15,
  projects: 50,
  stack: 15,
  images: 5,
  posts: 100,
} as const;

export const CONTACT_ICONS = ["mail", "at-sign", "github", "link", "external-link", "file-text"] as const;

const SAFE_PROTOCOLS = ["https:", "mailto:"];

/** Returns the URL if it uses an allowed protocol, otherwise undefined. */
export function sanitizeUrl(value: string | null | undefined, protocols: string[] = SAFE_PROTOCOLS) {
  if (!value) return undefined;

  try {
    const url = new URL(value.trim());
    return protocols.includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

const requiredText = (max: number) => z.string().trim().min(1, "Required").max(max);
const optionalText = (max: number) => z.string().trim().max(max);

const linkUrl = z
  .string()
  .trim()
  .max(LIMITS.url)
  .refine((value) => sanitizeUrl(value) !== undefined, "Must start with https:// or mailto:");

const imageUrl = z
  .string()
  .trim()
  .max(LIMITS.url)
  .refine((value) => sanitizeUrl(value, ["https:"]) !== undefined, "Must start with https://");

export const interestSchema = z.object({
  icon: optionalText(16),
  label: requiredText(LIMITS.shortText),
});

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = ["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be"];

/** Gets the video ID from a pasted YouTube link (watch, youtu.be, shorts, embed) or a bare ID. */
export function parseYouTubeId(input: string) {
  const value = input.trim();
  if (YOUTUBE_ID.test(value)) return value;

  try {
    const url = new URL(value);
    if (!YOUTUBE_HOSTS.includes(url.hostname)) return undefined;

    const id = url.hostname === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v") ?? url.pathname.split("/")[2];
    return id && YOUTUBE_ID.test(id) ? id : undefined;
  } catch {
    return undefined;
  }
}

export const songSchema = z.object({
  title: optionalText(LIMITS.shortText),
  artist: optionalText(LIMITS.shortText),
  // Empty means "no song": the turntable still spins but plays nothing.
  youtubeId: z
    .string()
    .trim()
    .refine((value) => value === "" || YOUTUBE_ID.test(value), "Paste a YouTube link or an 11-character video ID"),
});

export const contactSchema = z.object({
  icon: z.enum(CONTACT_ICONS),
  label: requiredText(LIMITS.shortText),
  value: requiredText(LIMITS.shortText),
  href: linkUrl,
});

export const profileSchema = z.object({
  name: requiredText(LIMITS.shortText),
  shortName: requiredText(LIMITS.shortText),
  location: optionalText(LIMITS.shortText),
  timezone: optionalText(LIMITS.shortText),
  availability: optionalText(LIMITS.shortText),
  intro: optionalText(LIMITS.mediumText),
  interests: z.array(interestSchema).max(LIMITS.interests),
  contacts: z.array(contactSchema).max(LIMITS.contacts),
  // Defaulted so profiles saved before the song existed still load.
  song: songSchema.default({ title: "", artist: "", youtubeId: "" }),
});

/*
 * Projects and posts have a stable id so likes stay attached when items are edited or reordered.
 * Items saved before ids existed get one derived from their title.
 */
const itemId = z.string().regex(/^[a-z0-9-]{1,64}$/, "Invalid id");

function hashText(text: string) {
  let hash = 5381;
  for (const char of text) hash = (hash * 33) ^ char.codePointAt(0)!;
  return (hash >>> 0).toString(36);
}

/** Readable id from a title ("My Project!" -> "my-project"), or a hash for titles with no Latin letters. */
export function idFromTitle(title: string) {
  const slug = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || `t-${hashText(title)}`;
}

/** Random id for a newly added item. */
export function newItemId() {
  return crypto.randomUUID().slice(0, 8);
}

/** Before validating a list, give every item a valid id and make ids unique within the list. */
function withItemIds<T extends z.ZodType>(listSchema: T) {
  return z.preprocess((raw) => {
    if (!Array.isArray(raw)) return raw;
    const used = new Set<string>();

    return raw.map((item) => {
      if (!item || typeof item !== "object") return item;
      const current = (item as { id?: unknown }).id;
      const base = typeof current === "string" && itemId.safeParse(current).success ? current : idFromTitle(String((item as { title?: unknown }).title ?? ""));

      let id = base;
      for (let n = 2; used.has(id); n++) id = `${base.slice(0, 60)}-${n}`;
      used.add(id);
      return { ...item, id };
    });
  }, listSchema);
}

export const educationItemSchema = z.object({
  place: requiredText(LIMITS.shortText),
  degree: optionalText(LIMITS.shortText).default(""),
  detail: z.array(requiredText(LIMITS.mediumText)).max(LIMITS.detailLines),
  date: optionalText(LIMITS.shortText),
});

export const projectSchema = z.object({
  id: itemId,
  year: optionalText(LIMITS.shortText),
  title: requiredText(LIMITS.shortText),
  stack: z.array(requiredText(LIMITS.shortText)).max(LIMITS.stack),
  excerpt: optionalText(LIMITS.mediumText),
  details: optionalText(LIMITS.longText),
  images: z.array(imageUrl.nullable()).max(LIMITS.images),
});

export const postSchema = z.object({
  id: itemId,
  date: optionalText(LIMITS.shortText),
  category: optionalText(LIMITS.shortText),
  title: requiredText(LIMITS.shortText),
  excerpt: optionalText(LIMITS.mediumText),
  details: optionalText(LIMITS.longText),
});

export const educationSchema = z.array(educationItemSchema).max(LIMITS.education);
export const projectsSchema = withItemIds(z.array(projectSchema).max(LIMITS.projects));
export const postsSchema = withItemIds(z.array(postSchema).max(LIMITS.posts));
export const interestsSchema = profileSchema.shape.interests;
export const contactsSchema = profileSchema.shape.contacts;

export const siteContentSchema = z.object({
  profile: profileSchema,
  education: educationSchema,
  projects: projectsSchema,
  posts: postsSchema,
});

export const sectionSchemas = {
  profile: profileSchema,
  education: educationSchema,
  projects: projectsSchema,
  posts: postsSchema,
} as const;

/** Turns a zod error into "field.path: message" lines an editor can show. */
export function formatIssues(error: z.ZodError) {
  return error.issues.map((issue) => {
    const path = issue.path.map((part) => (typeof part === "number" ? `#${part + 1}` : String(part))).join(" › ");
    return path ? `${path}: ${issue.message}` : issue.message;
  });
}
