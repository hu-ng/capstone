import React, { useState } from "react";

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

// TODO: Local and UTC date issue
const EditTodoForm = (props) => {
  const { open, handler, todo, editTodoMutation } = props;
  const [title, setTitle] = useState(todo.title);
  const [dueDate, setDueDate] = useState(new Date(todo.due_date));

  const handleDateChange = (date) => {
    setDueDate(date);
  };

  const handleInputChange = (e, func) => {
    func(e.target.value);
  };

  const handleClose = () => {
    handler(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle(todo.title);
    setDueDate(new Date(todo.due_date));
  };

  const onSubmit = () => {
    // Form request body
    const requestBody = {
      title: title || null,
      due_date: dueDate.toISOString(),
    };

    // Post data to the backend
    editTodoMutation.mutate(requestBody);

    // Close and reset the form
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={"md"}>
      <DialogTitle>Edit this Todo</DialogTitle>
      {/* Form Content */}
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {editTodoMutation.isError && <div>Something went wrong...</div>}
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

export default EditTodoForm;
