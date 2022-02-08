import fancyDownArrow from "../images/fancy-down-arrow.png";
import TagCloud from "TagCloud";
import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    const container = ".tagcloud";
    const texts = [
      "Angular",
      "React",
      "Javascript",
      "Azure",
      "AI",
      "Google Cloud",
      "Firebase",
      "Firestore",
      "HTML",
      "CSS",
    ];

    const options = { radius: 200, maxSpeed: "fast", initSpeed: "fast" };
    TagCloud(container, texts, options);
  }, []);

  return (
    <section className="about" id="about">
      <div className="container flow-content">
        <div className="about--intro flow-content">
          <h2 className="about--intro--name">
            Hi, <br />
            I'm <span>Tamir.</span>
          </h2>
          <p className="about--intro--subtitle">
            I am a <span className="highlight">front-end</span>{" "}
            <span className="highlight">developer</span> based in{" "}
            <span className="highlight no-wrap">Addis Ababa</span>,{" "}
            <span className="highlight">Ethiopia</span>
          </p>
        </div>
        <p className="about--desc">
          I build web applications focusing on quality and maintainabilty. Feel
          free to take a look at some of my work in my portfolio section below.
        </p>
      </div>
      <img
        className="about--scroll-down floating"
        src={fancyDownArrow}
        alt="Scroll down"
      />
      <div className="tagcloud"></div>
    </section>
  );
}
