"use client";

import { useState } from "react";
import { Button } from "@/components/core/Button";
import { IconButton } from "@/components/core/IconButton";

type ResumeDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function ResumeDialog({ open, onClose }: ResumeDialogProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  function submit() {
    if (!/.+@.+\..+/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setEmail("");
    setError("");
    onClose();
  }

  return (
    <div className="dialog-layer" role="presentation">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="resume-title">
        <div className="dialog__header">
          <h2 id="resume-title">Request my résumé</h2>
          <IconButton name="x" label="Close dialog" size="sm" onClick={onClose} />
        </div>
        <p className="dialog__message">Leave an email and I will send the current PDF across. No list, no follow-ups.</p>
        <label className="field">
          <span>Your email</span>
          <input
            aria-describedby={error ? "resume-error" : undefined}
            aria-invalid={error ? true : undefined}
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
          />
        </label>
        {error ? (
          <p className="field-error" id="resume-error">
            {error}
          </p>
        ) : null}
        <div className="dialog__actions">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" icon="arrow-up-right" onClick={submit}>
            Send it over
          </Button>
        </div>
      </div>
    </div>
  );
}
