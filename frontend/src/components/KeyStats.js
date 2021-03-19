import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Button,
  DialogActions,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  Typography,
} from "@material-ui/core";

import TagsFilter from "./TagsFilter";
import Status from "../utils/statusConst";

const StatusList = Status.StatusList;

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  root: {
    minHeight: 240,
  },
});

// A quick tool to show you the breakdown of your job search
const KeyStats = (props) => {
  const { open, handler, jobs, tags } = props;
  const [jobsFiltered, setJobsFiltered] = useState(jobs);
  const [breakdown, setBreakdown] = useState({});

  // Function to calculate breakdown
  const getBreakdown = (jobs) => {
    // Initialize the object with keys
    const result = {};
    Object.values(StatusList).map((val) => {
      result[val] = { count: 0, percentage: 0 };
    });

    // Go through the jobs and keep count
    jobs.map((job) => {
      result[StatusList[job.status]].count++;
    });

    // Turn into percentages
    Object.values(StatusList).map((val) => {
      let percentage = (result[val].count / jobs.length) * 100;
      result[val].percentage = Math.round(percentage * 100) / 100;
    });

    // Return the result
    return result;
  };

  // Styles hook from MaterialUI
  const classes = useStyles();

  // Wrapper around the handler function
  const handleClose = () => {
    handler(false);
    setBreakdown(getBreakdown(jobs));
  };

  // Calculate new breakdown and set jobs filtered whenever jobs from parent changes
  useEffect(() => {
    setBreakdown(getBreakdown(jobs));
    setJobsFiltered(jobs);
  }, [jobs]);

  // Every time jobsFiltered is changed, we calculate a new breakdown
  useEffect(() => {
    setBreakdown(getBreakdown(jobsFiltered));
  }, [jobsFiltered]);

  return (
    <div>
      {open && (
        <Dialog open={open} onClose={handleClose} maxWidth={"md"}>
          <DialogTitle>Job Search Performance</DialogTitle>
          <DialogContent className={classes.root}>
            <Grid container spacing={3}>
              <Grid item container alignItems="center" justify="center">
                <Grid item xs={3}>
                  <Typography>Filter performance by tags:</Typography>
                </Grid>

                <Grid item xs={6}>
                  {/* Autocomplete bar */}
                  <TagsFilter
                    tags={tags}
                    getTagName={(tag) => tag.name}
                    jobs={jobs}
                    setJobsFiltered={setJobsFiltered}
                  ></TagsFilter>
                </Grid>
              </Grid>
              {/* Show analytics */}
              <Grid item container>
                <TableContainer component={Card}>
                  <Table className={classes.table} aria-label="Analytics Table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Total</TableCell>
                        {Object.values(StatusList).map((val) => {
                          return <TableCell>{val}</TableCell>;
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{jobsFiltered.length}</TableCell>
                        {Object.keys(breakdown).map((key) => {
                          const val = breakdown[key];
                          return (
                            <TableCell>
                              {val.count} ({val.percentage}%)
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </DialogContent>

          {/* Action */}
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default KeyStats;
