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
        <p className="card--info--desc">{props.desc}</p>
        <div className="card--info--tech-used">
          {props.tech.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <div className="card--info--links">
          <a className="btn" onClick={toggleModal}>
            👁‍🗨 Preview
          </a>
          {props.github && (
            <a href={props.github} className="btn">
              Source Code
            </a>
          )}
          {props.hostedAt && (
            <a href={props.hostedAt} className="btn">
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
