"use client";

import { Button } from "@/components/core/Button";
import { IconButton } from "@/components/core/IconButton";
import { profile } from "@/data/portfolio";

type ResumeDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function ResumeDialog({ open, onClose }: ResumeDialogProps) {
  if (!open) return null;

  return (
    <div className="dialog-layer" role="presentation">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="resume-title">
        <div className="dialog__header">
          <h2 id="resume-title">Request my résumé</h2>
          <IconButton name="x" label="Close dialog" size="sm" onClick={onClose} />
        </div>
        <p className="dialog__message">
          I don&apos;t keep a mailing list for this — send me a DM on LinkedIn and I&apos;ll get the current PDF
          straight to you.
        </p>
        <div className="dialog__actions">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button href={profile.linkedin} target="_blank" rel="noopener" icon="arrow-up-right" onClick={onClose}>
            Message me on LinkedIn
          </Button>
        </div>
      </div>
    </div>
  );
}
