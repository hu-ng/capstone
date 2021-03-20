// Signup page

import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { Grid, TextField, Button } from "@material-ui/core";
import axios from "axios";

const Signup = () => {
  const [isRegistered, setRegistered] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  function postSignup() {
    // Check password
    if (repeatPassword !== password) {
      setIsError(true);
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Request body
    const requestBody = {
      email: email,
      password: password,
    };

    // The API call to login and save request
    axios
      .post("/auth/register", requestBody)
      .then((result) => {
        if (result.status === 201) {
          setRegistered(true);
        } else {
          setIsError(true);
          setErrorMessage("Invalid information.");
        }
      })
      .catch((e) => {
        setIsError(true);
        setErrorMessage("Invalid information.");
      });
  }

  if (isRegistered) {
    return <Redirect to="/login" />;
  }

  // Returns a simple form to signup
  return (
    <Grid container justify="center" className="pt-5">
      <Grid item xs={3}>
        {isError && (
          <div style={{ color: "red" }}>Sign up failed: {errorMessage}</div>
        )}
        <form>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="filled"
            fullWidth
            className="pt-2"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="filled"
            fullWidth
            className="pt-2"
          />
          <TextField
            label="Repeated Password"
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            variant="filled"
            fullWidth
            className="pt-2"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            className="mt-2"
            onClick={(e) => {
              e.preventDefault();
              postSignup();
            }}
          >
            Sign Up
          </Button>
        </form>

        <Link to="/login" className="pt-2">
          Already have an account?
        </Link>
      </Grid>
    </Grid>
  );
};

export default Signup;
