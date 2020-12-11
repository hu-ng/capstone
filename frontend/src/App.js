import React, { useState } from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NavBar from "./components/NavBar";
import { AuthContext } from "./context/auth";
import { Provider } from "react-redux";
import store from "./store";

import axios from "axios";

// Axios configs
axios.defaults.baseURL = `http://${window.location.hostname}:${8000}`;
axios.defaults.headers.post["Content-Type"] = "application/json";

function App(props) {
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  };

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Provider store={store}>
        <Router>
          <div>
            <NavBar></NavBar>

            {/* Routes */}
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
          </div>
        </Router>
      </Provider>
    </AuthContext.Provider>
  );
}

export default App;
