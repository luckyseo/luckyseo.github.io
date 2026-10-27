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
});

export const educationItemSchema = z.object({
  place: requiredText(LIMITS.shortText),
  degree: optionalText(LIMITS.shortText).default(""),
  detail: z.array(requiredText(LIMITS.mediumText)).max(LIMITS.detailLines),
  date: optionalText(LIMITS.shortText),
});

export const projectSchema = z.object({
  year: optionalText(LIMITS.shortText),
  title: requiredText(LIMITS.shortText),
  stack: z.array(requiredText(LIMITS.shortText)).max(LIMITS.stack),
  excerpt: optionalText(LIMITS.mediumText),
  details: optionalText(LIMITS.longText),
  images: z.array(imageUrl.nullable()).max(LIMITS.images),
  likes: z.number().int().min(0),
});

export const postSchema = z.object({
  date: optionalText(LIMITS.shortText),
  category: optionalText(LIMITS.shortText),
  title: requiredText(LIMITS.shortText),
  excerpt: optionalText(LIMITS.mediumText),
  details: optionalText(LIMITS.longText),
  likes: z.number().int().min(0),
});

export const educationSchema = z.array(educationItemSchema).max(LIMITS.education);
export const projectsSchema = z.array(projectSchema).max(LIMITS.projects);
export const postsSchema = z.array(postSchema).max(LIMITS.posts);
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
