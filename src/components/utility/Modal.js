import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const modalRoot = document.getElementById("modal");
const Modal = ({ children, closeModal }) => {
  const elRef = useRef(null);
  if (!elRef.current) {
    elRef.current = document.createElement("div");
    elRef.current.classList.add("modal--container");
  }

  const handleEscKeyPress = (event) => {
    if (event.key === 'Escape') {
      closeModal()
    }
  };

  useEffect(() => {
    modalRoot.appendChild(elRef.current);
    return () => modalRoot.removeChild(elRef.current);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleEscKeyPress);
    return () => {
      document.removeEventListener('keydown', handleEscKeyPress);
    };
  }, []);

  return createPortal(
    <>
      <div className="modal--overlay" onClick={closeModal}></div>
      <div className="modal--box">{children}</div>
    </>,
    elRef.current
  );
};

export default Modal;
