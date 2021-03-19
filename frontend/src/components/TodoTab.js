import React, { useState } from "react";
import { Grid, Button } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddTodoForm from "./AddTodoForm";
import TodoList from "./TodoList";

const TodoTab = (props) => {
  const { job } = props;
  const todoIds = job.todos;
  const [openAddTodo, setOpenAddTodo] = useState(false);

  const onAddTodo = () => {
    setOpenAddTodo(true);
  };

  return (
    <Grid container>
      <Grid item xs={12} className="py-2">
        {/* Add a todo */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={onAddTodo}
        >
          Add New
        </Button>
        <AddTodoForm
          jobId={job.id}
          open={openAddTodo}
          handler={setOpenAddTodo}
        ></AddTodoForm>
      </Grid>

      {/* Show todos */}
      <Grid item xs={12}>
        {todoIds.length > 0 && (
          <TodoList todoIds={todoIds} jobId={job.id}></TodoList>
        )}
      </Grid>
    </Grid>
  );
};

export default TodoTab;
