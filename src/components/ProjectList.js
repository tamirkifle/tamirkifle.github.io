import Project from "./Project";
import projects from "../ProjectData";

export default function ProjectList() {
  return (
    <section className="portfolio" id="portfolio">
      <div className="container">
        <h2 className="portfolio--title">
          <span className="highlight">Selected Projects</span>
        </h2>
        <div className="portfolio--projects flow-content">
          {projects.map((project) => (
            <Project key={project.name} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
