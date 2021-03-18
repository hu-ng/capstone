import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { List } from "@material-ui/core";

import Todo from "./Todo";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

const TodoList = (props) => {
  const { todoIds, jobId } = props;
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {todoIds.map((todoId) => {
        return <Todo jobId={jobId} todoId={todoId} key={todoId}></Todo>;
      })}
    </List>
  );
};

export default TodoList;
