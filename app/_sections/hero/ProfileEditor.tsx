"use client";

import { SectionEditor } from "@/app/_components/admin/SectionEditor";
import { TextField } from "@/app/_components/admin/TextField";
import { useSectionDraft, type EditorProps } from "@/app/_components/admin/useSectionDraft";
import type { Profile } from "@/services/content/types";
import { LIMITS, profileSchema } from "@/services/content/validation";

export type ProfileBasics = Omit<Profile, "interests" | "contacts" | "song">;

export const profileBasicsSchema = profileSchema.omit({ interests: true, contacts: true, song: true });

export function pickProfileBasics({ name, shortName, location, timezone, availability, intro }: Profile): ProfileBasics {
  return { name, shortName, location, timezone, availability, intro };
}

export function ProfileEditor({ value, onSave }: EditorProps<ProfileBasics>) {
  const draft = useSectionDraft(value, profileBasicsSchema, onSave);
  const set = (patch: Partial<ProfileBasics>) => draft.setDraft({ ...draft.draft, ...patch });

  return (
    <SectionEditor title="Profile" description="The greeting at the top of the page and the footer details." draft={draft}>
      <TextField label="Full name" value={draft.draft.name} onChange={(name) => set({ name })} maxLength={LIMITS.shortText} />
      <TextField
        label="Short name"
        hint="Shown in “Hi! I'm …”"
        value={draft.draft.shortName}
        onChange={(shortName) => set({ shortName })}
        maxLength={LIMITS.shortText}
      />
      <TextField
        label="Availability badge"
        placeholder="Open to work"
        value={draft.draft.availability}
        onChange={(availability) => set({ availability })}
        maxLength={LIMITS.shortText}
      />
      <TextField label="Intro line" value={draft.draft.intro} onChange={(intro) => set({ intro })} maxLength={LIMITS.mediumText} />
      <TextField label="Location" value={draft.draft.location} onChange={(location) => set({ location })} maxLength={LIMITS.shortText} />
      <TextField label="Timezone" value={draft.draft.timezone} onChange={(timezone) => set({ timezone })} maxLength={LIMITS.shortText} />
    </SectionEditor>
  );
}
