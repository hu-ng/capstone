import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from "../context/auth";
import { useQuery } from "react-query";
import axios from "axios";

import { Grid, Card, Typography, Button } from "@material-ui/core";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

import JobForm from "../components/AddJobForm";
import JobDetail from "../components/JobDetail";
import JobSearchBar from "../components/JobSearchBar";

import DatetimeUtils from "../utils/datetime";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

// List of job status
const StatusList = {
  0: "Added",
  1: "Applied",
  2: "Interviewing",
  3: "Offer",
  "-1": "Rejected",
};

// Dashboard: the main view of the app. Contains the jobs table and the job detail view.
function Dashboard() {
  const { authTokens } = useAuth();
  const [jobHovered, setJobHovered] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [jobsDisplay, setJobsDisplay] = useState([]);
  const [jobsDefault, setJobsDefault] = useState([]);

  // Set authentication headers
  axios.defaults.headers.common = {
    Authorization: `Bearer ${authTokens.access_token}`,
  };

  // Async axios query
  const fetchJobs = async () => {
    const { data } = await axios.get("/jobs/");
    return data;
  };

  // Query hook to fetch data
  const { isLoading, isError } = useQuery("jobs", fetchJobs, {
    onSuccess: (data) => {
      setJobsDisplay(data);
      setJobsDefault(data);
    },
  });

  // MaterialUI hook to inject styles
  const classes = useStyles();

  // Select a job based on an id
  const onJobSelect = (_, jobId) => {
    if (selectedId && jobId === selectedId) {
      setSelectedId("");
    } else {
      setSelectedId(jobId);
    }
  };

  // Open the form to add a new job
  const openJobForm = (e) => {
    setOpenForm(true);
  };

  // Handler function for the search bar
  const handleSearchBarChange = (e) => {
    const input = e.target.value;
    setKeyword(input);
    const filteredJobs = jobsDefault.filter((job) => {
      return job.company.toLowerCase().includes(input.toLowerCase());
    });
    setJobsDisplay(filteredJobs);
  };

  // Get a job object based on id
  const getSelectedJob = (id) => {
    if (!id) return;
    const job = jobsDefault.find((job) => job.id === id);
    return job ? job : setSelectedId("");
  };

  return (
    <div>
      {isError && <div>Something went wrong ...</div>}
      {isLoading && <div>Loading...</div>}
      <Grid container spacing={5} className="pt-5 px-4">
        <Grid item xs={5}>
          <Grid container className="py-3">
            <Typography
              variant="h4"
              style={{ display: "inline-block", flexGrow: 1 }}
            >
              Pipeline
            </Typography>
          </Grid>

          <Grid container className="pb-3" alignItems="center">
            {/* Button and form*/}
            <Grid item xs={5}>
              <Button variant="contained" color="primary" onClick={openJobForm}>
                New Job
              </Button>
              <JobForm open={openForm} setOpenForm={setOpenForm}></JobForm>
            </Grid>

            {/* Search bar */}
            <Grid item xs={7}>
              <JobSearchBar
                keyword={keyword}
                handler={handleSearchBarChange}
              ></JobSearchBar>
            </Grid>
          </Grid>

          {/* List of jobs */}
          <Grid container style={{ maxHeight: "75vh", overflowY: "scroll" }}>
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
                  {jobsDisplay.map((job) => (
                    <TableRow
                      key={job.id}
                      onClick={(e) => onJobSelect(e, job.id)}
                      selected={selectedId ? job.id === selectedId : false}
                      onMouseEnter={(e) => setJobHovered(job.id)}
                      omMouseLeave={(e) => setJobHovered("")}
                      hover={job.id === jobHovered}
                    >
                      <TableCell component="th" scope="row">
                        {job.company}
                      </TableCell>
                      <TableCell align="right">{job.title}</TableCell>
                      <TableCell align="right">
                        {StatusList[job.status]}
                      </TableCell>
                      <TableCell align="right">
                        {DatetimeUtils.dateToStr(job.added_date)}
                      </TableCell>
                      <TableCell align="right">
                        {DatetimeUtils.dateToStr(job.posted_date)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {/* Individual job view */}
        {getSelectedJob(selectedId) && (
          <Grid item xs={7}>
            <JobDetail job={getSelectedJob(selectedId)}></JobDetail>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default Dashboard;
