import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import './Navigation.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();


  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push('/');
  };

  const  handleOnClick = () => {
    history.push(`/groups`);
  }

  const handleOnClickEvent = () => {
    history.push(`/events`);

  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button  className='roundedButton' onClick={openMenu}>
        <i className="fa-solid fa-bars" style={{color:'#FF5A5F'}}></i>
        <i className="fas fa-user-circle userIcon" style={{color:'#FF5A5F'}} />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>Hello, {user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            <li className='navPointers' onClick={() => handleOnClick()}>See all groups</li>
            <li className='navPointers' onClick={() => handleOnClickEvent()}>View Events</li>
            <li>
              <button className='navPointers' onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <div className="navPointers"
          style={{ display:'flex', flexDirection:'column', alignItems: 'center' , marginRight:'35px', marginBottom:'10px', gap:'5px'}}
          >
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
              className="navPointers"
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
              className="navPointers"
            />
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
