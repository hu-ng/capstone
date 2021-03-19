import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from "../context/auth";
import { useQuery } from "react-query";
import axios from "axios";

import {
  Grid,
  Card,
  Typography,
  Button,
  Link,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import AddJobForm from "../components/AddJobForm";
import JobDetail from "../components/JobDetail";
import JobSearchBar from "../components/JobSearchBar";

import DatetimeUtils from "../utils/datetime";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  newFormButton: {
    flex: 1,
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
  const [tags, setTags] = useState([]);
  const [filterTags, setFilterTags] = useState([]);

  // Set authentication headers
  axios.defaults.headers.common = {
    Authorization: `Bearer ${authTokens.access_token}`,
  };

  // Async axios query to get all jobs
  const fetchJobs = async () => {
    const { data } = await axios.get("/jobs/");
    return data;
  };

  // Async axios query to get all tags
  const fetchTags = async () => {
    const { data } = await axios.get("/tags/");
    return data;
  };

  // Query hook to fetch jobs
  const jobsQueryRes = useQuery("jobs", fetchJobs, {
    onSuccess: (data) => {
      setJobsDisplay(data);
      setJobsDefault(data);
    },
  });

  // Query hook to fetch tags
  const tagsQueryRes = useQuery("tags", fetchTags, {
    onSuccess: (data) => {
      setTags(data);
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

  // Handle input change in the search bar
  const handleSearchBarChange = (e) => {
    // Extract keyword and save to state
    const input = e.target.value;
    setKeyword(input);
    filterJobs(input, filterTags);
  };

  // Handle input change in the filter bar
  const filterByTags = (chosenTags) => {
    // Extract tag IDs and save to state
    const chosenTagsID = chosenTags.map((tag) => tag.id);
    setFilterTags(chosenTagsID);
    filterJobs(keyword, chosenTagsID);
  };

  // Central function to filter jobs
  function filterJobs(keyword, tags) {
    // Filter by company name
    let filteredJobs = jobsDefault.filter((job) => {
      return job.company.toLowerCase().includes(keyword.toLowerCase());
    });

    // If tags chosen, filter by tags included
    if (tags.length > 0)
      filteredJobs = filteredJobs.filter((job) => {
        return job.tags.some((tagId) => tags.includes(tagId));
      });

    // Show filtered jobs
    setJobsDisplay(filteredJobs);
  }

  // Get a job object based on id
  const getSelectedJob = (id) => {
    if (!id) return;
    const job = jobsDefault.find((job) => job.id === id);
    return job ? job : setSelectedId("");
  };

  return (
    <div>
      {/* Error banner */}
      {(jobsQueryRes.isError || tagsQueryRes.isError) && (
        <div>Something went wrong ...</div>
      )}

      {/* Loading banner */}
      {(jobsQueryRes.isLoading || tagsQueryRes.isLoading) && (
        <div>Loading...</div>
      )}
      <Grid container spacing={5} className="pt-5 px-4">
        {/* Pipeline view */}
        <Grid item xs={5}>
          <Grid container className="py-3" alignItems="center">
            <Grid item>
              <Typography
                variant="h4"
                style={{ display: "inline-block", flexGrow: 1 }}
              >
                Pipeline
              </Typography>
            </Grid>
          </Grid>

          <Grid container className="pb-3" alignItems="center">
            <Grid item container alignItems="center" justify="space-between">
              {/* Button to add form*/}
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={openJobForm}
                >
                  New Job
                </Button>
              </Grid>

              <Grid item>
                <Link href="#">View your stats!</Link>
              </Grid>
            </Grid>

            {/* Filter options */}
            <Grid
              item
              container
              spacing={2}
              alignItems="center"
              className="py-2"
            >
              {/* Search bar */}
              <Grid item xs={5}>
                <JobSearchBar
                  keyword={keyword}
                  handler={handleSearchBarChange}
                ></JobSearchBar>
              </Grid>

              {/* Autocomplete bar */}
              <Grid item xs={7}>
                <Autocomplete
                  multiple
                  options={tags}
                  onChange={(e, value) => filterByTags(value)}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      margin="dense"
                      placeholder="Add tags to filter by"
                    />
                  )}
                />
              </Grid>
            </Grid>
            <AddJobForm open={openForm} setOpenForm={setOpenForm}></AddJobForm>
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
            <JobDetail job={getSelectedJob(selectedId)} tags={tags}></JobDetail>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default Dashboard;
