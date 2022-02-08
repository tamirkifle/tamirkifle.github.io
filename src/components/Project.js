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
          <div className="flow-content">
            <h3 className="modal--title">{props.name}</h3>
            <div className="modal--images">
              {props.images.map((image) => (
                <div className={image.includes("phone") ? "phone" : ""}>
                  <img
                    className="screenshot"
                    src={require(`../images/projects/${image}`)}
                    alt={`${props.name}`}
                  />
                </div>
              ))}
            </div>
            <h4 className="modal--section-title">Summary: </h4>
            <p className="modal--text">{props.desc}</p>
            <h4 className="modal--section-title">Responsibilities</h4>
            <p className="modal--text">{props.responsibilities}</p>
            <h4 className="modal--section-title">Technologies Used</h4>
            <p className="modal--text">
              <ul>
                {props.tech.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </p>
            {(props.hostedAt || props.github) && (
              <h4 className="modal--section-title">Links</h4>
            )}
            {props.hostedAt && (
              <p className="modal--text">Hosted: {props.hostedAt}</p>
            )}
            {props.github && (
              <p className="modal--text">
                Github: {<a href={props.github}>{props.github}</a>}
              </p>
            )}
            {/* <h4 className="modal--section-title">Images</h4> */}
            <button className="btn modal--close-btn" onClick={toggleModal}>
              Close Preview
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
