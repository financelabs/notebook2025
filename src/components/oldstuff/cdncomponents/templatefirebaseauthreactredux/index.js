import React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
// import ReactReduxCRUD from '../../templates/ReactReduxCRUD';
import CustomPagination from "../../layout/CustomPagination"

// https://github.com/CSFrequency/react-firebase-hooks/
// https://dev.to/joodi/7-react-custom-hooks-i-always-use-as-a-front-end-developer-5i9
let Card = ReactBootstrap.Card;
let Button = ReactBootstrap.Button;

function createMarkup(html) {
  return {__html: html};
}

function App({ quizid }) {
  const [user, isloading] = authfirebasecrudservices.useAuthStateHook();
  const { data, loading, error } = authfirebasecrudservices.useFirebaseNode(
    "quizescases/quizesCasesIds/"
  );
  const [currentPage, setCurrentPage] = React.useState(1);
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

  console.log(user?.email, loading, data);

  function doSetCurrentPage(args) {
    setCurrentPage(args)
  }

  function doDeleteOpenQuiz(quiz) {
    console.log(quiz);
    let updates = {};
        updates["quizescases/quizesCasesIds/" + quiz.id] = null;
        updates["quizescases/quizesCasesIds/" + "undefined"] = null;       
        authfirebasecrudservices.updateFirebaseNode(updates).then(res => console.log(res))
  }


  if (isloading || loading) {
    return <div className='container'>
      <div class="card text-bg-dark">
        <img src="../econolabs/freelancer.jpg" class="card-img" alt="freelancer" />
        <div class="card-img-overlay">

          <p class="position-absolute bottom-0 end-0"><small className='p-5'>Loading</small></p>
        </div>
      </div>
    </div>
  }



  return <div className='container'>
    <CustomPagination
      itemsCount={data.length}
      itemsPerPage={1}
      currentPage={currentPage}
      setCurrentPage={doSetCurrentPage}
      alwaysShown={true}
    />

    <Card style={{ width: '36rem' }}>
      <Card.Img variant="top" src="https://images.unsplash.com/photo-1671170378099-17a7243769b8?q=100&w=720&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
      <Card.Body>
        <Card.Title>{data[currentPage]?.theme}</Card.Title>
        <Card.Text>
          {data[currentPage]?.title}
        </Card.Text>
        <hr />
        <div dangerouslySetInnerHTML={createMarkup(
          data[currentPage]?.hint ? data[currentPage].hint : "" 
        )} />
        <hr />
        <Card.Text style={{height: "400px"}}>
        <pre>{JSON.stringify(data[currentPage], null, 2) }</pre>
        </Card.Text>


        <hr />
        {/* <AddChoice />
            <ChoiceList /> 
        <AddChoice />
        <ChoiceList /> */}
        <Button variant="danger" onClick={()=>doDeleteOpenQuiz(data[currentPage])}>Go somewhere</Button>
      </Card.Body>
    </Card>

  </div>
}

// Find all DOM containers, and render Like buttons into them.
document.querySelectorAll('.reactreduxentry')
  .forEach(domContainer => {
    // Read the comment ID from a data-* attribute.
    // const commentID = parseInt(domContainer.dataset.quizid, 10);
    const root = ReactDOM.createRoot(domContainer);
    root.render(
      <>
        <Provider store={!!authfirebasecrudservices && authfirebasecrudservices.store}>
          {/*   <ReactReduxCRUD quizid={domContainer.dataset.quizid} /> */}
          <App quizid={domContainer.dataset.quizid} />
        </Provider>
      </>
    );
  });
