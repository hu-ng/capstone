import React, { useState } from "react";
import axios from "axios";

import { Paper, Grid, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import EditJobForm from "./EditJobForm";
import JobTabs from "./JobTabs";
import { useMutation, useQueryClient } from "react-query";

const useStyles = makeStyles({
  paper: {
    padding: "20px",
  },
});

// Main
const JobDetail = (props) => {
  const { job } = props;
  const [editForm, setEditForm] = useState(false);
  const classes = useStyles();

  // React Query
  const queryClient = useQueryClient();
  const deleteJobMutation = useMutation(
    (jobId) => axios.delete(`/jobs/${jobId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("jobs", { exact: true });
      },
    }
  );

  // Helper to control open state of edit form
  const openEditForm = () => {
    setEditForm(true);
  };

  // Delete Job
  const onJobDelete = () => {
    deleteJobMutation.mutate(job.id);
  };

  // TODO: Change things on the backend instead
  const statusToStr = (status) => {
    const mapping = {
      0: "Added",
      1: "Applied",
      2: "Interviewing",
      3: "Offer",
      "-1": "Rejected",
    };
    return mapping[status];
  };

  return (
    <Paper elevation={2} className={classes.paper}>
      <Grid container spacing={2} className="pb-4">
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h4">
                {job.company} - {statusToStr(job.status)}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <div style={{ float: "right" }}>
                {/* Edit the job */}
                <span style={{ marginRight: 10 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={openEditForm}
                  >
                    Edit Job
                  </Button>
                </span>

                {/* Delete the job */}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={onJobDelete}
                >
                  Delete Job
                </Button>
              </div>

              <EditJobForm
                open={editForm}
                handler={setEditForm}
                job={job}
              ></EditJobForm>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">{job.title}</Typography>
        </Grid>
      </Grid>

      {/* Tabs */}
      <JobTabs job={job}></JobTabs>
    </Paper>
  );
};

export default JobDetail;
