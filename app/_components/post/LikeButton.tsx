"use client";

import { useState } from "react";
import { cn } from "@/app/_components/cn";
import { useLike } from "@/services/likes/useLike";

/** Every click adds one like. Hidden until the count has loaded (or when Firebase is not set up). */
export function LikeButton({ likeId }: { likeId: string }) {
  const { ready, count, liked, like } = useLike(likeId);
  const [pressed, setPressed] = useState(false);

  if (!ready) return null;

  function handleClick(event: React.MouseEvent) {
    // The button sits inside the clickable card row: don't also expand the card.
    event.preventDefault();
    event.stopPropagation();
    void like();
    setPressed(true);
    window.setTimeout(() => setPressed(false), 260);
  }

  return (
    <button className={cn("like-button", liked && "like-button--liked")} onClick={handleClick} aria-label={`Like (${count} likes)`} type="button">
      <span className={cn("like-button__heart", pressed && "like-button__heart--pressed")}>{liked ? "♥" : "♡"}</span>
      {count}
    </button>
  );
}
