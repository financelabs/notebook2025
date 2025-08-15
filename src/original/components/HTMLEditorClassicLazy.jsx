import React from "react";
import { useSelector, useDispatch } from "react-redux";

//import { selectTempData, setCKEditorContent } from "../features/temp/tempSlice";
import { selectCKEditorContent, setObjectKeyValue } from "../features/case/caseSlice";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Essentials, Paragraph, Bold, Italic } from 'ckeditor5';
//import BalloonEditor from '@ckeditor/ckeditor5-build-balloon-block';

export default function HTMLEditorBallonBlockLazy(props) {
    const dispatch = useDispatch();
    const initContent = useSelector(selectCKEditorContent);

    return <CKEditor
    config={ {
        licenseKey: 'GPL',
       // plugins: [ Essentials, Paragraph, Bold, Italic, FormatPainter ],
       // toolbar: [ 'undo', 'redo', '|', 'bold', 'italic', '|', 'formatPainter' ]
    } }

        editor={ClassicEditor}

        data={!!initContent ? initContent : "<p>Комментарий</p>"}
        //           data={!!props.htmlfeedback ? props.htmlfeedback :"<p>Комментарий</p>"}
        onInit={editor => {
            // You can store the "editor" and use when it is needed.
            // console.log('Editor is ready to use!', editor);
        }}
        onChange={(event, editor) => {
            //    const data = editor.getData();
            dispatch(setObjectKeyValue({ key: "ckeditorContent", value: editor.getData() }));
            //   console.log({ event, editor, data });
        }}
        // onBlur={(event, editor) => {
        //     props.setHtmlfeedback(editor.getData());
        // }}
        onFocus={(event, editor) => {
            //       console.log('Focus.', editor);
        }}
    />

}