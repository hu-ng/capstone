// Simple nav bar. Reacts to auth/no auth state.

import React from "react";
import { AppBar, Toolbar, Typography, Button, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";

function NavBar() {
  const { authTokens, setAuthTokens } = useAuth();

  const logOut = () => {
    setAuthTokens("");
  };

  const userActions = authTokens ? (
    <Grid item>
      {/* Logout */}
      <Button color="inherit" onClick={logOut}>
        Log Out
      </Button>
    </Grid>
  ) : (
    <Grid item>
      {/* Login */}
      <Button color="inherit">
        <Link
          to="/login"
          className="text-decoration-none"
          style={{ color: "white" }}
        >
          Login
        </Link>
      </Button>
      {/* Signup */}
      <Button color="inherit">
        <Link
          to="/signup"
          className="text-decoration-none"
          style={{ color: "white" }}
        >
          Sign up
        </Link>
      </Button>
    </Grid>
  );

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Grid container justify="space-between">
            <Grid item>
              <Typography
                variant="h6"
                style={{ display: "inline-block", paddingRight: "16px" }}
              >
                Jobful
              </Typography>
              <Button color="inherit">
                <Link
                  to="/dashboard"
                  className="text-decoration-none"
                  style={{ color: "white" }}
                >
                  Dashboard
                </Link>
              </Button>
            </Grid>

            {userActions}
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBar;
