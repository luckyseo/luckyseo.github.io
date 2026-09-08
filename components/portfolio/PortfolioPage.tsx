"use client";

import { useEffect, useState } from "react";
import { ContactRows } from "@/components/portfolio/ContactRows";
import { Education } from "@/components/portfolio/Education";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/portfolio/Hero";
import { ProjectList } from "@/components/portfolio/ProjectList";
import { ResumeDialog } from "@/components/portfolio/ResumeDialog";
import { Section } from "@/components/layout/Section";
import { VlogList } from "@/components/portfolio/VlogList";

export function PortfolioPage() {
  const [dark, setDark] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

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
      <main>
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
