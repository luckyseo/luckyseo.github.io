"use client";

import { useId } from "react";

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  multiline?: boolean;
  placeholder?: string;
  hint?: string;
};

export function TextField({ label, value, onChange, maxLength, multiline, placeholder, hint }: TextFieldProps) {
  const id = useId();
  const shared = {
    id,
    value,
    maxLength,
    placeholder,
    className: "admin-field__input",
  };

  return (
    <div className="admin-field">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea {...shared} rows={5} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input {...shared} type="text" onChange={(event) => onChange(event.target.value)} />
      )}
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}
