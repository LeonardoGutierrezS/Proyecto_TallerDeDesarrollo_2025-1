import React from 'react';
import CloseIcon from '@assets/XIcon.svg';
import '@styles/popup.css';

const SimplePopup = ({ show, setShow, children, className = '' }) => {
  if (!show) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShow(false);
    }
  };

  return (
    <div className="bg" onClick={handleBackdropClick}>
      <div className={`popup ${className}`}>
        <div className="popup-header">
          <button 
            className="close-button" 
            onClick={() => setShow(false)}
            aria-label="Cerrar"
          >
            <img src={CloseIcon} alt="Cerrar" />
          </button>
        </div>
        <div className="popup-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SimplePopup;
