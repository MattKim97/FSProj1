// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };
  // if showMenu is already true just return otherwise set showMenu
  //to true

  useEffect(() => {
    if (!showMenu) return;
    //if showMenu is false immediately return out

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
        //In the closeMenu function change showMenu to false only if the target of the click event does NOT contain the HTML element of the dropdown menu.
      }
    };
    //otherwise add a listener to see if we click off our element to trigger close menu
    //which will setShowMenu to false which will close our menu element

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
    //cleanup function
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
    { showMenu && (  <ul className={ulClassName} ref={ulRef}>
        <li>{user.username}</li>
        <li>{user.firstName} {user.lastName}</li>
        <li>{user.email}</li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
      </ul>)}
    </>
  );
}

export default ProfileButton;
