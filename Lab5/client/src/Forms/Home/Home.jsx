import React, { useState, useEffect } from 'react';
import Profile from '../Profile/Profile';
import Spinner from '../../Components/Spinner/Spinner';
import Popup from '../../Components/Popup/Popup';
import axios from 'axios';
import Button from '../../Components/Button/Button';
import './Home.css'

const Home = ({ setAuthFlag }) => {
  const [users, setUsers] = useState([]);
  const [mainId, setMainId] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState('');

  useEffect(() => {
    const token = "Bearer " + localStorage.getItem('token');
    axios({
      method: 'get',
      url: 'http://localhost:3001/users',
      headers: {
        authorization: token
      }
    }).then((response) => {
      setMainId(response.data._id);
      if (response.data.role === 'admin') {
        axios({
          method: 'get',
          url: 'http://localhost:3001/users/all',
          headers: {
            authorization: token
          }
        }).then(response2 => {
          setIsLoading(false);
          setUsers(response2.data);
        })
      } else {
        setIsLoading(false);
        setUsers([response.data]);
      }
    }).catch((error) => {
      setIsLoading(false);
      setErrorMsg(error.response.data);
    })
  }, [JSON.stringify(users)]);

  const logoutHandler = () => {
    localStorage.removeItem('token');
    setAuthFlag(false);
  }

  const changeUser = (id, newUser) => {
    const index = users.findIndex((user) => user._id === id);
    if(index === -1){
      return;
    }
    users[index] = {}
    setUsers([...users])
  }

  return (
    <div className='home-wrapper'>
      <Button onClick={() => logoutHandler()}>Logout</Button>
      {users.map((item, index) => (
          <Profile key={index} id={item._id || ''} fullname={item.name || ''} email={item.email || ''} role={item.role || ''}
                    group={item.group || ''} variant={item.variant || ''} isAdmin={mainId !== item._id || ''} changeUser={changeUser} />
      ))}
      {isLoading ? <Spinner /> : null}
      {errorMsg ? <Popup onClose={() => logoutHandler()}> {errorMsg} </Popup> : null}
    </div>
  );
};

export default Home;