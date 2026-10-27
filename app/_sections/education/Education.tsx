"use client";

import { Fragment } from "react";
import { useContent } from "@/services/content/ContentProvider";

export function Education() {
  const { education } = useContent();

  return (
    <div className="rows rows--emphasis">
      {education.map((item, itemIndex) => (
        <article className="info-row" key={`${item.place}-${itemIndex}`}>
          <h3>{item.place}</h3>
          <p>
            {item.degree ? <strong>{item.degree}</strong> : null}
            {item.detail.map((line, index) => (
              <Fragment key={`${line}-${index}`}>
                {item.degree || index > 0 ? <br /> : null}
                {line}
              </Fragment>
            ))}
          </p>
          <time>{item.date}</time>
        </article>
      ))}
    </div>
  );
}
