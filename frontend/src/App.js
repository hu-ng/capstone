import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

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
  const existingTokens = JSON.parse(localStorage.getItem("jobfulTokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);
  const queryClient = new QueryClient();

  const setTokens = (data) => {
    localStorage.setItem("jobfulTokens", JSON.stringify(data));
    setAuthTokens(data);
  };

  // Logout if 401
  axios.interceptors.response.use(undefined, function clearAuthTokens(err) {
    if (
      err.response.status === 401 ||
      err.response.data.message === "401 Unauthorized"
    ) {
      setTokens("");
    }

    return Promise.reject(err);
  });

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router>
            <div>
              {/* Navbar */}
              <NavBar></NavBar>

              {/* Routes */}
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
            </div>
          </Router>
        </Provider>
        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}

export default App;
