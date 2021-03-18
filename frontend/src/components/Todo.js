import React, { useEffect, useState } from "react";
import update from "immutability-helper";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Checkbox,
  IconButton,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import EditTodoForm from "./EditTodoForm";

import DatetimeUtils from "../utils/datetime";

async function getTodoById(jobId, todoId) {
  const { data } = await axios.get(`/jobs/${jobId}/todos/${todoId}`);
  return data;
}

function useTodo(jobId, todoId) {
  return useQuery(["todo", todoId], () => getTodoById(jobId, todoId));
}

// Main
function Todo(props) {
  const [openEditForm, setOpenEditForm] = useState(false);
  const [done, setDone] = useState(false);
  const { jobId, todoId } = props;
  const labelId = `todo-${todoId}`;

  // React query
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useTodo(jobId, todoId);

  // Update mutation
  const updateTodoMutation = useMutation(
    (requestBody) => axios.put(`/jobs/${jobId}/todos/${todoId}`, requestBody),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["todo", todoId]);
      },
    }
  );

  // Delete mutation
  const deleteTodoMutation = useMutation(
    ({ jobId, todoId }) => axios.delete(`/jobs/${jobId}/todos/${todoId}`),
    {
      // This is a bit inefficient
      onSuccess: () => {
        queryClient.invalidateQueries("jobs");
      },
    }
  );

  // API call to toggle the todo
  const toggleTodo = (todo) => {
    const requestBody = update(todo, { done: { $set: !todo.done } });
    updateTodoMutation.mutate(requestBody);
  };

  const onOpenEdit = (_) => {
    setOpenEditForm(true);
  };

  const onDeleteTodo = (_, jobId, todoId) => {
    console.log(jobId, todoId);
    deleteTodoMutation.mutate({ jobId, todoId });
  };

  const handleToggleTodo = (_, todo) => {
    setDone(!done);
    toggleTodo(todo);
  };

  useEffect(() => {
    axios
      .get(`/jobs/${jobId}/todos/${todoId}`)
      .then((response) => setDone(response.data.done));
  }, []);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : !data || isError ? (
        <div>Something is wrong...</div>
      ) : (
        // Toggle done state
        <ListItem
          key={data.id}
          button
          onClick={(e) => handleToggleTodo(e, data)}
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={done}
              disableRipple
              inputProps={{ "aria-labelledby": labelId }}
            />
          </ListItemIcon>
          <ListItemText
            id={labelId}
            primary={<Typography variant="body1">{data.title}</Typography>}
            secondary={"Due: " + DatetimeUtils.dateToStr(data.due_date)}
          />
          <ListItemSecondaryAction>
            {/* Open Edit Todo Form */}
            <IconButton
              edge="end"
              aria-label="comments"
              onClick={(e) => onOpenEdit(e, todoId)}
            >
              <EditIcon />
            </IconButton>

            {openEditForm && (
              <EditTodoForm
                open={openEditForm}
                handler={setOpenEditForm}
                todo={data}
                editTodoMutation={updateTodoMutation}
              ></EditTodoForm>
            )}

            {/* Delete Todo */}
            <IconButton
              edge="end"
              aria-label="comments"
              onClick={(e) => onDeleteTodo(e, jobId, todoId)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      )}
    </div>
  );
}

export default Todo;
