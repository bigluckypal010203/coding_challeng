import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import Main from "../components/Main";
import User from "../components/UserClass";

type singUpProps = {
  login: Function;
};

export default function Signup({ login }: singUpProps) {

  const historys = useHistory();

  const [user, setUser] = useState<User>({
    email: "",
    password: "",
    username: "",
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
    historys.push(path);
  };

  const sendDataToServer = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(user);
      redirect("/home");
    } catch (err) {
      setError(err.response.data.msg);
    }
  };

  return (
    <Main center={true}>
      <div className="Signup">
        <div className="FormContainer">
          <h1 className="Form__titulo">Sign In</h1>
          <p className="FormContainer__info">Sign in to coding challenge</p>
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
              type="password"
              name="password"
              placeholder="Password"
              className="Form__field"
              required
              onChange={getUserData}
              value={user.password}
            />
            <button className="Form__submit" type="submit">
              Sign In
            </button>
            <p className="FormContainer__info">
              You do not have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </Main>
  );
}
