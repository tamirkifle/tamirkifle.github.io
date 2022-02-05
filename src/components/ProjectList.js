import Project from "./Project";
import projects from "../ProjectData";

export default function ProjectList() {
  return (
    <section className="portfolio" id="portfolio">
      <h2 className="portfolio--title">
        <span className="highlight">Featured Work</span>
      </h2>
      <div className="portfolio--projects flow-content">
        {projects.map((project) => (
          <Project key={project.name} {...project} />
        ))}
      </div>
    </section>
  );
}
