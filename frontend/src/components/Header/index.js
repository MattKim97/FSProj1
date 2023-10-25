import React from 'react';
import { useHistory } from 'react-router-dom';
import './Header.css'
import { useSelector } from 'react-redux';

export default function Header() {
  const history = useHistory();

  function handleOnClick() {
    history.push('/');
  }

  const sessionUser = useSelector((state) => state.session.user);


  return (
    <div>
      <div  className='headerContainer'>
      <h1 className='header' onClick={handleOnClick}>FSProj1</h1>
      {sessionUser && (
        <a className='headerLink' href='/groups/new'>Start a new group </a>
      )}
      </div>
    </div>

  );
}
