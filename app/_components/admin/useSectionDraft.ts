"use client";

import { useEffect, useRef, useState } from "react";
import type { z } from "zod";
import { formatIssues } from "@/services/content/validation";

export type EditorProps<T> = {
  value: T;
  onSave: (value: T) => Promise<void>;
};

export type SaveState = "idle" | "saving" | "saved" | "invalid" | "failed";

/**
 * Local, editable copy of one section.
 * Validates with the section's schema before handing the result to onSave.
 */
export function useSectionDraft<T>(value: T, schema: z.ZodType<T, unknown>, onSave: (value: T) => Promise<void>) {
  const [draft, setDraftState] = useState<T>(value);
  const [state, setState] = useState<SaveState>("idle");
  const [errors, setErrors] = useState<string[]>([]);
  // Bumped whenever the draft is replaced from outside, so fields holding their own text re-mount.
  const [version, setVersion] = useState(0);
  const dirty = useRef(false);

  // Pick up freshly loaded content, unless there are unsaved edits.
  useEffect(() => {
    if (dirty.current) return;
    setDraftState(value);
    setVersion((current) => current + 1);
  }, [value]);

  function setDraft(next: T) {
    dirty.current = true;
    setDraftState(next);
    setState("idle");
  }

  async function save() {
    const parsed = schema.safeParse(draft);

    if (!parsed.success) {
      setErrors(formatIssues(parsed.error));
      setState("invalid");
      return;
    }

    setErrors([]);
    setState("saving");

    try {
      await onSave(parsed.data);
      dirty.current = false;
      setDraftState(parsed.data);
      setState("saved");
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Save failed."]);
      setState("failed");
    }
  }

  function reset() {
    dirty.current = false;
    setDraftState(value);
    setVersion((current) => current + 1);
    setErrors([]);
    setState("idle");
  }

  return { draft, setDraft, save, reset, state, errors, version };
}

export type SectionDraft<T> = ReturnType<typeof useSectionDraft<T>>;
