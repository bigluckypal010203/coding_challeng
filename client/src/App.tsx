import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Axios from "axios";

import { setToken, deletToken, initAxiosInterceptors } from "./helper/auth";
import Nav from "./components/Nav";
import Main from "./components/Main";
import Signup from "./views/Singup";
import Login from "./views/Login";
import User from "./components/UserClass";

initAxiosInterceptors();

const App = () => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await Axios.get("/api/users/whoami");
        const newUser = new User(
          data.user.username,
          data.user.email,
          undefined,
          data.user._id
        );

        setUser(newUser);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const signUp = async (user: User) => {
    const username = user.username;
    const email = user.email;
    const password = user.password;
    const { data } = await Axios.post("/api/users/signup", {
      username,
      email,
      password,
    });

    setToken(data.token);
  };

  const login = async (user: User) => {
    const password = user.password;
    const email = user.email;
    const { data } = await Axios.post("/api/users/login", {
      email,
      password,
    });
    const newUser: User = data.user;

    setUser(new User(newUser.username, newUser.email, undefined, newUser._id));
    setToken(data.token);
  };

  const logout = () => {
    deletToken();
    window.location.reload(false);
  };
  
  return (
    <Router>
      <Nav user={user || undefined} logout={logout} />
      <Switch>
        {user ? (
          <Route
            exact
            path="/home"
            render={() => (
              <Main center={false}>
                <h1>{`Welcome, ${user.username}!`}</h1>
              </Main>
            )}
          />
        ) : (
          <>
            <Route
              exact
              path="/"
              render={() => (
                <Main center={false}>
                  <h1>WELCOME!</h1>
                </Main>
              )}
            />
            <Route
              exact
              path="/signup"
              render={() => <Signup signUp={signUp} />}
            />
            <Route
              exact
              path="/signin"
              render={() => <Login login={login} />}
            />
          </>
        )}
      </Switch>
    </Router>
  );
};

export default App;
