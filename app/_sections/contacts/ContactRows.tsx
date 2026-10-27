"use client";

import { Icon } from "@/app/_components/core/Icon";
import { useContent } from "@/services/content/ContentProvider";
import { sanitizeUrl } from "@/services/content/validation";

export function ContactRows() {
  const { profile } = useContent();

  return (
    <div className="contact-rows">
      {profile.contacts.map((item, index) => {
        const href = sanitizeUrl(item.href);

        return (
          <a
            className="contact-row"
            href={href}
            key={`${item.label}-${index}`}
            target={href?.startsWith("https:") ? "_blank" : undefined}
            rel={href?.startsWith("https:") ? "noopener noreferrer" : undefined}
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </a>
        );
      })}
    </div>
  );
}
