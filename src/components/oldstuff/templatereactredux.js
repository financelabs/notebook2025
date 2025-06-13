import React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import ReactReduxCRUD from './templates/ReactReduxCRUD';

// function App({ quizid }) {
//   const dispatch = useDispatch();

//   React.useEffect(() => {
//     dispatch({
//       type: "PUSH_ITEM_TO_ARRAY",
//       payload: {
//         arrayName: "choices",
//         item: { id: 3, text: "Springs", isRight: false }
//       }
//     });
//     dispatch({
//       type: 'LOAD_FROM_FIREBASE',
//       payload: {
//         url: 'quizescases/quizesCasesIds/',
//         datatype: 'array',
//         destination: 'openquizes'
//       }
//     });
//   }, [])
//   return <div>
//     React Redux {quizid}
//   </div>
// }

// Find all DOM containers, and render Like buttons into them.
document.querySelectorAll('.reactreduxentry')
  .forEach(domContainer => {
    // Read the comment ID from a data-* attribute.
    // const commentID = parseInt(domContainer.dataset.quizid, 10);
    const root = ReactDOM.createRoot(domContainer);
    root.render(
      <Provider store={!!basicfirebasecrudservices && basicfirebasecrudservices.store}>
        <ReactReduxCRUD quizid={domContainer.dataset.quizid} />
        {/* <App quizid={domContainer.dataset.quizid} /> */}
      </Provider>
    );
  });
