import React, { useEffect, useState } from "react";
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

const EditJobForm = (props) => {
  const { open, handler, job } = props;
  const [title, setTitle] = useState(props.job.title);
  const [company, setCompany] = useState(props.job.company);
  const [description, setDescription] = useState(job.description);
  const [posting, setPosting] = useState(job.posting);
  const [postedDate, setPostedDate] = useState(
    job.posted_date ? new Date(job.posted_date) : null
  );
  const [status, setStatus] = useState(job.status);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

  const handleDateChange = (date) => {
    setPostedDate(date);
  };

  const handleInputChange = (e, func) => {
    func(e.target.value);
  };

  const handleClose = () => {
    handler(false);
  };

  const resetForm = () => {
    setTitle(job.title);
    setCompany(job.company);
    setDescription(job.description);
    setPosting(job.posting);
    setPostedDate(job.posted_date ? new Date(job.posted_date) : null);
    setStatus(job.status);
  };

  const onSubmit = () => {
    // Form request body
    const requestBody = {
      title: title || null,
      description: description || null,
      company: company || null,
      status,
      posted_date: postedDate ? postedDate.toISOString() : null,
    };

    // Post data to the back-end
    const editJob = async () => {
      try {
        setError(false);
        const result = await axios.put(`/jobs/${job.id}/`, requestBody);
        dispatch({ type: "SET_JOB", job: result.data });
        dispatch({ type: "REFRESH" });
        handleClose();
      } catch (error) {
        setError(true);
        if (error.response) {
          console.log(error.response.data);
        }
      }
    };

    // Call function to add job
    editJob();

    // Reset the form
    resetForm();
  };

  useEffect(() => {
    resetForm();
  }, [job]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={"md"}>
      <DialogTitle>Edit this Position</DialogTitle>
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
                    margin="dense"
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

export default EditJobForm;