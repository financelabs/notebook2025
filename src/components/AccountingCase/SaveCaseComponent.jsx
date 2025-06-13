import React, { useEffect, useState } from "react";
import {GlobalContext } from "../../features/GlobalContext";

import transactionsListFull from "../../utlities/transactionsListFull";

import Button from "react-bootstrap/Button";


function SaveCaseComponent() {
  const state = useContext(GlobalContext);
  let [savingStatus, setSavingStatus] = useState(true);

  useEffect(() => {
    let {
      id,
      type,
      title,
      theme,
      user,
      email,
      avatarUrl,
      userEmail,
      quizString,
      bookrecords,
      records, //comment: projectComment, spreadsheetObject: content, tasks,
    } = state;

    let checkedRecords = Array.isArray(records) ? records : null;

    async function doSave() {
      console.log("Saving");
      //    console.log(records);
      let postObject = {
        id, // "accountingwithprofitscash",
        title,
        theme,
        answer: "Кейс",
        comment: "Кейс", // projectComment, // "Лекционный пример",
        type: "accountingwithprofitscash",
        content: records,
        quizString: quizString,
        deleted: false,
        email: email,
        user: user,
        avatarUrl: !!avatarUrl ? avatarUrl : null,
        bookrecords: records,
        date: new Intl.DateTimeFormat("ru", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }).format(new Date()), //Date().toJSON()
        mediaItems: {
          0: {
            comment: "Проводки проекта",
            content: transactionsListFull(bookrecords),
            mediaType: "html",
          },
        },
      };
      var updates = {};
      updates["/usersCraft/" + userEmail + "/posts/" + id] = postObject;
      //  updates["/openmedia/" + idPost] = postObject;
      updates["/usersTemplates/projects/" + userEmail + "/" + id] = postObject;

      let htmlPost = {
        answer: "",
        comment: "Проводки",
        quizString: "",
        deleted: false,
        email: email,
        user: user,
        avatarUrl: !!avatarUrl ? avatarUrl : null,
        date: new Intl.DateTimeFormat("ru", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }).format(new Date()), //Date().toJSON()
      };

      let currentDay = new Intl.DateTimeFormat("en", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
        .format(new Date())
        .replace(/[^a-zA-Z0-9]/g, "_");


      updates["currentDay/" + currentDay + "/posts/" + id + userEmail + "media"] =
          {
        ...htmlPost,
        id:  id + userEmail + "media",
        theme: "Изученные проводки",
        title: "Проводки по кейсу " + user + " " + title,
        content: transactionsListFull(bookrecords),
        type: "html",
      };



      updates["/usersCraft/" + userEmail + "/posts/" +  id + userEmail + "media"] = {
        ...htmlPost,
        id:  id + userEmail + "media",
        theme: "Изученные проводки",
        title: "Проводки по кейсу " + user + " " + title,
        content: transactionsListFull(bookrecords),
        type: "html",
      };




    

      basicfirebasecrudservices
        .updateFirebaseNode(updates)
        //  return timeout(475)
        .then(() => {
          console.log(updates);
          //      DoSavedSuccessfully(true);
          //      doEditPostTitleComment(false);
        });
    }

    if (
      !!title &&
      !!theme &&
      !!id &&
      Array.isArray(records) &&
      records.length > 0
    ) {
      doSave().then((res) => {
        setSavingStatus(false);
        console.log("Changes Updated");
      });
    }
  }, [state.records.length, state.triggerSave]);

  if (!state?.id) return null;

  if (savingStatus) return;
  <div className="d-flex justify-content-center">
    <div className="spinner-grow spinner-grow-sm" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>;

  return (
    <Button
      type="button"
      variant="outline-secondary"
    >
      Save Case
    </Button>
  );
}

export default SaveCaseComponent