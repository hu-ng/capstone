import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Button,
  DialogActions,
  TextField,
} from "@material-ui/core";

import DatetimeUtils from "../utils/datetime";

const AddTodoForm = (props) => {
  const { open, handler, jobId } = props;
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(new Date());

  const queryClient = useQueryClient();
  const addTodoMutation = useMutation(
    (requestBody) => axios.post(`/jobs/${jobId}/todos/`, requestBody),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("jobs");
      },
    }
  );

  const handleDateChange = (date) => {
    setDueDate(date);
  };

  const handleInputChange = (e, func) => {
    func(e.target.value);
  };

  const handleClose = () => {
    handler(false);
  };

  const resetForm = () => {
    setTitle("");
    setDueDate(new Date());
  };

  const onSubmit = () => {
    // Form request body
    const requestBody = {
      title: title || null,
      due_date: DatetimeUtils.formatForDB(dueDate),
    };

    // Call function to add job
    addTodoMutation.mutate(requestBody);

    // Reset the form
    resetForm();
  };

  // Resets form and mutation when open is changed
  useEffect(() => {
    resetForm();
    addTodoMutation.reset();
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={"md"}>
      <DialogTitle>Add a new Todo</DialogTitle>
      {/* Form Content */}
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* If error, indicate error */}
            {addTodoMutation.isError && <div>Something went wrong...</div>}

            {/* If success, close the form */}
            {addTodoMutation.isSuccess && handleClose()}
            <form>
              <Grid container spacing={3}>
                {/* Todo title */}
                <Grid item xs={6}>
                  <TextField
                    required
                    label="Title"
                    value={title}
                    onChange={(e) => handleInputChange(e, setTitle)}
                    fullWidth
                    margin="dense"
                  />
                </Grid>

                {/* Date picker */}
                <Grid item xs={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      required
                      disableToolbar
                      fullWidth
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="dense"
                      label="Due Date"
                      value={dueDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Actions */}
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        <Button onClick={onSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTodoForm;
