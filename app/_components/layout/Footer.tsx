"use client";

import { Button } from "@/app/_components/core/Button";
import { useContent } from "@/services/content/ContentProvider";

export function Footer() {
  const { profile } = useContent();
  return (
    <footer className="site-footer" id="contact">
      <div className="container site-footer__inner">
        <div className="site-footer__copy">
          <span>Let's keep in touch (*'▽'*)</span>
          <Button variant="link" href="https://luckyseo.github.io" target="_blank" rel="noopener">
            luckyseo.github.io
          </Button>
        </div>
        <span className="site-footer__meta">
          {profile.location} · {profile.timezone}
        </span>
      </div>
    </footer>
  );
}
