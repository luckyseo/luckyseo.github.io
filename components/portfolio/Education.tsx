import { Fragment } from "react";
import { education } from "@/data/portfolio";

export function Education() {
  return (
    <div className="rows rows--emphasis">
      {education.map((item) => (
        <article className="info-row" key={item.place}>
          <h3>{item.place}</h3>
          <p>
            {item.degree ? <strong>{item.degree}</strong> : null}
            {item.detail.map((line, index) => (
              <Fragment key={line}>
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
