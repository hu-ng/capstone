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

import JobForm from "../components/JobForm";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function Dashboard() {
  const { authTokens } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [jobSelected, setJobSelected] = useState("");
  const [jobHovered, setJobHovered] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [openForm, setOpenForm] = useState(false);

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

  // Select a job
  const selectJob = (e, jobId) => {
    if (jobId === jobSelected) {
      setJobSelected("");
    } else {
      setJobSelected(jobId);
    }
  };

  // Add a job
  const openJobForm = (e) => {
    setOpenForm(true);
  };

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      console.log("fetch");
      setIsError(false);
      setIsLoading(true);

      // Get data
      const result = await axios.get("/jobs");
      setJobs(result.data);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      console.log(error);
    }
  };

  // hook to fetch data on component mount and when form is closed
  useEffect(() => {
    fetchJobs();
  }, [openForm]);

  return (
    <div>
      {isError && <div>Something went wrong ...</div>}
      {isLoading && <div>Loading...</div>}

      <Grid container spacing={5} className="pt-5">
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
                    onClick={(e) => selectJob(e, job.id)}
                    selected={job.id === jobSelected}
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
        <Grid item xs={7}></Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
