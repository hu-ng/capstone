import { Paper, Grid, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import axios from "axios";
import EditJobForm from "./EditJobForm";
import JobTabs from "./JobTabs";

const useStyles = makeStyles({
  paper: {
    padding: "20px",
  },
});

// Main
const JobDetail = () => {
  const [editForm, setEditForm] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const job = useSelector((state) => state.selectedJob);

  const openEditForm = () => {
    setEditForm(true);
  };

  // Delete Job
  const onJobDelete = () => {
    const deleteJob = async () => {
      try {
        await axios.delete(`/jobs/${job.id}`);
        dispatch({ type: "SET_JOB", job: null });
        dispatch({ type: "REFRESH" });
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
        }
      }
    };

    deleteJob();
  };

  // TODO: Change things on the backend instead
  const statusToStr = (status) => {
    const mapping = ["Added", "Applied", "Interviewing", "Offer", "Rejected"];
    return mapping[Number(status)];
  };

  return (
    <Paper elevation={2} className={classes.paper}>
      <Grid container spacing={2} className="pb-4">
        <Grid item xs={12}>
          <Grid container>
            <Typography variant="h4" style={{ flexGrow: 1 }}>
              {job.company} - {statusToStr(job.status)}
            </Typography>

            {/* Edit the job */}
            <Button variant="contained" color="primary" onClick={openEditForm}>
              Edit Job
            </Button>

            <EditJobForm
              open={editForm}
              handler={setEditForm}
              job={job}
            ></EditJobForm>

            {/* Delete the job */}
            <Button variant="contained" color="secondary" onClick={onJobDelete}>
              Delete Job
            </Button>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">{job.title}</Typography>
        </Grid>
      </Grid>

      {/* Tabs */}
      <JobTabs></JobTabs>
    </Paper>
  );
};

export default JobDetail;
