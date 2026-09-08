"use client";

import { useState } from "react";
import { Icon } from "@/components/core/Icon";
import { Tag } from "@/components/core/Tag";
import { PhotoStrip } from "@/components/portfolio/PhotoStrip";
import { cn } from "@/lib/cn";

const CATEGORY_TONES: Record<string, "wine" | "pine" | "clay"> = {
  "Working on": "wine",
  "Tech note": "pine",
  Thought: "clay",
};

type PostCardProps = {
  title: string;
  excerpt?: string;
  date?: string;
  category?: string;
  tags?: string[];
  details?: string;
  images?: (string | null | undefined)[];
  showImage?: boolean;
  imageWidth?: number;
  likes?: number;
};

function realPhotos(images: (string | null | undefined)[] = []) {
  return images.filter((src): src is string => Boolean(src));
}

function LikeButton({ likes = 0 }: { likes?: number }) {
  const [liked, setLiked] = useState(false);
  const [pressed, setPressed] = useState(false);
  const total = likes + (liked ? 1 : 0);

  function toggle(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    setLiked((value) => !value);
    setPressed(true);
    window.setTimeout(() => setPressed(false), 260);
  }

  return (
    <button
      className={cn("like-button", liked && "like-button--liked")}
      onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? "Unlike this post" : "Like this post"}
      type="button"
    >
      <span className={cn("like-button__heart", pressed && "like-button__heart--pressed")}>
        {liked ? "♥" : "♡"}
      </span>
      {total}
    </button>
  );
}

function PhotoSlot({
  photos,
  reserveEmpty,
  width,
  title,
  onOpen,
}: {
  photos: string[];
  reserveEmpty?: boolean;
  width: number;
  title: string;
  onOpen: () => void;
}) {
  const isStack = photos.length > 1;
  if (!photos.length && !reserveEmpty) return null;

  function open(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    onOpen();
  }

  return (
    <div
      className="photo-slot"
      style={{ width }}
      onClick={isStack ? open : undefined}
      role={isStack ? "button" : undefined}
      tabIndex={isStack ? 0 : undefined}
      aria-label={isStack ? `View all ${photos.length} photos of ${title}` : undefined}
    >
      {isStack ? (
        <>
          <span className="photo-slot__leaf photo-slot__leaf--back" aria-hidden />
          <span className="photo-slot__leaf photo-slot__leaf--mid" aria-hidden />
        </>
      ) : null}
      <div className="photo-slot__frame">
        {photos[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photos[0]} alt="" />
        ) : (
          <span className="eyebrow photo-slot__placeholder">Image</span>
        )}
        {isStack ? (
          <span className="photo-slot__badge">
            <Icon name="copy" size={10} />
            {photos.length}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function PostCard({
  title,
  excerpt,
  date,
  category,
  tags = [],
  details,
  images = [],
  showImage,
  imageWidth = 112,
  likes = 0,
}: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [photosOpen, setPhotosOpen] = useState(false);

  const photos = realPhotos(images);
  const hasSlot = showImage || photos.length > 0;

  return (
    <div className="post-card">
      <div
        className={cn("post-card__row", hasSlot && "post-card__row--with-slot")}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setExpanded((value) => !value);
          }
        }}
      >
        <div className="post-card__copy">
          <div className="post-card__meta">
            {date ? <span className="post-card__date">{date}</span> : null}
            {category ? <Tag tone={CATEGORY_TONES[category] ?? "neutral"}>{category}</Tag> : null}
            {tags.map((tag) => (
              <Tag tone="ink" key={tag}>
                {tag}
              </Tag>
            ))}
          </div>
          <h3 className="post-card__title">
            <span>{title}</span>
          </h3>
          {excerpt ? <p className="post-card__excerpt">{excerpt}</p> : null}
          <LikeButton likes={likes} />
        </div>
        {hasSlot ? (
          <PhotoSlot
            photos={photos}
            reserveEmpty={showImage}
            width={imageWidth}
            title={title}
            onOpen={() => setPhotosOpen(true)}
          />
        ) : null}
        <Icon
          name="chevron-down"
          size={18}
          className={cn("post-card__affordance", expanded && "post-card__affordance--open")}
        />
      </div>
      <div className={cn("post-card__details", expanded && "post-card__details--open")}>
        {details ? <p>{details}</p> : null}
      </div>
      {photosOpen ? <PhotoStrip images={photos} title={title} onClose={() => setPhotosOpen(false)} /> : null}
    </div>
  );
}
