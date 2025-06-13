import React, { useState, useEffect, useContext } from "react";
import { GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";
import { Container, Row, Col } from "react-bootstrap";
import timeout from "../../utlities/timeout";

import createMarkup from "../../utlities/createMarkup";

import accounting101 from "./casesSets";

function TestShowCaseDetails() {
  //   const dispatch = useContext(GlobalDispatchContext);
  const state = useContext(GlobalContext);
  const [sortedTasks, setSortedTasks] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {

    async function updateTasksWithIdSortBy(selectedQuizCaseId) {

      if (!!selectedQuizCaseId) {
        console.log("openquizes/" + selectedQuizCaseId + "/tasks/");

        let updates = {};
        let tasksWithIdSortBy = [];

        let tasksObject = await basicfirebasecrudservices.getFirebaseNode(
          {
            url: "openquizes/" + selectedQuizCaseId + "/tasks",
            type: "object"
          });
        console.log(tasksObject);

        if (!tasksObject) {
          let tasks = accounting101.find(item => item.id === selectedQuizCaseId).tasks;
          Array.isArray(tasks) && tasks.length > 0 && tasks.forEach((item, index) => {
            let newId = basicfirebasecrudservices.getFirebaseNodeKey("openquizes/" + selectedQuizCaseId + "/tasks");
            let updatedTask = {
              ...item,
              id: newId,
              sortBy: index + 1
            };
            updates["openquizes/" + selectedQuizCaseId + "/tasks/" + newId] = updatedTask;
            tasksWithIdSortBy.push(updatedTask)
          })
        } else {
          Object.keys(tasksObject).forEach(objKey => {
            if (("" + tasksObject[objKey].id).length < 5) {
              let newId = basicfirebasecrudservices.getFirebaseNodeKey("openquizes/" + selectedQuizCaseId + "/tasks");
              updates["openquizes/" + selectedQuizCaseId + "/tasks/" + objKey] = null;
              let updatedTask = {
                ...tasksObject[objKey],
                id: newId,
                sortBy: tasksObject[objKey].id
              };
              updates["openquizes/" + selectedQuizCaseId + "/tasks/" + newId] = updatedTask;
              tasksWithIdSortBy.push(updatedTask)
            } else {
              tasksWithIdSortBy.push(tasksObject[objKey])
            }
          });
        }

        if (Object.keys(updates).length > 0) {
          console.log(updates)
          //  await basicfirebasecrudservices.updateFirebaseNode(updates)
        }

        console.log(updates);
        console.log(tasksWithIdSortBy);
        tasksWithIdSortBy.sort((a, b) => (a.sortby > b.sortby) ? 1 : ((b.sortby > a.sortby) ? -1 : 0))
        console.log(tasksWithIdSortBy);
        setSortedTasks(tasksWithIdSortBy);
        return false
      } else {
        let res = await timeout(2000, false);
        return res
      }
    }

    updateTasksWithIdSortBy(state?.selectedQuizCaseId)
      .then(() => setLoading(false))

  }, [state?.selectedQuizCaseId])

  console.log(sortedTasks);

  if (state?.loading || isLoading || !state?.selectedQuizCaseId) return null


  // let selectedCase = Array.isArray(state?.quizescases) && state.quizescases.length > 0 ?
  //  state.quizescases.find(item => item.id === state.selectedQuizCaseId) : null;

  // if (!selectedCase || !Array.isArray(selectedCase?.tasks) ) { return null }

  // let records = Array.isArray(state?.records) ? state?.records : [];


  return <Container key={state?.id}>
    <div>{state.id}</div>
    <Row>
      <Col>{sortedTasks.map((task, index) => {
        return <div key={index}
          dangerouslySetInnerHTML={createMarkup(
            '<span class="badge bg-light text-dark">' + task?.id + '</span><br>'
            + task?.text
          )}
        />
      })}</Col>
      {/* <Col>{records.map(item => { return <div>{item.d}</div>})}</Col> */}
    </Row>
  </Container>
}

export default TestShowCaseDetails