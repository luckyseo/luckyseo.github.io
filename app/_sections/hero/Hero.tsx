"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/app/_components/core/Badge";
import { useContent } from "@/services/content/ContentProvider";
import { Turntable } from "@/app/_sections/hero/Turntable";

export function Hero() {
  const { profile } = useContent();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!heading || reduceMotion) return;

    const currentHeading = heading;

    const radius = 260;
    const pull = 22;
    const lift = 10;

    function moveWords(event: MouseEvent) {
      const words = currentHeading.querySelectorAll<HTMLElement>(".hero-word");

      words.forEach((word) => {
        const rect = word.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);
        const falloff = Math.max(0, 1 - distance / radius);
        const eased = falloff * falloff;

        word.style.transform = `translate(${(dx / radius) * pull * eased}px, ${
          (dy / radius) * pull * eased - lift * eased
        }px) rotate(${(dx / radius) * 4 * eased}deg) scale(${1 + 0.06 * eased})`;
      });
    }

    function resetWords() {
      currentHeading.querySelectorAll<HTMLElement>(".hero-word").forEach((word) => {
        word.style.transform = "";
      });
    }

    window.addEventListener("mousemove", moveWords, { passive: true });
    currentHeading.addEventListener("mouseleave", resetWords);

    return () => {
      window.removeEventListener("mousemove", moveWords);
      currentHeading.removeEventListener("mouseleave", resetWords);
    };
  }, []);

  return (
    <section className="container hero" id="top">
      <div className="hero__grid">
        <div>
          <Badge tone="good" dot quiet>
            {profile.availability}
          </Badge>
          <h1 ref={headingRef} className="hero__title" aria-label={`Hi! I'm ${profile.shortName}, Nice to meet you`}>
            {["Hi!", "I'm"].map((word) => (
              <span className="hero-word" key={word}>
                {word}
              </span>
            ))}
            <span className="hero-word hero-word--highlight">{profile.shortName},</span>
            <br />
            {["Nice", "to", "meet", "you"].map((word) => (
              <span className="hero-word" key={word}>
                {word}
              </span>
            ))}
          </h1>
          <p className="hero__intro">
            <i>{profile.intro}</i>
          </p>
          <div className="interests" aria-label="Into lately">
            <span className="eyebrow">Into lately</span>
            <div className="interests__list">
              {profile.interests.map((interest, index) => (
                <span className="interest-chip" key={`${interest.label}-${index}`}>
                  <span aria-hidden>{interest.icon}</span>
                  {interest.label}
                </span>
              ))}
            </div>
            <p className="interests__note">Text emoji adds more personality ʕ̡̢̡◌･ꄃ･◌ʔ̢̡̢˞͛</p>
          </div>
        </div>
        <Turntable />
      </div>
    </section>
  );
}
