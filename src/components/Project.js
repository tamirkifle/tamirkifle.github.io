import { useState } from "react";
import Modal from "./utility/Modal";

export default function Project(props) {
  const coverImg = props.coverImg || "https://i.imgur.com/N02vRuT.jpg"; //default image for no cover
  const styles = {
    backgroundImage: `url("${coverImg}")`,
  };

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal((prevShowModal) => !prevShowModal);

  return (
    <div className="card" style={styles}>
      <div className="card--info flow-content">
        <h3 className="card--info--title">{props.name}</h3>
        <p className="card--info--desc">{props.desc}</p>
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
                <div
                  key={image}
                  className={image.includes("ipWdyxh.png") ? "phone" : ""} //add class to the only image that renders a phone
                >
                  <img
                    className="screenshot"
                    src={image}
                    alt={`${props.name}`}
                  />
                </div>
              ))}
            </div>
            <h4 className="modal--section-title">Summary: </h4>
            <p className="modal--text">{props.desc}</p>
            {props.responsibilities && (
              <>
                <h4 className="modal--section-title">Responsibilities</h4>
                <p className="modal--text">{props.responsibilities}</p>
              </>
            )}
            <h4 className="modal--section-title">Technologies Used</h4>
            <div className="modal--text">
              <ul>
                {props.tech.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>
            {(props.hostedAt || props.github) && (
              <h4 className="modal--section-title">Links</h4>
            )}
            <div className="modal--links split">
              {props.hostedAt && (
                <a
                  className="btn"
                  href={props.hostedAt}
                  target="_blank"
                  rel="noreferrer"
                >
                  Hosted
                </a>
              )}
              {props.github && (
                <a
                  className="btn"
                  href={props.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  Github
                </a>
              )}
            </div>
          </div>
          <button className="btn modal--close-btn" onClick={toggleModal}>
            Close Preview
          </button>
        </Modal>
      )}
    </div>
  );
}
