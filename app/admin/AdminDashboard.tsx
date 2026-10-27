"use client";

import { useMemo, useState } from "react";
import { cn } from "@/app/_components/cn";
import { BackupPanel } from "@/app/_sections/backup/BackupPanel";
import { ContactsEditor } from "@/app/_sections/contacts/ContactsEditor";
import { EducationEditor } from "@/app/_sections/education/EducationEditor";
import { InterestsEditor } from "@/app/_sections/hero/InterestsEditor";
import { pickProfileBasics, ProfileEditor } from "@/app/_sections/hero/ProfileEditor";
import { ProjectsEditor } from "@/app/_sections/projects/ProjectsEditor";
import { PostsEditor } from "@/app/_sections/vlog/PostsEditor";
import { useContent, useSaveSection } from "@/services/content/ContentProvider";

const TABS = ["Profile", "Interests", "Contacts", "Education", "Projects", "Vlog", "Backup"] as const;
type Tab = (typeof TABS)[number];

export function AdminDashboard() {
  const { status, profile, education, projects, posts } = useContent();
  const saveSection = useSaveSection();
  const [tab, setTab] = useState<Tab>("Profile");

  // Interests and contacts are stored in the profile document,
  // so each of those editors saves its part merged into the latest profile.
  const basics = useMemo(() => pickProfileBasics(profile), [profile]);
  const content = { profile, education, projects, posts };

  if (status === "loading") return <p className="admin-gate">Loading content…</p>;
  if (status === "error") return <p className="admin-gate">Could not load content. Check the console and your Firebase setup.</p>;

  return (
    <div className="admin-dashboard">
      <nav className="admin-tabs" aria-label="Sections">
        {TABS.map((name) => (
          <button
            key={name}
            type="button"
            className={cn("admin-tabs__tab", tab === name && "admin-tabs__tab--active")}
            aria-current={tab === name ? "page" : undefined}
            onClick={() => setTab(name)}
          >
            {name}
          </button>
        ))}
      </nav>

      {tab === "Profile" ? <ProfileEditor value={basics} onSave={(value) => saveSection("profile", { ...profile, ...value })} /> : null}
      {tab === "Interests" ? (
        <InterestsEditor value={profile.interests} onSave={(value) => saveSection("profile", { ...profile, interests: value })} />
      ) : null}
      {tab === "Contacts" ? (
        <ContactsEditor value={profile.contacts} onSave={(value) => saveSection("profile", { ...profile, contacts: value })} />
      ) : null}
      {tab === "Education" ? <EducationEditor value={education} onSave={(value) => saveSection("education", value)} /> : null}
      {tab === "Projects" ? <ProjectsEditor value={projects} onSave={(value) => saveSection("projects", value)} /> : null}
      {tab === "Vlog" ? <PostsEditor value={posts} onSave={(value) => saveSection("posts", value)} /> : null}
      {tab === "Backup" ? <BackupPanel content={content} saveSection={saveSection} /> : null}
    </div>
  );
}
