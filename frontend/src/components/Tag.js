import { Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Styles hook from material ui
const useStyles = makeStyles((theme) => ({
  tag: {
    margin: theme.spacing(0.5),
  },
}));

// Simple wrapper around the Chip component
const Tag = (props) => {
  const { tag, deleteHandler } = props;
  const classes = useStyles();
  return (
    <Chip
      label={tag.name}
      onDelete={deleteHandler(tag.id)}
      className={classes.tag}
    />
  );
};

export default Tag;
