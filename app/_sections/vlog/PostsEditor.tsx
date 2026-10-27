"use client";

import { useId } from "react";
import { ListEditor } from "@/app/_components/admin/ListEditor";
import { SectionEditor } from "@/app/_components/admin/SectionEditor";
import { TextField } from "@/app/_components/admin/TextField";
import { useSectionDraft, type EditorProps } from "@/app/_components/admin/useSectionDraft";
import type { Post } from "@/services/content/types";
import { LIMITS, postsSchema } from "@/services/content/validation";

// Categories with their own tag colour in PostCard.
const SUGGESTED_CATEGORIES = ["Working on", "Tech note", "Thought"];

function today() {
  return new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

function CategoryField({ value, onChange }: { value: string; onChange: (category: string) => void }) {
  const id = useId();

  return (
    <div className="admin-field">
      <label htmlFor={id}>Category</label>
      <input
        id={id}
        className="admin-field__input"
        list={`${id}-options`}
        value={value}
        maxLength={LIMITS.shortText}
        onChange={(event) => onChange(event.target.value)}
      />
      <datalist id={`${id}-options`}>
        {SUGGESTED_CATEGORIES.map((category) => (
          <option key={category} value={category} />
        ))}
      </datalist>
    </div>
  );
}

export function PostsEditor({ value, onSave }: EditorProps<Post[]>) {
  const draft = useSectionDraft(value, postsSchema, onSave);

  return (
    <SectionEditor title="Vlog posts" description="Newest first: the first three are shown before “Show more”." draft={draft}>
      <ListEditor
        items={draft.draft}
        onChange={draft.setDraft}
        createItem={() => ({ date: today(), category: "Thought", title: "", excerpt: "", details: "", likes: 0 })}
        itemLabel={(item) => item.title}
        addLabel="Add post"
        max={LIMITS.posts}
        renderItem={(item, update) => (
          <>
            <TextField label="Title" value={item.title} onChange={(title) => update({ title })} maxLength={LIMITS.shortText} />
            <TextField label="Date" value={item.date} onChange={(date) => update({ date })} maxLength={LIMITS.shortText} />
            <CategoryField value={item.category} onChange={(category) => update({ category })} />
            <TextField label="Summary" value={item.excerpt} onChange={(excerpt) => update({ excerpt })} maxLength={LIMITS.mediumText} />
            <TextField
              label="Full post"
              multiline
              value={item.details}
              onChange={(details) => update({ details })}
              maxLength={LIMITS.longText}
            />
          </>
        )}
      />
    </SectionEditor>
  );
}
