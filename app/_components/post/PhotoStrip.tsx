"use client";

import { useEffect, useRef } from "react";

type PhotoStripProps = {
  images: (string | null | undefined)[];
  title?: string;
  onClose: () => void;
};

export function PhotoStrip({ images, title, onClose }: PhotoStripProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      const el = scrollerRef.current;
      if (!el) return;
      if (event.key === "ArrowRight") el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
      if (event.key === "ArrowLeft") el.scrollBy({ left: -el.clientWidth * 0.8, behavior: "smooth" });
    }

    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  function onWheel(event: React.WheelEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    if (!el) return;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      el.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  }

  return (
    <div
      className="photo-strip-layer"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="photo-strip"
        role="dialog"
        aria-modal="true"
        aria-label={title ? `${title} — photos` : "Photos"}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="photo-strip__header">
          <span className="eyebrow">
            {title ? `${title} · ` : ""}
            {images.length} photos
          </span>
          <button className="photo-strip__close" onClick={onClose} aria-label="Close photos" type="button">
            ×
          </button>
        </div>
        <div className="photo-strip__scroller" ref={scrollerRef} onWheel={onWheel}>
          {images.map((src, index) => (
            <div className="photo-strip__frame" key={index}>
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt="" />
              ) : (
                <span className="eyebrow">Image {index + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
