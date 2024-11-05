/**
 * This is a pop up modal component when users are on unsupported network
 */

import React from 'react';
import '../styles/Modal.css';

type ModalProps = {
  message: React.ReactNode;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal unsupported-network">
        <h3>Error</h3>
        <div className="close-button" onClick={onClose}>X</div>
        <div className="warning-icon">⚠️</div>
        <div className="modal-message">{message}</div>
      </div>
    </div>
  );
};

export default Modal;