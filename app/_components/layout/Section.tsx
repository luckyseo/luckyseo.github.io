import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
};

export function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section className="container section" id={id}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      {title ? <h2 className="section-title">{title}</h2> : null}
      {children}
    </section>
  );
}
