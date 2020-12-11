import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from "../context/auth";
import axios from "axios";
import { Grid, Card, Typography, Button } from "@material-ui/core";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import JobForm from "../components/AddJobForm";
import JobDetail from "../components/JobDetail";

import { useSelector, useDispatch } from "react-redux";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function Dashboard() {
  const { authTokens } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [jobHovered, setJobHovered] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const refresh = useSelector((state) => state.refresh);
  const selectedJob = useSelector((state) => state.selectedJob);
  const dispatch = useDispatch();

  axios.defaults.headers.common = {
    Authorization: `Bearer ${authTokens.access_token}`,
  };

  const classes = useStyles();

  // Helper function turning date to str
  const dateToStr = (str) => {
    if (str) {
      const date = new Date(str);
      return date.toDateString();
    }
  };

  // Get job object matching the id
  const getJobData = (id) => {
    return jobs.find((job) => job.id === id);
  };

  // Select a job
  const onJobSelect = (e, jobId) => {
    if (selectedJob && jobId === selectedJob.id) {
      dispatch({ type: "SET_JOB", job: null });
    } else {
      dispatch({ type: "SET_JOB", job: getJobData(jobId) });
    }
  };

  // Open form to add a new job
  const openJobForm = (e) => {
    setOpenForm(true);
  };

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      console.log("fetch jobs");
      setIsError(false);
      setIsLoading(true);

      // Get data
      const result = await axios.get("/jobs");
      setJobs(result.data);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      if (error.response) {
        console.log(error.response.data);
      }
      console.log(error.response);
    }
  };

  // Hook to fetch data on component mount and when form is closed
  useEffect(() => {
    fetchJobs();
  }, [refresh]);

  return (
    <div>
      {isError && <div>Something went wrong ...</div>}
      {isLoading && <div>Loading...</div>}

      <Grid container spacing={5} className="pt-5 px-4">
        {/* List of jobs */}
        <Grid item xs={5}>
          <Grid container>
            <Typography
              variant="h4"
              style={{ display: "inline-block", flexGrow: 1 }}
            >
              Pipeline
            </Typography>
            <Button variant="contained" color="primary" onClick={openJobForm}>
              New Job
            </Button>

            <JobForm open={openForm} setOpenForm={setOpenForm}></JobForm>
          </Grid>
          <TableContainer component={Card}>
            <Table className={classes.table} aria-label="Jobs Table">
              <TableHead>
                <TableRow>
                  <TableCell>Company Name</TableCell>
                  <TableCell align="right">Position</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Added Date</TableCell>
                  <TableCell align="right">Posted Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow
                    key={job.id}
                    onClick={(e) => onJobSelect(e, job.id)}
                    selected={selectedJob ? job.id === selectedJob.id : false}
                    onMouseEnter={(e) => setJobHovered(job.id)}
                    omMouseLeave={(e) => setJobHovered("")}
                    hover={job.id === jobHovered}
                  >
                    <TableCell component="th" scope="row">
                      {job.company}
                    </TableCell>
                    <TableCell align="right">{job.title}</TableCell>
                    <TableCell align="right">{job.status}</TableCell>
                    <TableCell align="right">
                      {dateToStr(job.added_date)}
                    </TableCell>
                    <TableCell align="right">
                      {dateToStr(job.posted_date)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Individual job views */}
        {selectedJob && (
          <Grid item xs={7}>
            <JobDetail></JobDetail>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default Dashboard;
