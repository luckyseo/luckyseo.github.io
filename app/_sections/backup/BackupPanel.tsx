"use client";

import { useState } from "react";
import { Button } from "@/app/_components/core/Button";
import type { SectionKey, SiteContent } from "@/services/content/types";
import { formatIssues, siteContentSchema } from "@/services/content/validation";

type BackupPanelProps = {
  content: SiteContent;
  saveSection: <K extends SectionKey>(key: K, value: SiteContent[K]) => Promise<void>;
};

const SECTION_ORDER: SectionKey[] = ["profile", "education", "projects", "posts"];

/** Parses a backup file. Throws with readable messages if it is not valid content. */
export function parseBackup(text: string): SiteContent {
  let json: unknown;

  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("This file is not valid JSON.");
  }

  const parsed = siteContentSchema.safeParse(json);
  if (!parsed.success) throw new Error(formatIssues(parsed.error).join("\n"));
  return parsed.data;
}

function downloadJson(content: SiteContent) {
  const date = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  // ".local.json" keeps the file out of git if it ends up inside the project.
  link.href = url;
  link.download = `portfolio-backup-${date}.local.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function BackupPanel({ content, saveSection }: BackupPanelProps) {
  const [message, setMessage] = useState("");

  async function importFile(file: File) {
    try {
      const imported = parseBackup(await file.text());
      if (!window.confirm("Replace ALL site content with this file? Export a backup first if unsure.")) return;

      setMessage("Importing…");
      for (const key of SECTION_ORDER) await saveSection(key, imported[key]);
      setMessage("Imported ✓");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import failed.");
    }
  }

  return (
    <section className="admin-editor">
      <header className="admin-editor__header">
        <h2>Backup</h2>
        <p>Content lives in Firestore, not in git. Export a copy now and then.</p>
      </header>
      <div className="admin-editor__actions admin-editor__actions--start">
        <Button type="button" iconLeading="download" onClick={() => downloadJson(content)}>
          Export JSON
        </Button>
        <label className="button button--outline button--md admin-file">
          <span>Import JSON…</span>
          <input
            type="file"
            accept="application/json,.json"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void importFile(file);
            }}
          />
        </label>
      </div>
      {message ? (
        <p className="admin-editor__status admin-editor__status--block" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
