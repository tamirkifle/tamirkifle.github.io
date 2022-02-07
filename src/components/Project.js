import { useState } from "react";
import Modal from "./utility/Modal";

export default function Project(props) {
  const coverImg = props.coverImg || "default.jpeg";
  const projectImg = require(`../images/projects/${coverImg}`);
  const styles = {
    backgroundImage: `url("${projectImg}")`,
  };

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal((prevShowModal) => !prevShowModal);

  return (
    <div className="card" style={styles}>
      <div className="card--info flow-content">
        <h3 className="card--info--title">{props.name}</h3>
        <p className="card--info--desc">{props.desc}</p>
        {/* <div className="card--info--tech-used">
          {props.tech.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div> */}
        <div className="card--info--actions">
          <button className="btn" onClick={toggleModal}>
            👁‍🗨 Preview
          </button>
          {props.github && (
            <a
              href={props.github}
              className="btn"
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Source Code
            </a>
          )}
          {props.hostedAt && (
            <a
              href={props.hostedAt}
              className="btn"
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Hosted Link
            </a>
          )}
        </div>
      </div>
      {showModal && (
        <Modal toggleModal={toggleModal}>
          <h1>{props.name}</h1>
          <button className="btn modal-close-btn" onClick={toggleModal}>
            Close Project
          </button>
        </Modal>
      )}
    </div>
  );
}
