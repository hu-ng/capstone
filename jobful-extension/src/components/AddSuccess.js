import { Grid, Button } from "@material-ui/core";

const AddSuccess = (props) => {
  const { action } = props;
  const resetAction = () => {
    action.reset();
  };
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      direction="column"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={12}>
        <div>Added a new job!</div>
      </Grid>
      <Grid item xs={12}>
        <Button color="secondary" variant="contained" onClick={resetAction}>
          Add Another
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddSuccess;
