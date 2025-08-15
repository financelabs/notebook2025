let { useSelector } = ReactRedux;
let { useState } = React;
let { Card, Pagination, Navbar, Form, InputGroup, Button, ButtonGroup } = ReactBootstrap;

import {
  selectApplication
} from '../features/application/cdnApplicationSlice';

import shuffle from '../../utlities/shuffle';

import QuizWithRandomNumber from './cdnQuizWithRandomNumber';

function CdnQuizCardWithStorageLayout() {
  return <QuizCardWithStorage set={set} />
}

export default CdnQuizCardWithStorageLayout


function OneRandomManyAnswers(props) {
  return (
    <Card style={{ width: '800px' }}>
      <Card.Img variant="top"
        src="https://images.unsplash.com/photo-1456574808786-d2ba7a6aa654?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
      <Card.Body>
        <Card.Title>OneRandomManyAnswers</Card.Title>
      </Card.Body>
    </Card>
  );
  // return <div>
  //   <h1>{props?.setTitle}</h1>
  //   <div className="mb-4">{!!qSets[props?.set]?.text ? parse(qSets[props.set].text): ""}</div>
  //   <hr />
  // </div>
}

function QuizSet({ set = [], setTitle = "Тесты" }) {
  const [selectedQuiz, setSelectedQuiz] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const pagesCount = Math.ceil(set.length / itemsPerPage);
  //  const isPaginationShown = alwaysShown ? true : pagesCount > 1;
  const isCurrentPageFirst = currentPage === 0;
  const isCurrentPageLast = currentPage === pagesCount - 1;

  const changePage = number => {
    if (currentPage === number) return;
    setCurrentPage(number);
    // scrollToTop();
  };

  const onPreviousPageClick = () => {
    if (currentPage < 1) {
      return (changePage(currentPage => currentPage = 0));
    } else {
      changePage(currentPage => currentPage - 1);
    }

  };

  const onNextPageClick = () => {
    changePage(currentPage => currentPage + 1);
  };


  function doSelectQuiz(index) {
    setLoading(true);
    setSelectedQuiz(index);
    setLoading(false);
  }

  let quizprops = set[selectedQuiz];

  if (set.length > 10) {


    let items = [];
    for (let index = currentPage * itemsPerPage; index < currentPage * itemsPerPage + itemsPerPage; index++) {
      items.push(
        <Pagination.Item key={index} active={index === selectedQuiz}
          onClick={() => doSelectQuiz(index)}
        >
          {index + 1}
        </Pagination.Item>,
      );
    }

    return <div className='m-1'>
      <Navbar bg="light">
        <Navbar.Brand>{setTitle}</Navbar.Brand>


        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Pagination size="sm">
            <Pagination.Prev
              className={isCurrentPageFirst ? "disable" : ""}
              onClick={onPreviousPageClick}
              disabled={isCurrentPageFirst}
            />
            {items}
            <Pagination.Next
              onClick={onNextPageClick}
              disabled={isCurrentPageLast}
              className={isCurrentPageLast ? "disable" : ""}
            />
          </Pagination>
        </Navbar.Collapse>

      </Navbar>
      <hr />
      {loading ? <div>...</div> : <QuizCardWithStorage key={selectedQuiz} setId={selectedQuiz + 1} {...quizprops} />}
    </div>
  }


  return <div className="mt-1">
    <Navbar bg="light">
      <Navbar.Brand >{setTitle}</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <ButtonGroup size={set.length < 5 ? "lg" : "sm"}>
          {set.map((quiz, index) => (
            <Button
              variant={selectedQuiz === index ? "secondary" : "outline-secondary"}
              onClick={() => doSelectQuiz(index)}
              key={index}
            >
              {set.length < 10 ? <span className="m-2" >{index + 1}</span> : <small>{index + 1}</small>}
            </Button>
          ))}
        </ButtonGroup>
      </Navbar.Collapse>
    </Navbar>
    <hr />
      {loading ? <div>...</div> : <QuizCardWithStorage key={selectedQuiz} setId={selectedQuiz + 1} {...quizprops} />}
    
  </div>
}


function CaseAccountingWithTasks(props) {
  return (
    <Card style={{ width: '800px' }}>
      <Card.Img variant="top"
        src="https://images.unsplash.com/photo-1456574808786-d2ba7a6aa654?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
      <Card.Body>
        <Card.Title>CaseAccountingWithTasks</Card.Title>
      </Card.Body>
    </Card>
  );
}

function CaseWithRandomNumber(props) {
  return (
    <Card style={{ width: '800px' }}>
      <Card.Img variant="top"
        src="https://images.unsplash.com/photo-1456574808786-d2ba7a6aa654?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
      <Card.Body>
        <Card.Title>CaseWithRandomNumber</Card.Title>
      </Card.Body>
    </Card>
  );
}

