import { useState } from "react";
import Modal from "./utility/Modal";

export default function Project(props) {
  const coverImg = props.coverImg || "https://i.imgur.com/N02vRuT.jpg"; //default image for no cover
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {setShowModal(true)};
  const closeModal = () => {setShowModal(false)};
  const scale = props.scale || 1.23;
  const color = props.color || "#ffffff";

  return (
    <div className="card">
      <div className="card--image" style={{ backgroundColor: color }}>
        <img 
          src={coverImg} 
          alt={props.name} 
          style={{ '--image-scale': scale }}
        />
      </div>
      <div className="card--info flow-content" onClick={openModal}>
        <h3 className="card--info--title">{props.name}</h3>
        <p className="card--info--desc">{props.desc}</p>
        <div className="card--info--tech-used">
          {props.tech.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <div className="card--info--actions">
          <button className="btn" onClick={openModal}>
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>Preview</span>
          </button>
          {props.github && (
            <a
              href={props.github}
              className="btn"
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>Source</span>
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
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
              <span>Live</span>
            </a>
          )}
        </div>
      </div>
      {showModal && (
        <Modal closeModal={closeModal}>
          <div className="flow-content">
            <h3 className="modal--title">{props.name}</h3>
            <div className="modal--images">
              {props.images.map((image) => (
                <div
                  key={image}
                  className={image.includes("ipWdyxh.png") ? "phone" : ""}
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
          <button className="btn modal--close-btn" onClick={closeModal}>
            Close Preview
          </button>
        </Modal>
      )}
    </div>
  );
}
