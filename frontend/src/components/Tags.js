import { useEffect, useState } from "react";
import { Grid, Paper, InputBase } from "@material-ui/core";
import { useMutation, useQueryClient } from "react-query";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

import Tag from "./Tag";

// Styles hook from material ui
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
  },
  tagsList: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  input: {
    margin: theme.spacing(0.5),
  },
}));

// Display tags for the job, let users add or remove a tag
const Tags = (props) => {
  // Extract the props from parent
  const { job, tags } = props;

  // Set the state as a list of tag IDs from the job
  const [tagsInJob, setTagsInJob] = useState([]);
  const [elevation, setElevation] = useState(0); // Control the elevation of the tags container

  const classes = useStyles();
  const queryClient = useQueryClient();

  // React query mutation to add a tag
  const addTagMutation = useMutation(
    (requestBody) => axios.put(`/jobs/${job.id}/tags/`, requestBody),
    {
      // On success, invalidate two queries: "jobs" and "tags"
      onSuccess: () => {
        queryClient.invalidateQueries("jobs");
        queryClient.invalidateQueries("tags");
      },
    }
  );

  // React query mutation to delete a tag
  const deleteTagMutation = useMutation(
    (requestBody) => axios.put(`/jobs/${job.id}/`, requestBody),
    {
      // On success, invalidate "jobs" query
      onSuccess: () => {
        queryClient.invalidateQueries("jobs");
      },
    }
  );

  // Delete a tag
  const handleDelete = (tagId) => () => {
    // Send a mutation to remove the tag. Client side will be updated automatically
    const currTags = tagsInJob.filter((tag) => tag.id !== tagId);
    const requestBody = { tags: currTags.map((tag) => tag.id) };
    deleteTagMutation.mutate(requestBody);
  };

  // Add a tag
  const addTag = (e) => {
    let inputValue = e.target.value;
    if (e.key === "Enter" && inputValue !== "") {
      // If the tag is already included in the job, return
      if (findTag(inputValue, tagsInJob)) return;

      // Check if tag exists in the global tags pool
      const tag = findTag(inputValue, tags);

      const requestBody = {};

      // If yes, send tag_id, or send inputValue to create a new tag
      tag
        ? (requestBody["tag_id"] = tag.id)
        : (requestBody["name"] = inputValue);

      // Make the mutation
      addTagMutation.mutate(requestBody);

      // Reset the field
      e.target.value = "";
    }
  };

  // Returns the tag objects that this job is supposed to have
  function getTagsForJob(tagsList, tagIDs) {
    return tagsList.filter((tag) => tagIDs.includes(tag.id));
  }

  // Find a tag in the tags list based on name
  function findTag(name, tagsList) {
    return tagsList.find((tag) => tag.name === name);
  }

  // Update current tags whenever job or tags changes
  useEffect(() => {
    setTagsInJob(getTagsForJob(tags, job.tags));
  }, [job, tags]);

  // Return the component
  return (
    <Grid container className="pb-3">
      <Paper className={classes.root} elevation={elevation}>
        <ul className={classes.tagsList}>
          {/* List of tags */}
          <li>Tags:</li>
          {tagsInJob.map((tag) => {
            return (
              <li key={tag.id}>
                <Tag tag={tag} deleteHandler={handleDelete}></Tag>
              </li>
            );
          })}

          {/* Input to add tags */}
          <li>
            <InputBase
              placeholder="Press enter to add tags"
              className={classes.input}
              onKeyUp={(e) => addTag(e)}
              onFocus={(e) => setElevation("3")}
              onBlur={(e) => setElevation("0")}
            ></InputBase>
          </li>
        </ul>
      </Paper>
    </Grid>
  );
};

export default Tags;
