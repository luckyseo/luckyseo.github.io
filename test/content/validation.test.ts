import { describe, expect, it } from "vitest";
import {
  contactSchema,
  formatIssues,
  idFromTitle,
  LIMITS,
  newItemId,
  parseYouTubeId,
  postsSchema,
  profileSchema,
  projectSchema,
  sanitizeUrl,
  siteContentSchema,
  songSchema,
} from "@/services/content/validation";
import { sampleContent } from "@/test/fixtures";

describe("sanitizeUrl", () => {
  it("keeps https and mailto links", () => {
    expect(sanitizeUrl("https://github.com/luckyseo")).toBe("https://github.com/luckyseo");
    expect(sanitizeUrl("mailto:me@example.com")).toBe("mailto:me@example.com");
  });

  it("rejects unsafe or broken links", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBeUndefined();
    expect(sanitizeUrl("JaVaScRiPt:alert(1)")).toBeUndefined();
    expect(sanitizeUrl("data:text/html,<script>")).toBeUndefined();
    expect(sanitizeUrl("http://insecure.example.com")).toBeUndefined();
    expect(sanitizeUrl("not a url")).toBeUndefined();
    expect(sanitizeUrl("")).toBeUndefined();
    expect(sanitizeUrl(null)).toBeUndefined();
  });

  it("can be limited to https only", () => {
    expect(sanitizeUrl("mailto:me@example.com", ["https:"])).toBeUndefined();
  });
});

describe("parseYouTubeId", () => {
  it("reads the ID from the usual YouTube link shapes", () => {
    const id = "Qt6Y9_7QeHQ";
    expect(parseYouTubeId(id)).toBe(id);
    expect(parseYouTubeId(`https://www.youtube.com/watch?v=${id}&t=30s`)).toBe(id);
    expect(parseYouTubeId(`https://youtu.be/${id}?si=abc`)).toBe(id);
    expect(parseYouTubeId(`https://music.youtube.com/watch?v=${id}`)).toBe(id);
    expect(parseYouTubeId(`https://www.youtube.com/shorts/${id}`)).toBe(id);
    expect(parseYouTubeId(`https://www.youtube.com/embed/${id}`)).toBe(id);
  });

  it("rejects other sites and malformed IDs", () => {
    expect(parseYouTubeId("https://evil.example.com/watch?v=Qt6Y9_7QeHQ")).toBeUndefined();
    expect(parseYouTubeId("https://www.youtube.com/watch?v=short")).toBeUndefined();
    expect(parseYouTubeId("<script>")).toBeUndefined();
    expect(parseYouTubeId("")).toBeUndefined();
  });
});

describe("song", () => {
  it("allows an empty video ID (no music) but not a malformed one", () => {
    expect(songSchema.safeParse({ title: "", artist: "", youtubeId: "" }).success).toBe(true);
    expect(songSchema.safeParse({ title: "", artist: "", youtubeId: "https://youtu.be/x" }).success).toBe(false);
  });

  it("fills in an empty song for profiles saved before songs existed", () => {
    const { song: _song, ...oldProfile } = sampleContent().profile;
    expect(profileSchema.parse(oldProfile).song).toEqual({ title: "", artist: "", youtubeId: "" });
  });
});

describe("item ids (used to attach likes)", () => {
  it("derives ids from titles for items saved before ids existed", () => {
    const { id: _id, ...oldPost } = sampleContent().posts[0];
    const [post] = postsSchema.parse([{ ...oldPost, title: "Working on: my portfolio, again" }]);
    expect(post.id).toBe("working-on-my-portfolio-again");
  });

  it("uses a stable hash for titles without Latin letters", () => {
    expect(idFromTitle("포트폴리오")).toMatch(/^t-[a-z0-9]+$/);
    expect(idFromTitle("포트폴리오")).toBe(idFromTitle("포트폴리오"));
  });

  it("keeps existing ids and makes duplicates unique", () => {
    const post = sampleContent().posts[0];
    const ids = postsSchema.parse([post, { ...post }, { ...post, id: "custom" }]).map((item) => item.id);
    expect(ids).toEqual(["hi", "hi-2", "custom"]);
  });

  it("creates random ids for new items that pass validation", () => {
    expect(newItemId()).toMatch(/^[a-z0-9-]{1,64}$/);
  });
});

describe("content schemas", () => {
  it("accepts valid content", () => {
    expect(siteContentSchema.safeParse(sampleContent()).success).toBe(true);
  });

  it("rejects a javascript: contact link", () => {
    const result = contactSchema.safeParse({ icon: "link", label: "x", value: "x", href: "javascript:alert(1)" });
    expect(result.success).toBe(false);
  });

  it("rejects contact icons outside the allow-list", () => {
    const result = contactSchema.safeParse({ icon: "../../evil", label: "x", value: "x", href: "https://a.com" });
    expect(result.success).toBe(false);
  });

  it("rejects non-https image links but allows empty (null) slots", () => {
    const project = sampleContent().projects[0];
    expect(projectSchema.safeParse({ ...project, images: [null, null] }).success).toBe(true);
    expect(projectSchema.safeParse({ ...project, images: ["http://a.com/x.png"] }).success).toBe(false);
  });

  it("enforces required fields and length limits", () => {
    const project = sampleContent().projects[0];
    expect(projectSchema.safeParse({ ...project, title: "   " }).success).toBe(false);
    expect(projectSchema.safeParse({ ...project, details: "x".repeat(LIMITS.longText + 1) }).success).toBe(false);
    expect(projectSchema.safeParse({ ...project, images: Array(LIMITS.images + 1).fill(null) }).success).toBe(false);
  });

  it("trims text and fills a missing degree with an empty string", () => {
    const parsed = siteContentSchema.parse({
      ...sampleContent(),
      education: [{ place: "  Bootcamp  ", detail: ["Azure"], date: "2025" }],
    });
    expect(parsed.education[0]).toEqual({ place: "Bootcamp", degree: "", detail: ["Azure"], date: "2025" });
  });

  it("formats issues with readable, 1-based paths", () => {
    const result = siteContentSchema.safeParse({ ...sampleContent(), projects: [{ ...sampleContent().projects[0], title: "" }] });
    expect(result.success).toBe(false);
    if (!result.success) expect(formatIssues(result.error)).toEqual(["projects › #1 › title: Required"]);
  });
});
