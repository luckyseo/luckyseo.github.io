"use client";

import { ListEditor } from "@/app/_components/admin/ListEditor";
import { SectionEditor } from "@/app/_components/admin/SectionEditor";
import { StringListField } from "@/app/_components/admin/StringListField";
import { TextField } from "@/app/_components/admin/TextField";
import { useSectionDraft, type EditorProps } from "@/app/_components/admin/useSectionDraft";
import type { EducationItem } from "@/services/content/types";
import { educationSchema, LIMITS } from "@/services/content/validation";

export function EducationEditor({ value, onSave }: EditorProps<EducationItem[]>) {
  const draft = useSectionDraft(value, educationSchema, onSave);

  return (
    <SectionEditor title="Education" draft={draft}>
      <ListEditor
        items={draft.draft}
        onChange={draft.setDraft}
        createItem={() => ({ place: "", degree: "", detail: [], date: "" })}
        itemLabel={(item) => item.place}
        addLabel="Add education"
        max={LIMITS.education}
        renderItem={(item, update) => (
          <>
            <TextField label="School / place" value={item.place} onChange={(place) => update({ place })} maxLength={LIMITS.shortText} />
            <TextField
              label="Degree"
              hint="Optional"
              value={item.degree}
              onChange={(degree) => update({ degree })}
              maxLength={LIMITS.shortText}
            />
            <StringListField label="Details" values={item.detail} onChange={(detail) => update({ detail })} />
            <TextField label="Date" placeholder="Jun 2026" value={item.date} onChange={(date) => update({ date })} maxLength={LIMITS.shortText} />
          </>
        )}
      />
    </SectionEditor>
  );
}
