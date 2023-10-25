import React from 'react';
import { useHistory } from 'react-router-dom';
import './Header.css'
import { useSelector } from 'react-redux';
import Navigation from '../Navigation';
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';
import { useState } from 'react';
import { useDispatch } from "react-redux";
import { useEffect } from 'react';
import * as sessionActions from '../../store/session'


export default function Header() {
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);


  function handleOnClick() {
    history.push('/');
  }

  const sessionUser = useSelector((state) => state.session.user);


  return (
    <div>
      <div  className='headerContainer'>
      <h1 className='header' onClick={handleOnClick}>FSProj1</h1>
      <div className='profileButtonAndLink'>
      {sessionUser && (
        <a className='headerLink' href='/groups/new'>Start a new group </a>
      )}
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch></Switch>}
      </div>
      </div>
    </div>

  );
}
