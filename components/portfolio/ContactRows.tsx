import { Icon } from "@/components/core/Icon";
import { profile } from "@/data/portfolio";

const contacts = [
  { icon: "mail", label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: "at-sign", label: "LinkedIn", value: "linkedin.com/in/yunseo-park-profile", href: profile.linkedin },
  { icon: "github", label: "GitHub", value: "github.com/yourname", href: profile.github },
];

export function ContactRows() {
  return (
    <div className="contact-rows">
      {contacts.map((item) => (
        <a className="contact-row" href={item.href} key={item.label} target={item.href.startsWith("http") ? "_blank" : undefined}>
          <Icon name={item.icon} size={20} />
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </a>
      ))}
    </div>
  );
}
