// Login page

import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { Grid, TextField, Button } from "@material-ui/core";
import { useAuth } from "../context/auth";
import axios from "axios";

const qs = require("querystring");

const Login = (props) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuth();

  function postLogin() {
    // Config for the login
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    // Request body
    const requestBody = {
      username: userName,
      password: password,
    };

    // The API call to login and save request
    axios
      .post("/auth/jwt/login", qs.stringify(requestBody), config)
      .then((result) => {
        if (result.status === 200) {
          setAuthTokens(result.data);
          setLoggedIn(true);
        } else {
          setIsError(true);
        }
      })
      .catch((e) => {
        setIsError(true);
      });
  }

  if (isLoggedIn) {
    return <Redirect to="/dashboard" />;
  }

  // Returns a simple form to login
  return (
    <Grid container justify="center" className="pt-5">
      <Grid item xs={3}>
        {isError && (
          <div style={{ color: "red" }}>Incorrect email or password.</div>
        )}

        <form>
          <TextField
            label="Email"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            variant="filled"
            fullWidth
            className="pt-2"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            variant="filled"
            fullWidth
            className="pt-2"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              postLogin();
            }}
            fullWidth
            className="mt-2"
          >
            Sign In
          </Button>
        </form>

        <Link to="/signup" className="pt-2">
          Don't have an account?
        </Link>
      </Grid>
    </Grid>
  );
};

export default Login;
