// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const isDisabled = 
  credential === "" || password === "" || credential.length < 4 || password.length < 6

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
    };

    const handleDemoLogin = async () => {
      setCredential('Demo-lition');
      setPassword('password');
      try {
        const response = await dispatch(sessionActions.login({ credential, password }));
        if (response.ok) {
          const data = await response.json();
        } else {
          console.error('Something went wrong');
        }
      } catch (error) {
        console.error('An error occurred during login:', error);
      }
    }

  return (
    <div className="loginStyle">
      <h1 className="loginTitle">Log In</h1>
      {errors.credential && (
          <p className="errors">{errors.credential}</p>
        )}
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            className="loginForm"
            placeholder="Username or Email"
          />
        </label>
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="loginForm"
            placeholder="Password"

          />
        </label>
        <button 
        type="submit"
        className={isDisabled ? 'disabledButton' :"loginButton"}
        disabled={isDisabled}
        >Log In</button>
        <div></div>
        <button className='loginButtonDemo'onClick={handleDemoLogin}>Log in as Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