// function QuizWithRandomNumber() {
//   return (
//     <Card style={{ width: '800px' }}>
//       <Card.Img variant="top"
//         src="https://images.unsplash.com/photo-1456574808786-d2ba7a6aa654?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
//       <Card.Body>
//         <Card.Title>QuizWithRandomNumber</Card.Title>
//       </Card.Body>
//     </Card>
//   );
// }

function MultipleChoicesQuiz({email, user, avatarUrl, header="h",
title, imageurl = null, setId = null, text = null, choices = [],
answers = ["right"], hint = "", theme=""}) {
  const [showAnswer, setShowAnswer] = useState(null);
  const [answerIsRight, setAnswerIsRight] = useState(null);
  const [value, setValue] = useState("");

  function handleCheckboxChange(event) {
    // console.log(event.target.id);
    // const target = event.target;
    // const checked = target.checked;
    // const name = target.name;
    setValue(event.target.id);
  }

  function handleCheckAnswer() {
    setShowAnswer(true);
    if (value === answers[0]) {
      setAnswerIsRight(true);

      if (email.length > 6) {
        let userEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
        let idPost = basicfirebasecrudservices.getFirebaseNodeKey("usersCraft/" + userEmail + "/posts");
        let currentDay = new Intl.DateTimeFormat("en", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })
          .format(new Date())
          .replace(/[^a-zA-Z0-9]/g, "_");

        let postObject = {
          id: idPost, //Math.floor(Math.random() * 1001),
          title: title,
          theme: theme,
          answer: answers[0],
          comment: title + " (" + theme + ")", //Тема
          type: "multiplechoices",
          content: text,
          quizString: text,
          deleted: false,
          email: email,
          user: user,
          avatarUrl: !!avatarUrl ? avatarUrl : "",
          date: new Intl.DateTimeFormat("ru", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }).format(new Date()), //Date().toJSON()
        };

        let currentDayObject = {
          id: idPost,
          title: title,
          theme: theme,
          email: email,
          user: user,
          avatarUrl: !!avatarUrl ? avatarUrl : null,
          timestamp: +Date.now(),
        };

        //   dispatch(createPost(postObject));
        var updates = {};
        updates["/usersCraft/" + userEmail + "/posts/" + idPost] = postObject;
        updates[
          "/currentDay/" + currentDay + "/posts/" + idPost
        ] = currentDayObject;
        // updates['/posts/' + user +  newPostKey] = postData;
        // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
        basicfirebasecrudservices.updateFirebaseNode(updates);
        // return firebase.database().ref().update(updates);
      }
    }
  }

  return  <Card bg={"light"} style={{ width: "95%", margin: "1rem" }}>
        <Card.Header>{header}</Card.Header> 
       <Card.Body>
         
         <Card.Title>{!!setId ? setId : ""} {title}</Card.Title>
           {!!imageurl ? (
             <Card.Img variant="top" src={imageurl} />
           ) : null}

           {/* {!!props?.laboratoryChart ? <GetChartForQuiz laboratoryChart={props.laboratoryChart} /> : null} */}
           <div dangerouslySetInnerHTML={{ __html: text }} />
       
           
             <Form.Group controlId={"formBasicCheckbox"} >
               {choices.map((item, index) =>
                 <Form.Check
                   key={index}
                   type='radio' // "checkbox"
                   label={item}
                   onChange={handleCheckboxChange}
                   name={"item"}
                   id={item}
                   className="mb-2"
                 />
               )}
             </Form.Group>


         </Card.Body>
         <InputGroup size="sm" style={{ width: "95%", margin: "1rem" }}>



           {showAnswer ? (<>
             <InputGroup.Text id="basic-addon1">
               <span
                 className={answerIsRight ? "text-success text-break" : "text-danger text-break"}
               >
                 Правильный ответ: {answers[0]}
               </span>
             </InputGroup.Text>
             {!!hint ? <div className="text-secondary ml-3 mb-2 text-break" dangerouslySetInnerHTML={{ __html: hint }} />
 :               null}</>
           ) : <Button variant="outline-secondary" onClick={handleCheckAnswer}>
               Ответ
             </Button>
           }
         </InputGroup>


    </Card>


}









