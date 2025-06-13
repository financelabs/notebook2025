import React, { useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import parse from 'html-react-parser';

import HTMLEditorClassic from "./HTMLEditorClassic";

import Button from "react-bootstrap/Button";

import { SVGBootstrapIconPencilSquare, SVGBootstrapIconCloudCheck } from "../svgs";

import { selectCKEditorContent, selectCKEditorNodeId, setObjectKeyValuePairs } from "../features/case/caseSlice";



function CKEditorClassic({ id, content, setHtmlfeedback }) {
  const idEdit = useSelector(selectCKEditorNodeId);
  const [editMode, setEditMode] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState(false);

  React.useEffect(() => {
    if (idEdit === id) {
      setTimeout(setEditMode(true), 1000);
    } else { setEditMode(false)}
  }, [idEdit]);

  function didSave(content) {
    setEditedContent(content);
    setEditMode(false);
    setHtmlfeedback(id, content );
  }

  if (!!editMode) {
    return <div className="m-2">
      <SaveContentButton didSave={didSave} />
      <HTMLEditorClassic />
    </div>
  }

  return <div className="m-2">
    <EditContentButton id={id} content={content} />
    <div>{parse(!!editedContent ? editedContent : content)}</div>
  </div>
}


function EditContentButton({ id, content }) {
  const dispatch = useDispatch();
  const idEdit = useSelector(selectCKEditorNodeId);
  const [editMode, setEditMode] = React.useState(false);

  React.useEffect(() => {
    if (idEdit === id) {
      setTimeout(setEditMode(true), 1000);
    }
  }, [idEdit]);

  function doSave() {
    console.log('edit');
    console.log(idEdit);
    console.log(id);

    dispatch(setObjectKeyValuePairs({
        "ckeditorNodeId": id,
        "ckeditorContent": content
    }))
    // dispatch(setCKEditorContent(content));
    // dispatch(setCKEditorNodeId(id));
    console.log(idEdit);
  }

 
    return <Button
      variant="outline-light" size="sm"
      onClick={() => doSave()}
    >
      <SVGBootstrapIconPencilSquare />
    </Button>
  
}

function SaveContentButton({ didSave }) {
  const dispatch = useDispatch();
  const ckeditor_node_content = useSelector(selectCKEditorContent);


  function doSave() {
    didSave(ckeditor_node_content);
    console.log('Do Save');
 //   dispatch(setCKEditorContent(""));
 dispatch(setObjectKeyValuePairs({
    "ckeditorNodeId": 0,
}))
    
  }


  return <Button
    variant="outline-light" size="sm"
    onClick={() => doSave()}
  >
    <SVGBootstrapIconCloudCheck />
  </Button>
}

export default CKEditorClassic

