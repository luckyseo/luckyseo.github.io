"use client";

import { useId } from "react";
import { LIMITS, sanitizeUrl } from "@/services/content/validation";

type ImageUrlsFieldProps = {
  images: (string | null)[];
  onChange: (images: (string | null)[]) => void;
};

/** Fixed number of photo slots; an empty slot is stored as null. */
export function ImageUrlsField({ images, onChange }: ImageUrlsFieldProps) {
  const id = useId();
  const slots = Array.from({ length: LIMITS.images }, (_, index) => images[index] ?? null);

  function setSlot(index: number, url: string) {
    onChange(slots.map((current, position) => (position === index ? url.trim() || null : current)));
  }

  return (
    <fieldset className="admin-field admin-images">
      <legend>Photos</legend>
      <small>Paste public image links (https://). Leave a slot empty to skip it.</small>
      {slots.map((url, index) => {
        const preview = sanitizeUrl(url, ["https:"]);

        return (
          <div className="admin-images__slot" key={index}>
            <label htmlFor={`${id}-${index}`}>Photo {index + 1}</label>
            <input
              id={`${id}-${index}`}
              className="admin-field__input"
              type="url"
              value={url ?? ""}
              maxLength={LIMITS.url}
              placeholder="https://"
              onChange={(event) => setSlot(index, event.target.value)}
            />
            <span className="admin-images__preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {preview ? <img src={preview} alt="" referrerPolicy="no-referrer" /> : null}
            </span>
          </div>
        );
      })}
    </fieldset>
  );
}
