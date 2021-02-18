import React, { useState } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import axios from "axios";

const qs = require("querystring");

const Login = (props) => {
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = props;

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
        } else {
          setIsError(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setIsError(true);
      });
  }

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      direction="column"
      style={{ minHeight: "100vh" }}
      className="px-2"
    >
      <Grid item xs={12}>
        <h2>Log in to get started</h2>
      </Grid>
      <Grid item xs={12}>
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
      </Grid>
    </Grid>
  );
};

export default Login;
