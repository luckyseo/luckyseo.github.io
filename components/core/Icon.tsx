"use client";

import { useEffect, useState, type CSSProperties } from "react";

type IconProps = {
  name: string;
  size?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
};

const iconCache = new Map<string, string>();

function sanitizeSvg(text: string) {
  let svg = text
    .trim()
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, "")
    .replace(/<title[\s\S]*?<\/title>/gi, "")
    .replace(/<desc[\s\S]*?<\/desc>/gi, "")
    .replace(/\sxmlns:[a-z0-9-]+="[^"]*"/gi, "")
    .trim();

  if (!svg.startsWith("<svg")) return "";

  if (!svg.includes('stroke="currentColor"')) {
    svg = svg.replace(/\sfill="(?!none|currentColor)[^"]*"/gi, ' fill="currentColor"');

    if (!svg.includes('fill="currentColor"')) {
      svg = svg.replace("<svg", '<svg fill="currentColor"');
    }
  }

  return svg;
}

export function Icon({ name, size = 18, label, className, style }: IconProps) {
  const sizeMarkup = (svg: string) =>
    svg.replace('width="24"', `width="${size}"`).replace('height="24"', `height="${size}"`);
  const [markup, setMarkup] = useState(() => sizeMarkup(iconCache.get(name) ?? ""));
  const iconStyle = {
    width: size,
    height: size,
    ...style,
  } as CSSProperties;

  useEffect(() => {
    let alive = true;

    if (iconCache.has(name)) {
      setMarkup(sizeMarkup(iconCache.get(name) ?? ""));
      return;
    }

    fetch(`/icons/${name}.svg`)
      .then((response) => (response.ok ? response.text() : ""))
      .then((text) => {
        const svg = sanitizeSvg(text);
        iconCache.set(name, svg);

        if (alive) {
          setMarkup(sizeMarkup(svg));
        }
      })
      .catch(() => {
        iconCache.set(name, "");
      });

    return () => {
      alive = false;
    };
  }, [name, size]);

  return (
    <span
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={className}
      role={label ? "img" : undefined}
      style={iconStyle}
      data-inline-icon
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
