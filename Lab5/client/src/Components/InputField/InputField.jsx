import React from 'react';
import './InputField.css'

const InputField = ({ type, label, value, onChange }) => {
  return (
    <div className='input-field-class'>
      <label>
        <span>{label}:</span>
        <input type={type} value={value} onChange={onChange} placeholder={label}/>
      </label>
    </div>
  );
};

export default InputField;