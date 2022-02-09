import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const modalRoot = document.getElementById("modal");
const Modal = ({ children, toggleModal }) => {
  const elRef = useRef(null);
  if (!elRef.current) {
    elRef.current = document.createElement("div");
    elRef.current.classList.add("modal--container");
  }

  useEffect(() => {
    modalRoot.appendChild(elRef.current);
    return () => modalRoot.removeChild(elRef.current);
  }, []);

  return createPortal(
    <>
      <div className="modal--overlay" onClick={toggleModal}></div>
      <div className="modal--box">{children}</div>
    </>,
    elRef.current
  );
};

export default Modal;
