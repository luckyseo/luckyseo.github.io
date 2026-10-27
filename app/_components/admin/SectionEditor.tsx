"use client";

import type { ReactNode } from "react";
import { Button } from "@/app/_components/core/Button";
import type { SaveState, SectionDraft } from "@/app/_components/admin/useSectionDraft";

const STATUS_TEXT: Record<SaveState, string> = {
  idle: "",
  saving: "Saving…",
  saved: "Saved ✓",
  invalid: "Fix the fields below, then save again.",
  failed: "Save failed.",
};

type SectionEditorProps<T> = {
  title: string;
  description?: string;
  draft: SectionDraft<T>;
  children: ReactNode;
};

/** Frame shared by every editor: heading, fields, errors and the Save / Discard buttons. */
export function SectionEditor<T>({ title, description, draft, children }: SectionEditorProps<T>) {
  return (
    <form
      className="admin-editor"
      onSubmit={(event) => {
        event.preventDefault();
        void draft.save();
      }}
    >
      <header className="admin-editor__header">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </header>

      <div className="admin-editor__fields" key={draft.version}>
        {children}
      </div>

      {draft.errors.length ? (
        <ul className="admin-editor__errors" role="alert">
          {draft.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}

      <footer className="admin-editor__actions">
        <span className="admin-editor__status" role="status">
          {STATUS_TEXT[draft.state]}
        </span>
        <Button type="button" variant="ghost" onClick={draft.reset} disabled={draft.state === "saving"}>
          Discard changes
        </Button>
        <Button type="submit" disabled={draft.state === "saving"}>
          Save {title.toLowerCase()}
        </Button>
      </footer>
    </form>
  );
}
