"use client";

import { useId } from "react";
import { ListEditor } from "@/app/_components/admin/ListEditor";
import { SectionEditor } from "@/app/_components/admin/SectionEditor";
import { TextField } from "@/app/_components/admin/TextField";
import { useSectionDraft, type EditorProps } from "@/app/_components/admin/useSectionDraft";
import type { Contact, ContactIcon } from "@/services/content/types";
import { CONTACT_ICONS, contactsSchema, LIMITS } from "@/services/content/validation";

function IconSelect({ value, onChange }: { value: ContactIcon; onChange: (icon: ContactIcon) => void }) {
  const id = useId();

  return (
    <div className="admin-field">
      <label htmlFor={id}>Icon</label>
      <select id={id} className="admin-field__input" value={value} onChange={(event) => onChange(event.target.value as ContactIcon)}>
        {CONTACT_ICONS.map((icon) => (
          <option key={icon} value={icon}>
            {icon}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ContactsEditor({ value, onSave }: EditorProps<Contact[]>) {
  const draft = useSectionDraft(value, contactsSchema, onSave);

  return (
    <SectionEditor
      title="Contacts"
      description="The “Get in touch” rows. A contact labelled “LinkedIn” is also used by the résumé dialog."
      draft={draft}
    >
      <ListEditor
        items={draft.draft}
        onChange={draft.setDraft}
        createItem={(): Contact => ({ icon: "link", label: "", value: "", href: "https://" })}
        itemLabel={(item) => item.label}
        addLabel="Add contact"
        max={LIMITS.contacts}
        renderItem={(item, update) => (
          <>
            <IconSelect value={item.icon} onChange={(icon) => update({ icon })} />
            <TextField label="Label" value={item.label} onChange={(label) => update({ label })} maxLength={LIMITS.shortText} />
            <TextField
              label="Text shown"
              value={item.value}
              onChange={(text) => update({ value: text })}
              maxLength={LIMITS.shortText}
            />
            <TextField
              label="Link"
              hint="https://… or mailto:…"
              value={item.href}
              onChange={(href) => update({ href })}
              maxLength={LIMITS.url}
            />
          </>
        )}
      />
    </SectionEditor>
  );
}