function SingleQuizCardWithStorage(props) {
   let randomNumber = Math.random() * 10;

  // if (props.type === "accountingwithprofitscash") {
  //   return <CaseAccountingWithTasks {...props} randomNumber={randomNumber}
  //   />;
  // }
  // if (props.type === "casewithrandomnumber") {
  //   return <CaseWithRandomNumber {...props} randomNumber={randomNumber} />;
  // }

  if (props.text.includes("{=")) {
    return <QuizWithRandomNumber {...props} randomNumber={randomNumber} />;
  }

  if (!!props?.choices) {
    let { choices, ...other } = props;
    return <MultipleChoicesQuiz
      choices={shuffle(choices)} {...other}
    />;
  }



  return <Card style={{ width: '800px' }}>
    <Card.Img variant="top"
      src="https://images.unsplash.com/photo-1456574808786-d2ba7a6aa654?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
    <Card.Body>
      <Card.Title>SingleQuizCardWithStorage</Card.Title>
    </Card.Body>
  </Card>


  // (
  //   <>
  //     <Card bg={"light"} style={{ width: "95%", margin: "1rem" }} key={props.key}>
  //       <Card.Header onClick={handleShow}>{props.header}</Card.Header>
  //       <Card.Body>
  //         {!!props.imageurl ? (
  //           <Card.Img variant="top" src={props.imageurl} />
  //         ) : null}
  //         <Card.Title>{props.title}</Card.Title>
  //         <div
  //           dangerouslySetInnerHTML={{ __html: props.text }}
  //         />
  //         <div>{props.children}</div>

  //       </Card.Body>
  //     </Card>

  //   </>
  // );
}

function QuizCardWithStorage(props) {
  let { user, avatarUrl, userEmail } = useSelector(selectApplication)

  if (!!props?.set) {
    return <QuizSet {...props} email={user} user={user} avatarUrl={avatarUrl} userEmail={userEmail} />
  }
  return <SingleQuizCardWithStorage  {...props} email={user} user={user} avatarUrl={avatarUrl} userEmail={userEmail} />



  // return <Card style={{ width: '800px' }}>
  //     <Card.Img variant="top"
  //       src="https://images.unsplash.com/photo-1456574808786-d2ba7a6aa654?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
  //     <Card.Body>
  //       <Card.Title>QuizCardWithStorage</Card.Title>
  //     </Card.Body>
  //   </Card>

  // if (props?.type === "OneRandomManyAnswers") { return <OneRandomManyAnswers {...props} /> }
  // return <div>
  //   {!!props?.set ? <QuizSet {...props} email={user} user={user} avatarUrl={avatarUrl} userEmail={userEmail} /> :
  //     <SingleQuizCardWithStorage  {...props} email={user} user={user} avatarUrl={avatarUrl} userEmail={userEmail} />}
  // </div>
}




