import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import Main from "../components/Main";
import User from "../components/UserClass";

type signUpProps = {
  signUp: Function;
};

export default function Signup({ signUp }: signUpProps) {
  const history = useHistory();

  const [user, setUser] = useState<User>({
    email: "",
    username: "",
    password: "",
    _id: undefined,
  });

  const [error, setError] = useState<String | undefined>();

  const getUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const redirect = (path: string) => {
    history.push(path);
  };

  const sendDataToServer = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signUp(user);
      redirect("/signin");
    } catch (err) {
      setError(err.response.data.msg);
    }
  };

  return (
    <Main center={true}>
      <div className="Signup">
        <div className="FormContainer">
          <h1 className="Form__titulo">Sign Up</h1>
          <p className="FormContainer__info">Sign up to coding challenge</p>
          {error && <div className="error_msg">{error}</div>}
          <form onSubmit={sendDataToServer}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="Form__field"
              required
              onChange={getUserData}
              value={user.email}
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="Form__field"
              required
              onChange={getUserData}
              value={user.username}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="Form__field"
              required
              onChange={getUserData}
              value={user.password}
            />
            <button className="Form__submit" type="submit">
              Sign up
            </button>
            <p className="FormContainer__info">
              Do you have a account? <Link to="/signin">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </Main>
  );
}
