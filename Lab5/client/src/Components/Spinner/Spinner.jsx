import React from 'react';
import './Spinner.css'
const Spinner = () => {
  return (
    <>
    <div className="spinner-background">
        <div className="lds-default">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    </>
  );
};

export default Spinner;