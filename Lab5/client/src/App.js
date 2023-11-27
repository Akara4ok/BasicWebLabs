import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './Forms/LoginForm/LoginForm';
import RegisterForm from './Forms/RegisterForm/RegisterForm';
import Home from './Forms/Home/Home';
import React, { useState, useEffect } from 'react';

function App() {
  const [authFlag, setAuthFlag] = useState();

  useEffect(() => {
    setAuthFlag(localStorage.getItem('token') !== null);
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" exact element={authFlag ? <Home setAuthFlag={(flag) => setAuthFlag(flag)}/> : <LoginForm setAuthFlag={(flag) => setAuthFlag(flag)}/>} />
          <Route path="/register" exact element={<RegisterForm/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
