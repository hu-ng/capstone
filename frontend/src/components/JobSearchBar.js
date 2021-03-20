// Search bar to help users filer through jobs.

import { TextField } from "@material-ui/core";
import React from "react";

const JobSearchBar = ({ keyword, handler }) => {
  return (
    <TextField
      fullWidth
      placeholder="Search jobs"
      variant="outlined"
      margin="dense"
      value={keyword}
      onChange={handler}
    ></TextField>
  );
};

export default JobSearchBar;
