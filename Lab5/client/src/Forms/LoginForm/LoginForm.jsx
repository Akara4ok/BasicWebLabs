import React, { useState } from 'react';
import './LoginForm.css'
import InputField from '../../Components/InputField/InputField';
import Button from '../../Components/Button/Button';
import { Outlet, Link } from "react-router-dom";
import Spinner from '../../Components/Spinner/Spinner';
import Popup from '../../Components/Popup/Popup';
import axios from 'axios';

const LoginForm = ({setAuthFlag}) => {
  const [emailValue, setEmail] = useState('');
  const [passwordValue, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState('');

  const handleSubmit = () => {
    setIsLoading(true);
    axios({
      method: 'post',
      url: 'http://localhost:3001/auth/login',
      data: {
        email: emailValue,
        password: passwordValue,
      }
    }).then((response) => {
      setIsLoading(false);
      localStorage.setItem('token', response.data.token);
      setAuthFlag(true);
    }).catch((error) => {
      setIsLoading(false);
      setErrorMsg(error.response.data.message);
    })
  };

  return (
    <div className='login-wrapper'>
      <div className='loginHeader'> Login </div>
        <InputField type="text" label="Email" value={emailValue} onChange={(e) => setEmail(e.target.value)} />
        <InputField type="password" label="Password" value={passwordValue} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={handleSubmit}>Підтвердити</Button>
      <div className='loginFooter'> If does not have account <Link to='/register'>Sign up</Link> </div>
      {isLoading ? <Spinner/> : null}
      {errorMsg ? <Popup onClose={() => {setErrorMsg('')}}> {errorMsg} </Popup> : null}
      <Outlet/>
    </div>
  );
};

export default LoginForm;