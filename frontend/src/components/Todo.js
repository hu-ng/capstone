// A single todo item

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

// Axios query to get a todo by jobId and todoId
async function getTodoById(jobId, todoId) {
  const { data } = await axios.get(`/jobs/${jobId}/todos/${todoId}`);
  return data;
}

// React Query hook that wraps around the above function
function useTodo(jobId, todoId) {
  return useQuery(["todo", todoId], () => getTodoById(jobId, todoId));
}

function Todo(props) {
  const [openEditForm, setOpenEditForm] = useState(false);
  const [done, setDone] = useState(false);
  const { jobId, todoId } = props;
  const labelId = `todo-${todoId}`;

  // React query client
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useTodo(jobId, todoId);

  // React query mutation to update a todo
  const updateTodoMutation = useMutation(
    (requestBody) => axios.put(`/jobs/${jobId}/todos/${todoId}`, requestBody),
    {
      // If successful, refetch data for this todo
      onSuccess: () => {
        queryClient.invalidateQueries(["todo", todoId]);
      },
    }
  );

  // React query mutation to delete a todo
  const deleteTodoMutation = useMutation(
    ({ jobId, todoId }) => axios.delete(`/jobs/${jobId}/todos/${todoId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("jobs");
      },
    }
  );

  // HWrapper function to toggle todo via API
  const toggleTodo = (todo) => {
    const requestBody = update(todo, { done: { $set: !todo.done } });
    updateTodoMutation.mutate(requestBody);
  };

  // Wrapper function around form control prop
  const onOpenEdit = (_) => {
    setOpenEditForm(true);
  };

  // Handler function to delete todo
  const onDeleteTodo = (_, jobId, todoId) => {
    deleteTodoMutation.mutate({ jobId, todoId });
  };

  // Wrapper function to toggle the done state on both the client and backend
  const handleToggleTodo = (_, todo) => {
    setDone(!done);
    toggleTodo(todo);
  };

  // When the component first mounts, use the query to update the states of todos
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
