import React from "react";
import { Link } from "react-router-dom";
import User from "./UserClass";

type NavProps = {
  user: User | undefined;
  logout: Function;
};

const Nav = ({ user, logout }: NavProps) => {
  const getUserData = (e: any) => {
    e.preventDefault();
    logout();
  };

  return (
    <nav className="Nav">
      <ul className="Nav__links">
        <li>
          <Link to="/" className="Nav__link__tittle">
            Coding Challenge
          </Link>
        </li>
        {user ? (
          <li className="Nav__link-push">
            <button onClick={getUserData}>
              <Link to="/" className="Nav__link__LogOut">
                <p>Logout</p>
              </Link>
            </button>
          </li>
        ) : (
          <>
            <li className="Nav__link-push">
              <Link to="/signup" className="Nav__link">
                <p>Sign Up</p>
              </Link>
            </li>
            /
            <li className="Nav__link-left">
              <Link to="/signin" className="Nav__link">
                <p>Sign In</p>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
export default Nav;
