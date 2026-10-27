import type { z } from "zod";
import type {
  contactSchema,
  educationItemSchema,
  interestSchema,
  postSchema,
  profileSchema,
  projectSchema,
  siteContentSchema,
} from "@/services/content/validation";

export type Interest = z.infer<typeof interestSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type ContactIcon = Contact["icon"];
export type Profile = z.infer<typeof profileSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Post = z.infer<typeof postSchema>;
export type SiteContent = z.infer<typeof siteContentSchema>;

/** Each section is stored as its own Firestore document. */
export type SectionKey = keyof SiteContent;
