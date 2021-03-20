// Simple home page. Not the main focus of this project.

import React from "react";
import { useAuth } from "../context/auth";
import { Redirect } from "react-router-dom";

// Redirects to dashboard if there is an auth token
function Home(props) {
  const { authTokens } = useAuth();

  if (authTokens) {
    return <Redirect to="/dashboard" />;
  }

  return <div>Welcome to Jobful!</div>;
}

export default Home;
