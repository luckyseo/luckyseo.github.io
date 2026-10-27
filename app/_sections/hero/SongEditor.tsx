"use client";

import { useId, useState } from "react";
import { SectionEditor } from "@/app/_components/admin/SectionEditor";
import { TextField } from "@/app/_components/admin/TextField";
import { useSectionDraft, type EditorProps } from "@/app/_components/admin/useSectionDraft";
import type { Song } from "@/services/content/types";
import { LIMITS, parseYouTubeId, songSchema } from "@/services/content/validation";

/** Accepts a pasted YouTube link and keeps only the video ID. */
function YouTubeField({ youtubeId, onChange }: { youtubeId: string; onChange: (youtubeId: string) => void }) {
  const id = useId();
  // Show what was pasted; store the parsed ID (or the raw text, so validation can flag it).
  const [text, setText] = useState(youtubeId ? `https://youtu.be/${youtubeId}` : "");
  const parsed = parseYouTubeId(text);

  return (
    <div className="admin-field">
      <label htmlFor={id}>YouTube link</label>
      <input
        id={id}
        className="admin-field__input"
        type="url"
        value={text}
        maxLength={LIMITS.url}
        placeholder="https://www.youtube.com/watch?v=…"
        onChange={(event) => {
          setText(event.target.value);
          onChange(parseYouTubeId(event.target.value) ?? event.target.value.trim());
        }}
      />
      <small>Leave empty for no music. Some videos block embedding; if it won&apos;t play, try another upload of the song.</small>
      {parsed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="admin-song__thumb" src={`https://i.ytimg.com/vi/${parsed}/mqdefault.jpg`} alt="" referrerPolicy="no-referrer" />
      ) : null}
    </div>
  );
}

export function SongEditor({ value, onSave }: EditorProps<Song>) {
  const draft = useSectionDraft(value, songSchema, onSave);
  const set = (patch: Partial<Song>) => draft.setDraft({ ...draft.draft, ...patch });

  return (
    <SectionEditor title="Song" description="What the turntable plays." draft={draft}>
      <TextField label="Title" value={draft.draft.title} onChange={(title) => set({ title })} maxLength={LIMITS.shortText} />
      <TextField label="Artist" value={draft.draft.artist} onChange={(artist) => set({ artist })} maxLength={LIMITS.shortText} />
      <YouTubeField youtubeId={draft.draft.youtubeId} onChange={(youtubeId) => set({ youtubeId })} />
    </SectionEditor>
  );
}
