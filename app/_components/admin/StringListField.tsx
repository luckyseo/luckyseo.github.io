"use client";

import { useId, useState } from "react";

type StringListFieldProps = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  hint?: string;
};

export function toLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Edits a list of short strings as a textarea with one entry per line. */
export function StringListField({ label, values, onChange, hint = "One per line" }: StringListFieldProps) {
  const id = useId();
  // Keep the raw text so blank lines can be typed while editing.
  const [text, setText] = useState(values.join("\n"));

  return (
    <div className="admin-field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        className="admin-field__input"
        rows={Math.max(3, values.length + 1)}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          onChange(toLines(event.target.value));
        }}
      />
      <small>{hint}</small>
    </div>
  );
}
