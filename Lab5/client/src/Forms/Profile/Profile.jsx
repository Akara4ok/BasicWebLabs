import React, { useState, useEffect } from 'react';
import './Profile.css'
import Button from '../../Components/Button/Button';
import Spinner from '../../Components/Spinner/Spinner';
import Popup from '../../Components/Popup/Popup';
import axios from 'axios';
const Profile = ({ id, email, fullname, group, variant, role, isAdmin, changeUser }) => {
  const [idValue, setId] = useState('');
  const [emailValue, setEmail] = useState('');
  const [nameValue, setName] = useState('');
  const [groupValue, setGroup] = useState('');
  const [variantValue, setVariant] = useState('');

  useEffect(() => {
    setId(id);
    setEmail(email);
    setName(fullname);
    setGroup(group);
    setVariant(variant);
  }, [id, email, fullname, group, variant])

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [isEditing, setIsEditing] = useState('');

  const onDelete = () => {
    const token = "Bearer " + localStorage.getItem('token');
    axios({
      method: 'delete',
      url: 'http://localhost:3001/users/' + idValue,
      headers: {
        authorization: token
      }
    }).then((response) => {
      setIsLoading(false);
      setErrorMsg("Successful");
      changeUser(idValue, { email: emailValue, fullname: nameValue, group: groupValue, variant: variantValue })

    }).catch((error) => {
      setIsLoading(false);
      setErrorMsg(error.response.data.message);
    })
  }

  const onUpdate = () => {
    const token = "Bearer " + localStorage.getItem('token');
    axios({
      method: 'put',
      url: 'http://localhost:3001/users/' + idValue,
      headers: {
        authorization: token
      },
      data: {
        name: nameValue,
        email: emailValue,
        group: groupValue,
        variant: variantValue,
        role: role
      }
    }).then((response) => {
      setIsLoading(false);
      setErrorMsg("Successful");
      setIsEditing(false);
      changeUser(idValue, { email: emailValue, fullname: nameValue, group: groupValue, variant: variantValue })

    }).catch((error) => {
      setIsLoading(false);
      setErrorMsg(error.response.data.message);
    })
  }

  const handleErrorMessage = () => {
    if (errorMsg === "Successful") {
      changeUser(idValue, { email: emailValue, fullname: nameValue, group: groupValue, variant: variantValue })
    }
    setErrorMsg('');
  }

  return (
    <div className='profile-wrapper'>
      <div className='profile-header'>User Information:</div>
      <div className='record'>Name: {
        isEditing ? <input value={nameValue} onChange={(e) => setName(e.target.value)}/> :
          <div>{fullname}</div>
      }
      </div>
      <div className='record'>Email: {
        isEditing ? <input value={emailValue} onChange={(e) => setEmail(e.target.value)} /> :
          <div>{email}</div>
      }
      </div>
      <div className='record'>Group: {
        isEditing ? <input value={groupValue} onChange={(e) => setGroup(e.target.value)} /> :
          <div>{group}</div>
      }
      </div>
      <div className='record'>Variant: {
        isEditing ? <input value={variantValue} onChange={(e) => setVariant(e.target.value)} /> :
          <div>{variant}</div>
      }
      </div>
      <div className='button-wrapper'>
        {!isEditing ? <Button onClick={() => {setIsEditing(true)}}>Update</Button> : <Button onClick={() => {onUpdate()}}>Save</Button>}
        {isAdmin ? <Button onClick={onDelete}>Delete</Button> : null}
      </div>

      {isLoading ? <Spinner /> : null}
      {errorMsg ? <Popup onClose={() => { handleErrorMessage() }}> {errorMsg} </Popup> : null}
    </div>
  );
};

export default Profile;