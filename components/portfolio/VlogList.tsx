"use client";

import { useState } from "react";
import { Button } from "@/components/core/Button";
import { PostCard } from "@/components/portfolio/PostCard";
import { posts } from "@/data/portfolio";

export function VlogList() {
  const [expanded, setExpanded] = useState(false);
  const visiblePosts = expanded ? posts : posts.slice(0, 3);

  return (
    <div className="rows">
      {visiblePosts.map((post) => (
        <PostCard
          key={post.title}
          date={post.date}
          category={post.category}
          title={post.title}
          excerpt={post.excerpt}
          details={post.details}
          likes={post.likes}
        />
      ))}
      {posts.length > 3 ? (
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
