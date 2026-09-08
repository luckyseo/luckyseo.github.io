"use client";

import { useState } from "react";
import { Button } from "@/components/core/Button";
import { IconButton } from "@/components/core/IconButton";

type HeaderProps = {
  dark: boolean;
  onToggleTheme: () => void;
  onOpenResume: () => void;
};

export function Header({ dark, onToggleTheme, onOpenResume }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobileNav() {
    setMobileOpen(false);
  }

  function openResumeFromMobile() {
    closeMobileNav();
    onOpenResume();
  }

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <span className="wordmark">Yunseo Park</span>
        <nav className="site-nav" aria-label="Main navigation">
          <div className="nav-links">
            <a href="#work">About</a>
            <a href="#vlog">Vlog</a>
            <a href="#reach">Contact</a>
            <IconButton
              name={dark ? "sun" : "moon"}
              label={dark ? "Switch to light mode" : "Switch to dark mode"}
              size="sm"
              onClick={onToggleTheme}
            />
            <Button size="sm" variant="outline" iconLeading="file-text" onClick={onOpenResume}>
              Request Résumé
            </Button>
          </div>
          <div className="nav-burger">
            <IconButton
              name={mobileOpen ? "x" : "menu"}
              label="Menu"
              size="sm"
              onClick={() => setMobileOpen((value) => !value)}
            />
          </div>
          <div className={mobileOpen ? "nav-panel open" : "nav-panel"}>
            <a href="#work" onClick={closeMobileNav}>
              My Journey
            </a>
            <a href="#vlog" onClick={closeMobileNav}>
              Vlog
            </a>
            <a href="#reach" onClick={closeMobileNav}>
              Contact
            </a>
            <div className="nav-panel__actions">
              <Button size="sm" variant="ghost" iconLeading={dark ? "sun" : "moon"} onClick={onToggleTheme}>
                Theme
              </Button>
              <Button size="sm" variant="outline" iconLeading="file-text" onClick={openResumeFromMobile}>
                Résumé
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
