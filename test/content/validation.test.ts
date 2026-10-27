import { describe, expect, it } from "vitest";
import {
  contactSchema,
  formatIssues,
  LIMITS,
  projectSchema,
  sanitizeUrl,
  siteContentSchema,
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
