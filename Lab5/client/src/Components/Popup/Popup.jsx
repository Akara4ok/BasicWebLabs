import React from 'react';
import Button from '../Button/Button';
import './Popup.css'

const Popup = ({ children, onClose }) => {
  return (
    <>
    <div className='popup-background'>
        <div className="popup">
            <p>{children}</p>
            <Button onClick={onClose}>Close</Button>
        </div>
    </div>
    </>
  );
};

export default Popup;