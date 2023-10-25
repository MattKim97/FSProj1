import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";
import {
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";

function SignupFormModal() {
  const history = useHistory()
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const isDisabled =
  email === "" ||
  password === "" ||
  username === "" ||
  firstName === "" ||
  lastName === "" ||
  username.length < 4 ||
  password.length < 6 ||
  password !== confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    history.push('/')
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className="loginStyle"> 
      <h1 className="loginTitle">Sign Up</h1>
      <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="loginForm"
            placeholder="Email"

          />
        {errors.email && <p className="errors">{errors.email}</p>}
  
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="loginForm"
            placeholder="Username"
          />
        {errors.username && <p className="errors">{errors.username}</p>}
          
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="loginForm"
            placeholder="First Name"


          />
        {errors.firstName && <p className="errors">{errors.firstName}</p>}
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="loginForm"
            placeholder="Last Name"

          />
        {errors.lastName && <p className="errors">{errors.lastName}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="loginForm"
            placeholder="Password"

          />
        {errors.password && <p className="errors">{errors.password}</p>}
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="loginForm"
            placeholder="Confirm Password"

          />
        {errors.confirmPassword && (
          <p className="errors">{errors.confirmPassword}</p>
        )}
        <button 
        type="submit"
        //I dunno about this lol
        disabled={isDisabled}
        className={isDisabled ? 'disabledButton' :"loginButton"}
        >Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
