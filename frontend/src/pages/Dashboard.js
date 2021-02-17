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

import { useSelector, useDispatch } from "react-redux";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function Dashboard() {
  const { authTokens } = useAuth();
  const [jobHovered, setJobHovered] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);

  // Set authentication headers
  axios.defaults.headers.common = {
    Authorization: `Bearer ${authTokens.access_token}`,
  };

  // Async axios call
  const fetchJobs = async () => {
    const { data } = await axios.get("/jobs/");
    return data;
  };

  // Query hook to fetch data
  const { isLoading, isError, data } = useQuery("jobs", fetchJobs);

  const selectedId = useSelector((state) => state.selectedId);
  const dispatch = useDispatch();

  const classes = useStyles();

  // Helper function turning date to str.
  // Server UTC is turned into local time automatically
  const dateToStr = (str) => {
    if (str) {
      const date = new Date(str);
      return date.toDateString();
    }
  };

  // Helper function to get valid index
  const getSelectedIdx = (currIdx, data) => {
    return Math.min(currIdx, data.length - 1);
  };

  // Select a job
  const onJobSelect = (e, jobId, idx) => {
    if (selectedId && jobId === selectedId) {
      setSelectedIdx(null);
      dispatch({ type: "SET_JOB", id: null });
    } else {
      dispatch({ type: "SET_JOB", id: jobId });
      setSelectedIdx(idx);
    }
  };

  // Open form to add a new job
  const openJobForm = (e) => {
    setOpenForm(true);
  };

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

            {/* Button to open form */}
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
              {data && (
                <TableBody>
                  {data.map((job, idx) => (
                    <TableRow
                      key={job.id}
                      onClick={(e) => onJobSelect(e, job.id, idx)}
                      selected={selectedId ? job.id === selectedId : false}
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
              )}
            </Table>
          </TableContainer>
        </Grid>

        {/* Individual job views */}
        {Number.isInteger(selectedIdx) && (
          <Grid item xs={7}>
            <JobDetail
              job={data[getSelectedIdx(selectedIdx, data)]}
            ></JobDetail>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default Dashboard;
