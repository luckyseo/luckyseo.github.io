import { Button } from "@/components/core/Button";
import { profile } from "@/data/portfolio";

export function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container site-footer__inner">
        <div className="site-footer__copy">
          <span>Let's keep in touch (*'▽'*)</span>
          <Button variant="link" href="https://yunseo-park.github.io" target="_blank" rel="noopener">
            yunseo-park.github.io
          </Button>
        </div>
        <span className="site-footer__meta">
          {profile.location} · {profile.timezone}
        </span>
      </div>
    </footer>
  );
}
