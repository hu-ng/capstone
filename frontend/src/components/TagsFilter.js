import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

const TagsFilter = (props) => {
  const { tags, getTagName, jobs, setJobsFiltered } = props;

  // Filter by the tags
  const filterByTags = (tags, jobs) => {
    let jobsFiltered = jobs;
    const tagIds = tags.map((tag) => tag.id); // Extract tag ids
    // If there is at least one tag, filter by that id
    if (tags.length > 0) {
      jobsFiltered = jobsFiltered.filter((job) => {
        return job.tags.some((tagId) => tagIds.includes(tagId));
      });
    }
    // Set jobs for parent
    setJobsFiltered(jobsFiltered);
  };
  return (
    <div>
      <Autocomplete
        multiple
        options={tags}
        onChange={(e, value) => filterByTags(value, jobs)}
        getOptionLabel={getTagName}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            margin="dense"
            placeholder="Add tags to filter by"
          />
        )}
      />
    </div>
  );
};

export default TagsFilter;
