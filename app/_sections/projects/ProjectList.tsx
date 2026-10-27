"use client";

import { useState } from "react";
import { Button } from "@/app/_components/core/Button";
import { PostCard } from "@/app/_components/post/PostCard";
import { useContent } from "@/services/content/ContentProvider";
import { sanitizeUrl } from "@/services/content/validation";

export function ProjectList() {
  const { projects } = useContent();
  const [expanded, setExpanded] = useState(false);
  const visibleProjects = expanded ? projects : projects.slice(0, 3);

  return (
    <div className="rows">
      {visibleProjects.map((project, index) => (
        <PostCard
          key={`${project.title}-${index}`}
          date={project.year}
          tags={project.stack}
          images={project.images.map((src) => sanitizeUrl(src, ["https:"]) ?? null)}
          title={project.title}
          excerpt={project.excerpt}
          details={project.details}
          showImage
          imageWidth={168}
          likes={project.likes}
        />
      ))}
      {projects.length > 3 ? (
        <div className="more-wrap">
          <Button
            type="button"
            variant="ghost"
            iconLeading={expanded ? "minus" : "plus"}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Fold" : "Show more"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