let set = [
    {
    header: "Типовая задача", title: "Коэффициент абсолютной ликвидности", theme: "Анализ финсостояния и хоздеятельности",
    text: `<table>
      <tbody>
      <tr>
      <th>АКТИВЫ</th>
      <th>ПАССИВЫ</th>
      </tr>
      </tbody>
      <tbody>
      <tr>
      <td>Основные средства {=3000+2*{var1-10}*100}</td>
      <td>Уставный капитал {=2000-{var1-10}*100}</td>
      </tr>
      <tr>
      <td>Материалы {=2000-2*{var1-10}*100}</td>
      <td>Нераспределенная прибыль {=2000+{var1-10}*100}</td>
      </tr>
      <tr>
      <td>Незавершенное производство 1000</td>
      <td></td>
      </tr>
      <tr>
      <td>Готовая продукция 500 </td>
      <td>Долгосрочные обязательства {=2000-2*{var1-10}*100}</td>
      </tr>
      <tr>
      <td>Дебиторская задолженность 1000</td>
      <td>Краткосрочный кредит 1000</td>
      </tr>
      <tr>
      <td>Деньги 500</td>
      <td>Кредиторская задолженность {=1000+2*{var1-10}*100}</td>
      </tr>
      </tbody>
      </table>`,
    answer: "500/(2000+2*{var1-10}*100)"
  },
  {
    header: "Типовая задача", title: "Покупка материалов у поставщиков", theme: "Планирование и бюджетирование",
    text: "Как изменяется баланс при покупке материалов у поставщиков?",
    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
    answers: ["А+Х, П+X"]
  },

  {
    header: "Типовая задача", title: "Передача материалов в производство", theme: "Планирование и бюджетирование",
    text: "Как изменяется баланс при передаче материалов в производство?",
    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
    answers: ["А+Х, А-Х"]
  },

  {
    header: "Типовая задача", title: "Передача на склад готовой продукции", theme: "Планирование и бюджетирование",
    text: "Как изменяется баланс при передаче на склад готовой продукции?",
    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
    answers: ["А+Х, А-Х"]
  },

  {
    header: "Типовая задача", title: "Списание со склада готовой продукции при продаже", theme: "Планирование и бюджетирование",
    text: "Как изменяется баланс при списании со склада готовой продукции при продаже?",
    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
    answers: ["А-Х, П-Х"]
  },

  {
    header: "Типовая задача", title: "Начисление задолженности покупателя на момент продажи (признании выручки)", theme: "Планирование и бюджетирование",
    text: "Как изменяется баланс при начислении задолженности покупателя на момент продажи (признании выручки)?",
    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
    answers: ["А+Х, П+X"]
  },

  {
    header: "Типовая задача", title: "Поступление денежных средств на расчетный счет от покупателя в счет ранее выполненной продажи", theme: "Планирование и бюджетирование",
    text: "Как изменяется баланс при поступлении денежных средств на расчетный счет от покупателя в счет ранее выполненной продажи?",
    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
    answers: ["А+Х, А-Х"]
  },

  {
    header: "Типовая задача", title: "Перечисление денежных средств с расчетного счета поставщикам в счет ранее полученных ценностей", theme: "Планирование и бюджетирование",
    text: "Как изменяется баланс при перечислении денежных средств с расчетного счета поставщикам?",
    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
    answers: ["А-Х, П-Х"]
  },

  {
    header: "Типовая задача", title: "Начисление заработной платы основным производственным рабочим", theme: "Планирование и бюджетирование",
    text: "Как изменяется баланс при начислении заработной платы основным производственным рабочим?",
    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
    answers: ["А+Х, П+X"]
  },

  {
    header: "Типовая задача", title: "Начисление взносов по социальному страхованию", theme: "Планирование и бюджетирование",
    text: "Как изменяется баланс при начислении взносов по социальному страхованию?",
    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
    answers: ["А+Х, П+X"]
  },

  {
    header: "Типовая задача", title: "Уплата налога в бюджет с расчетного счета", theme: "Планирование и бюджетирование",
    text: "Как изменяется баланс при уплате налога в бюджет с расчетного счета?",
    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
    answers: ["А-Х, П-Х"]
  },

  {
    header: "Типовая задача", title: "Уплата социальных взносов с расчетного счета", theme: "Планирование и бюджетирование",
    text: "Как изменяется баланс при уплате социальных взносов с расчетного счета?",
    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
    answers: ["А-Х, П-Х"]
  },

  // {
  //   header: "Типовая задача", title: "Начисление (удержание) налога на доходы физических лиц", theme: "Планирование и бюджетирование",
  //   text: "Как изменяется баланс при начислении (удержании) налога на доходы физических лиц?",
  //   choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
  //   answers: ["П+Х, П-Х"]
  // },

  // {
  //   header: "Типовая задача", title: "Получение денежных средств в кассу с расчетного счета", theme: "Планирование и бюджетирование",
  //   text: "Как изменяется баланс при получении денежных средств в кассу с расчетного счета?",
  //   choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
  //   answers: ["А+Х, А-Х"]
  // },

  // {
  //   header: "Типовая задача", title: "Выплата заработной платы из кассы", theme: "Планирование и бюджетирование",
  //   text: "Как изменяется баланс при выплате заработной платы из кассы?",
  //   choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
  //   answers: ["А-Х, П-Х"]
  // },

  // {
  //   header: "Типовая задача", title: "Формирование уставного капитала", theme: "Планирование и бюджетирование",
  //   text: "Как изменяется баланс при формировании уставного капитала?",
  //   choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
  //   answers: ["А+Х, П+X"]
  // },

  // {
  //   header: "Типовая задача", title: "Взнос учредителем денежных средств в кассу", theme: "Планирование и бюджетирование",
  //   text: "Как изменяется баланс при взносе учредителем денежных средств в кассу?",
  //   choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
  //   answers: ["А+Х, А-Х"]
  // },

  // {
  //   header: "Типовая задача", title: "Получение краткосрочного кредита на расчетный счет", theme: "Планирование и бюджетирование",
  //   text: "Как изменяется баланс при получении краткосрочного кредита на расчетный счет?",
  //   choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
  //   answers: ["А+Х, П+X"]
  // },

  // {
  //   header: "Типовая задача", title: "Начисление процентов по кредиту", theme: "Планирование и бюджетирование",
  //   text: "Как изменяется баланс при начислении процентов по кредиту?",
  //   choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
  //   answers: ["П+Х, П-Х"]
  // },

  // {
  //   header: "Типовая задача", title: "Уплата процентов по кредиту и погашение основной суммы долга", theme: "Планирование и бюджетирование",
  //   text: "Как изменяется баланс при уплате процентов по кредиту и погашении основной суммы долга?",
  //   choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
  //   answers: ["А-Х, П-Х"]
  // },

  // {
  //   header: "Типовая задача", title: "Начисление дивидендов акционерам", theme: "Планирование и бюджетирование",
  //   text: "Как изменяется баланс при начислении дивидендов акционерам?",
  //   choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
  //   answers: ["П+Х, П-Х"]
  // },
]