import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import { Button } from "@material-ui/core";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const ControlledEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  return (
    <Editor
      editorState={editorState}
      wrapperClassName="demo-wrapper"
      editorClassName="demo-editor"
      onEditorStateChange={onEditorStateChange}
    />
  );
};

const Messages = () => {
  return (
    <div>
      <ControlledEditor></ControlledEditor>
      <Button variant="contained" color="primary">
        Save
      </Button>
    </div>
  );
};

export default Messages;
