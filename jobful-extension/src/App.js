// The heard of the extension code.
// Resuses a lot of the components written for the main app, but in a simplified manner.

import { useState } from "react";
import { useMutation } from "react-query";
import axios from "axios";

import "./App.css";
import { Grid } from "@material-ui/core";

import AddJobForm from "./components/AddJobForm";
import LoginForm from "./components/Login";
import AddSuccess from "./components/AddSuccess";

// Axios configs
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.headers.post["Content-Type"] = "application/json";

function App() {
  const existingTokens = JSON.parse(localStorage.getItem("jobfulTokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);

  // Init auth for axios after grabbing existing tokens
  axios.defaults.headers.common = {
    Authorization: `Bearer ${existingTokens.access_token}`,
  };

  // Func to set tokens in localStorage
  const setTokens = (data) => {
    localStorage.setItem("jobfulTokens", JSON.stringify(data));
    setAuthTokens(data);
  };

  // Query to create a new job
  const createJobMutation = useMutation((requestBody) =>
    axios.post("/jobs/", requestBody)
  );

  // If any request 401, something was wrong, return to login page
  axios.interceptors.response.use(undefined, function clearAuthTokens(err) {
    console.log(err);
    if (
      err.response.status === 401 ||
      err.response.data.message === "401 Unauthorized"
    ) {
      setTokens("");
    }
    return Promise.reject(err);
  });

  return (
    <div className="App">
      {createJobMutation.isSuccess ? (
        <AddSuccess action={createJobMutation}></AddSuccess>
      ) : authTokens ? (
        <Grid container justify="center">
          <Grid item>
            <AddJobForm createJobMutation={createJobMutation}></AddJobForm>
          </Grid>
        </Grid>
      ) : (
        <Grid container justify="center" alignItems="center">
          <Grid item xs={12}>
            <LoginForm setAuthTokens={setTokens}></LoginForm>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default App;
