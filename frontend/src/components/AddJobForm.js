import React, { useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Button,
  DialogActions,
  TextField,
  MenuItem,
} from "@material-ui/core";

import axios from "axios";

import { useDispatch } from "react-redux";

const StatusList = {
  Added: "0",
  Applied: "1",
  Interviewing: "2",
  Offer: "3",
  Rejected: "4",
};

const AddJobForm = (props) => {
  const { open, setOpenForm } = props;
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [posting, setPosting] = useState("");
  const [postedDate, setPostedDate] = useState(new Date());
  const [status, setStatus] = useState("0");
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

  const handleDateChange = (date) => {
    setPostedDate(date);
  };

  const handleInputChange = (e, func) => {
    func(e.target.value);
  };

  const handleClose = () => {
    setOpenForm(false);
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
      posted_date: postedDate.toISOString(),
    };

    // Post data to the back-end
    const addJob = async () => {
      try {
        setError(false);
        const result = await axios.post("/jobs", requestBody);
        handleClose();
        dispatch({ type: "REFRESH" });
      } catch (error) {
        setError(true);
        if (error.response) {
          console.log(error.response.data);
        }
      }
    };

    // Call function to add job
    addJob();

    // Reset the form
    resetForm();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={"md"}>
      <DialogTitle>Add a New Position</DialogTitle>
      {/* Form Content */}
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {error && <div>Something went wrong...</div>}
            <form>
              <Grid container spacing={3}>
                {/* Job title */}
                <Grid item xs={6}>
                  <TextField
                    required
                    label="Title"
                    value={title}
                    onChange={(e) => handleInputChange(e, setTitle)}
                    fullWidth
                  />
                </Grid>

                {/* Company */}
                <Grid item xs={6}>
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
                <Grid item xs={6}>
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
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                {/* Status */}
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Status"
                    value={status}
                    onChange={(e) => handleInputChange(e, setStatus)}
                    fullWidth
                  >
                    {Object.entries(StatusList).map(([key, value]) => (
                      <MenuItem key={key} value={value}>
                        {key}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Actions */}
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        <Button onClick={onSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddJobForm;
