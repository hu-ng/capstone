import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import update from "immutability-helper";

import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Checkbox,
  IconButton,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import AddTodoForm from "./AddTodoForm";
import EditTodoForm from "./EditTodoForm";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

function TodoList(props) {
  const classes = useStyles();
  const [openEditForm, setOpenEditForm] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState("");
  const dispatch = useDispatch();

  // API call to delete the todo
  const deleteTodo = async (todo_id) => {
    try {
      const result = await axios.delete(
        `/jobs/${props.job.id}/todos/${todo_id}`
      );
      dispatch({ type: "SET_JOB", job: result.data });
    } catch (error) {
      if (error.response.data) {
        console.log(error.response.data);
      }
      console.log(error);
    }
  };

  // API call to toggle the todo
  const toggleTodo = async (todo) => {
    const requestBody = update(todo, { done: { $set: !todo.done } });
    try {
      const result = await axios.put(
        `/jobs/${props.job.id}/todos/${todo.id}`,
        requestBody
      );

      dispatch({ type: "SET_JOB", job: result.data.job });
    } catch (error) {
      if (error.response.data) {
        console.log(error.response.data);
      }
      console.log(error);
    }
  };

  const onOpenEdit = (_, todo_id) => {
    setSelectedTodo(todo_id);
    setOpenEditForm(true);
  };

  const onDeleteTodo = (_, todo_id) => {
    deleteTodo(todo_id);
  };

  const handleToggleTodo = (_, todo) => {
    toggleTodo(todo);
  };

  return (
    <List className={classes.root}>
      {props.todos.map((todo) => {
        const labelId = `todo-${todo.id}`;

        // TODO: Add strikethrough to this
        const primaryNode = (
          <Typography variant="body1">{todo.title}</Typography>
        );

        return (
          <ListItem
            key={todo.id}
            button
            onClick={(e) => handleToggleTodo(e, todo)}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={todo.done}
                disableRipple
                inputProps={{ "aria-labelledby": labelId }}
              />
            </ListItemIcon>
            <ListItemText
              id={labelId}
              primary={primaryNode}
              secondary={"Due: " + new Date(todo.due_date).toDateString()}
            />
            <ListItemSecondaryAction>
              {/* Open Edit Todo Form */}
              <IconButton
                edge="end"
                aria-label="comments"
                onClick={(e) => onOpenEdit(e, todo.id)}
              >
                <EditIcon />
              </IconButton>

              {openEditForm && (
                <EditTodoForm
                  open={todo.id === selectedTodo}
                  handler={setOpenEditForm}
                  todo={todo}
                ></EditTodoForm>
              )}

              {/* Delete Todo */}
              <IconButton
                edge="end"
                aria-label="comments"
                onClick={(e) => onDeleteTodo(e, todo.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}

const Todos = () => {
  const job = useSelector((state) => state.selectedJob);
  const [todos, setTodos] = useState([]);
  const [openAddTodo, setOpenAddTodo] = useState(false);

  const onAddTodo = () => {
    setOpenAddTodo(true);
  };

  const fetchTodos = async () => {
    try {
      const result = await axios.get(`/jobs/${job.id}/todos/`);
      setTodos(result.data);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [job]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <IconButton color="primary" onClick={onAddTodo}>
          <AddCircleIcon />
        </IconButton>
        <AddTodoForm
          job={job}
          open={openAddTodo}
          handler={setOpenAddTodo}
        ></AddTodoForm>
      </Grid>
      <Grid item xs={12}>
        <TodoList todos={todos} job={job}></TodoList>
      </Grid>
    </Grid>
  );
};

export default Todos;
