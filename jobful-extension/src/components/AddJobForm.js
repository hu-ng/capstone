import React, { useState } from "react";
import axios from "axios";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { Grid, Button, TextField, MenuItem } from "@material-ui/core";

import DatetimeUtils from "../utils/datetime";

const StatusList = {
  Added: "0",
  Applied: "1",
  Interviewing: "2",
  Offer: "3",
  Rejected: "4",
};

const AddJobForm = (props) => {
  const { createJobMutation } = props;
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [posting, setPosting] = useState("");
  const [postedDate, setPostedDate] = useState(new Date());
  const [status, setStatus] = useState("0");

  const handleDateChange = (date) => {
    setPostedDate(date);
  };

  const handleInputChange = (e, func) => {
    func(e.target.value);
  };

  const resetForm = () => {
    setTitle("");
    setCompany("");
    setDescription("");
    setPosting("");
    setPostedDate(new Date());
    setStatus("0");
  };

  const onSubmit = () => {
    // Form request body
    const requestBody = {
      title: title || null,
      description: description || null,
      company: company || null,
      status,
      posted_date: DatetimeUtils.formatForDB(postedDate),
    };
    createJobMutation.mutate(requestBody);
    resetForm();
  };

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      direction="column"
      style={{ minHeight: "100vh" }}
      className="p-4"
    >
      <Grid item xs={12}>
        {/* If error, indicate error */}
        {createJobMutation.isError && <div>Something went wrong...</div>}
        {createJobMutation.isSuccess && <div>Job added!</div>}
        <form>
          <Grid container spacing={3}>
            {/* Job title */}
            <Grid item xs={12}>
              <TextField
                required
                label="Title"
                value={title}
                onChange={(e) => handleInputChange(e, setTitle)}
                fullWidth
              />
            </Grid>

            {/* Company */}
            <Grid item xs={12}>
              <TextField
                required
                label="Company"
                value={company}
                onChange={(e) => {
                  handleInputChange(e, setCompany);
                }}
                fullWidth
              />
            </Grid>

            {/* Job description */}
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => handleInputChange(e, setDescription)}
                fullWidth
                multiline
                rows={5}
              />
            </Grid>

            {/* Posting URL */}
            <Grid item xs={12}>
              <TextField
                label="Posting URL"
                value={posting}
                onChange={(e) => handleInputChange(e, setPosting)}
                fullWidth
              />
            </Grid>

            {/* Date picker */}
            <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  fullWidth
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="dense"
                  label="Posted Date"
                  value={postedDate}
                  onChange={handleDateChange}
                  autoOk
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <TextField
                select
                label="Status"
                value={status}
                onChange={(e) => handleInputChange(e, setStatus)}
                fullWidth
                margin="dense"
              >
                {Object.entries(StatusList).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {key}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Button onClick={onSubmit} color="primary" variant="contained">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default AddJobForm;
