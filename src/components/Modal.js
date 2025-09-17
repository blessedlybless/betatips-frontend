import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ children, isOpen }) => {
  if (!isOpen) return null;

  // Render modal outside of normal component tree
  return ReactDOM.createPortal(
    children,
    document.body // This ensures it's rendered at the top level
  );
};

export default Modal;
