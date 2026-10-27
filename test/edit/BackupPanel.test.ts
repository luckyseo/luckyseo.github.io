import { describe, expect, it } from "vitest";
import { parseBackup } from "@/app/_sections/backup/BackupPanel";
import { sampleContent } from "@/test/fixtures";

describe("parseBackup", () => {
  it("accepts an exported backup", () => {
    expect(parseBackup(JSON.stringify(sampleContent()))).toEqual(sampleContent());
  });

  it("rejects files that are not JSON", () => {
    expect(() => parseBackup("not json")).toThrow("not valid JSON");
  });

  it("rejects JSON that is not site content", () => {
    expect(() => parseBackup(JSON.stringify({ profile: {} }))).toThrow(/profile › name/);
  });
});
