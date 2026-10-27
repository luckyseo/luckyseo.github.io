"use client";

import { useEffect, useState } from "react";
import { ContactRows } from "@/app/_sections/contacts/ContactRows";
import { Education } from "@/app/_sections/education/Education";
import { Footer } from "@/app/_components/layout/Footer";
import { Header } from "@/app/_components/layout/Header";
import { Hero } from "@/app/_sections/hero/Hero";
import { ProjectList } from "@/app/_sections/projects/ProjectList";
import { ResumeDialog } from "@/app/_sections/contacts/ResumeDialog";
import { Section } from "@/app/_components/layout/Section";
import { VlogList } from "@/app/_sections/vlog/VlogList";
import { useContent } from "@/services/content/ContentProvider";

export function PortfolioPage() {
  const [dark, setDark] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const { status } = useContent();

  useEffect(() => {
    const stored = window.localStorage.getItem("bonefold-portfolio-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(stored ? stored === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    window.localStorage.setItem("bonefold-portfolio-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="page-shell">
      <Header dark={dark} onToggleTheme={() => setDark((value) => !value)} onOpenResume={() => setResumeOpen(true)} />
      <main className="content-main" aria-busy={status === "loading"}>
        <Hero />
        <Section id="work" eyebrow="About" title="Education">
          <Education />
        </Section>
        <Section id="projects" eyebrow="Selected work" title="Projects">
          <ProjectList />
        </Section>
        <Section id="vlog" eyebrow="Vlog" title="Lately">
          <p className="section-lede">Thoughts, tech notes and what I am working on this week.</p>
          <VlogList />
        </Section>
        <Section id="reach" eyebrow="Get in touch">
          <ContactRows />
        </Section>
      </main>
      <Footer />
      <ResumeDialog open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}
