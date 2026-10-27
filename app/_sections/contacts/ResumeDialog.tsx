"use client";

import { Button } from "@/app/_components/core/Button";
import { IconButton } from "@/app/_components/core/IconButton";
import { useContent } from "@/services/content/ContentProvider";
import { sanitizeUrl } from "@/services/content/validation";

type ResumeDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function ResumeDialog({ open, onClose }: ResumeDialogProps) {
  const { profile } = useContent();
  const linkedin = sanitizeUrl(profile.contacts.find((contact) => contact.label.toLowerCase() === "linkedin")?.href);
  if (!open) return null;

  return (
    <div className="dialog-layer" role="presentation">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="resume-title">
        <div className="dialog__header">
          <h2 id="resume-title">Request my résumé</h2>
          <IconButton name="x" label="Close dialog" size="sm" onClick={onClose} />
        </div>
        <p className="dialog__message">Send me a DM on LinkedIn and I&apos;ll send you my résumé :)</p>
        <div className="dialog__actions">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button href={linkedin ?? "#reach"} target={linkedin ? "_blank" : undefined} rel="noopener noreferrer" icon="arrow-up-right" onClick={onClose}>
            Message me on LinkedIn
          </Button>
        </div>
      </div>
    </div>
  );
}
