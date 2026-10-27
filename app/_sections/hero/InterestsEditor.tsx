"use client";

import { ListEditor } from "@/app/_components/admin/ListEditor";
import { SectionEditor } from "@/app/_components/admin/SectionEditor";
import { TextField } from "@/app/_components/admin/TextField";
import { useSectionDraft, type EditorProps } from "@/app/_components/admin/useSectionDraft";
import type { Interest } from "@/services/content/types";
import { interestsSchema, LIMITS } from "@/services/content/validation";

export function InterestsEditor({ value, onSave }: EditorProps<Interest[]>) {
  const draft = useSectionDraft(value, interestsSchema, onSave);

  return (
    <SectionEditor title="Interests" description="The “Into lately” chips." draft={draft}>
      <ListEditor
        items={draft.draft}
        onChange={draft.setDraft}
        createItem={() => ({ icon: "", label: "" })}
        itemLabel={(item) => `${item.icon} ${item.label}`.trim()}
        addLabel="Add interest"
        max={LIMITS.interests}
        renderItem={(item, update) => (
          <>
            <TextField label="Emoji" value={item.icon} onChange={(icon) => update({ icon })} maxLength={16} />
            <TextField label="Label" value={item.label} onChange={(label) => update({ label })} maxLength={LIMITS.shortText} />
          </>
        )}
      />
    </SectionEditor>
  );
}
