import React from 'react';
import { useHistory } from 'react-router-dom';
import './Header.css'

export default function Header() {
  const history = useHistory();

  function handleOnClick() {
    history.push('/');
  }

  return (
      <h1 className='header' onClick={handleOnClick}>FSProj1</h1>
  );
}
