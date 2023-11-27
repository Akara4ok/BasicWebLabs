import React, { useState } from 'react';
import './RegisterForm.css'
import InputField from '../../Components/InputField/InputField';
import Button from '../../Components/Button/Button';
import { Outlet, Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import Popup from '../../Components/Popup/Popup';
import Spinner from '../../Components/Spinner/Spinner';

const RegisterForm = () => {
  const [emailValue, setEmail] = useState('');
  const [nameValue, setName] = useState('');
  const [groupValue, setGroup] = useState('');
  const [variantValue, setVariant] = useState('');
  const [passwordValue, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState('');

  let navigate = useNavigate(); 

  const handleSubmit = () => {
    setIsLoading(true);
    axios({
      method: 'post',
      url: 'http://localhost:3001/auth/register',
      data: {
        name: nameValue,
        password: passwordValue,
        email: emailValue,
        group: groupValue,
        variant: variantValue,
        role: 'user',
      }
    }).then((response) => {
      setIsLoading(false);
      setErrorMsg("Successful");
    }).catch((error) => {
      setIsLoading(false);
      setErrorMsg(error.response.data.message);
    })
  };

  const handleErrorMessage = () => {
    if(errorMsg === "Successful"){
      navigate("/");
    }
    setErrorMsg('');
  }

  return (
    <div className='register-wrapper'>
      <div className='registerHeader'> Register </div>
      <InputField type="text" label="Email" value={emailValue} onChange={(e) => setEmail(e.target.value)} />
      <InputField type="text" label="Name" value={nameValue} onChange={(e) => setName(e.target.value)} />
      <InputField type="text" label="Group" value={groupValue} onChange={(e) => setGroup(e.target.value)} />
      <InputField type="text" label="Variant" value={variantValue} onChange={(e) => setVariant(e.target.value)} />
      <InputField type="password" label="Password" value={passwordValue} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={handleSubmit}>Підтвердити</Button>
      <div className='loginFooter'> Do you have account? <Link to='/'>Sign in</Link> </div>
      {isLoading ? <Spinner/> : null}
      {errorMsg ? <Popup onClose={() => handleErrorMessage()}> {errorMsg} </Popup> : null}
      <Outlet />
    </div>
  );
};

export default RegisterForm;