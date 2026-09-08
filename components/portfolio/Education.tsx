import { education } from "@/data/portfolio";

export function Education() {
  return (
    <div className="rows rows--emphasis">
      {education.map((item) => (
        <article className="info-row" key={item.place}>
          <h3>{item.place}</h3>
          <p>{item.detail}</p>
          <time>{item.date}</time>
        </article>
      ))}
    </div>
  );
}
