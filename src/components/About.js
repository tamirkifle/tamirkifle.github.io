import TagCloud from "TagCloud";
import { useEffect, useRef } from "react";

export default function About() {
  const tagCloudRef = useRef(null);

  useEffect(() => {
    if (!tagCloudRef.current) return;

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
    TagCloud(tagCloudRef.current, texts, options);

    return () => {
      if (tagCloudRef.current) {
        tagCloudRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <section className="about" id="about">
      <div className="container split">
        <div className="text-container flow-content">
          <div className="about--intro flow-content">
            <h2 className="about--intro--name">
              Hi, I'm <span>Tamir</span>
            </h2>
            <p className="about--intro--subtitle">
              A <span className="highlight">full-stack</span>{" "}
              <span className="highlight">developer</span> based in{" "}
              <span className="highlight no-wrap">Seattle</span>,{" "}
              <span className="highlight">Washington</span>
            </p>
          </div>
          <p className="about--desc">
            Building scalable systems with clean, efficient code. 
            Check out my work below.
          </p>
        </div>
        <div className="tagcloud" ref={tagCloudRef}></div>
      </div>
    </section>
  );
}
