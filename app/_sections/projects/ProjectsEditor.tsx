"use client";

import { ListEditor } from "@/app/_components/admin/ListEditor";
import { SectionEditor } from "@/app/_components/admin/SectionEditor";
import { StringListField } from "@/app/_components/admin/StringListField";
import { TextField } from "@/app/_components/admin/TextField";
import { useSectionDraft, type EditorProps } from "@/app/_components/admin/useSectionDraft";
import { ImageUrlsField } from "@/app/_sections/projects/ImageUrlsField";
import type { Project } from "@/services/content/types";
import { LIMITS, projectsSchema } from "@/services/content/validation";

function newProject(): Project {
  return {
    year: String(new Date().getFullYear()),
    title: "",
    stack: [],
    excerpt: "",
    details: "",
    images: Array.from({ length: LIMITS.images }, () => null),
    likes: 0,
  };
}

export function ProjectsEditor({ value, onSave }: EditorProps<Project[]>) {
  const draft = useSectionDraft(value, projectsSchema, onSave);

  return (
    <SectionEditor title="Projects" description="The first three are shown before “Show more”." draft={draft}>
      <ListEditor
        items={draft.draft}
        onChange={draft.setDraft}
        createItem={newProject}
        itemLabel={(item) => item.title}
        addLabel="Add project"
        max={LIMITS.projects}
        renderItem={(item, update) => (
          <>
            <TextField label="Title" value={item.title} onChange={(title) => update({ title })} maxLength={LIMITS.shortText} />
            <TextField label="Year" value={item.year} onChange={(year) => update({ year })} maxLength={LIMITS.shortText} />
            <StringListField label="Tags / stack" values={item.stack} onChange={(stack) => update({ stack })} />
            <TextField label="Summary" value={item.excerpt} onChange={(excerpt) => update({ excerpt })} maxLength={LIMITS.mediumText} />
            <TextField
              label="Details"
              hint="Shown when the card is expanded"
              multiline
              value={item.details}
              onChange={(details) => update({ details })}
              maxLength={LIMITS.longText}
            />
            <ImageUrlsField images={item.images} onChange={(images) => update({ images })} />
          </>
        )}
      />
    </SectionEditor>
  );
}
