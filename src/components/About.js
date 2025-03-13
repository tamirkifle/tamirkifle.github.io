import fancyDownArrow from "../images/fancy-down-arrow.png";
import TagCloud from "TagCloud";
import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    const container = ".tagcloud";
    const texts = [
      "AWS",
      "React",
      "Javascript",
      "Blockchain",
      "Redis",
      "RabbitMq",
      "Machine Learning",
      "Java",
      "Python",
      "Firestore",
      "HTML",
      "CSS",
      "Adobe Commerce",
      "Azure",
      "Google Cloud"
    ];

    const options = { radius: 200, maxSpeed: "fast", initSpeed: "fast" };
    TagCloud(container, texts, options);
  }, []);

  return (
    <section className="about" id="about">
      <div className="container split">
        <div className="text-container flow-content">
          <div className="about--intro flow-content">
            <h2 className="about--intro--name">
              👋 I'm <span>Tamir!</span>
            </h2>
            <p className="about--intro--subtitle">
              A <span className="highlight">full-stack</span>{" "}
              <span className="highlight">developer</span> based in{" "}
              <span className="highlight no-wrap">Seattle</span>,{" "}
              <span className="highlight">Washington</span>
            </p>
          </div>
          <p className="about--desc">
            Passionate about building scalable, distributed systems with a focus on quality, maintainability.
            <br /> Feel free to take a look at some of my work below.
          </p>
        </div>
        <img
          className="about--scroll-down floating"
          src={fancyDownArrow}
          alt="Scroll down"
        />
        <div className="tagcloud"></div>
      </div>
    </section>
  );
}
