"use client";

import { useState } from "react";
import { Button } from "@/components/core/Button";
import { PostCard } from "@/components/portfolio/PostCard";
import { projects } from "@/data/portfolio";

export function ProjectList() {
  const [expanded, setExpanded] = useState(false);
  const visibleProjects = expanded ? projects : projects.slice(0, 3);

  return (
    <div className="rows">
      {visibleProjects.map((project) => (
        <PostCard
          key={project.title}
          date={project.year}
          tags={project.stack}
          images={project.images}
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
