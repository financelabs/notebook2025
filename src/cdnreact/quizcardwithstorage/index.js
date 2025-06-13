//import React, { useState, useCallback } from "react";
let useState = React.useState;
let useReducer = React.useReducer;
let useEffect = React.useEffect;
let createContext = React.createContext;
let useContext = React.useContext;


let {
    Navbar, Button, ButtonGroup, Card, InputGroup,
    Container, Row, Col, Form, Collapse, FormControl
} = ReactBootstrap;

const ApplicationContext = createContext(null);


function QuizWithRandomNumber(props) {
    const [value, setValue] = useState("");
    const [showAnswer, setShowAnswer] = useState(null);
    const [answerIsRight, setAnswerIsRight] = useState(null);
    const selectApplication = useContext(ApplicationContext);
    const content = [["=2+2"]]; // useSelector(selectSpreadsheetProtoData);

    console.log(props);

    function handleChange(event) {
        setValue(event.target.value);
    }

    let parser = new formulaParser.Parser();

    let quizString = props.text;
    //let quizString = `this {={var1-10}+1} some {=2+{var1-10}} that can be {=3+{var1-10}} with a {=4+{var1-10}} function`;
    const searchRegExp = /{var1-10}/g;
    const replaceWith = props.randomNumber.toString();
    quizString = quizString.replace(searchRegExp, replaceWith);

    let answer = props.answer.replace(searchRegExp, replaceWith);
    answer = Math.round(parser.parse(answer).result * 1000) / 1000;

    let stringExtractor = basicfirebasecrudservices.extract(["{=", "}"]);
    let stuffIneed = stringExtractor(quizString);
    //console.log(stuffIneed);
    // Outputs: [ 'is', 'text', 'extracted', 'reusable' ]

    for (let i = 0; i < stuffIneed.length; i++) {
        let feedback = Math.round(parser.parse(stuffIneed[i]).result * 1000) / 1000;
        // console.log(answer);
        quizString = quizString.replace("{=" + stuffIneed[i] + "}", feedback);
    }

    function handleCheckAnswer() {
        let { email, user, avatarUrl, userEmail } = selectApplication;
        setShowAnswer(true);
        if (
            parseFloat(value) / parseFloat(answer) < 1.02 &&
            parseFloat(value) / parseFloat(answer) > 0.98
        ) {
            setAnswerIsRight(true);
            if (email.length > 6) {

                let idPost = basicfirebasecrudservices.getFirebaseNodeKey("/usersCraft/" + userEmail + "/posts/");
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
                    title: props.title,
                    theme: props.theme,
                    answer: answer,
                    comment: props.title + " (" + props.theme + ")", //Тема
                    type: "spreadsheet",
                    content: basicfirebasecrudservices.createProtoObject(content),
                    quizString: quizString,
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

                let currentDayObject = {
                    id: idPost,
                    title: props.title,
                    theme: props.theme,
                    email: email,
                    user: user,
                    avatarUrl: !!avatarUrl ? avatarUrl : null,
                    timestamp: +Date.now(),
                };


                var updates = {};
                updates["/usersCraft/" + userEmail + "/posts/" + idPost] = postObject;
                updates[
                    "/currentDay/" + currentDay + "/posts/" + idPost
                ] = currentDayObject;
                basicfirebasecrudservices.updateFirebaseNode(updates).then(() => console.log(updates));
            }
        }
    }

    return <Card bg={"light"} style={{ width: "95%", margin: "1rem" }}>
        <Card.Header>{props.header}</Card.Header>
        <Card.Body>
            <Card.Title>{!!props?.setId ? props.setId : ""} {props.title}</Card.Title>
            <Card.Text dangerouslySetInnerHTML={{ __html: quizString }} > </Card.Text>
            {!!props?.media && <ShowQuizMedia media={props.media} randomNumber={props.randomNumber} />}
            {/* <SpreadsheetLayout quizString={quizString} theme={props.theme} /> */}
        </Card.Body>

        {showAnswer ? (
            <InputGroup size="sm" style={{ width: "95%", margin: "1rem" }}>
                <InputGroup.Prepend>

                    <InputGroup.Text id="basic-addon1">
                        <span
                            className={answerIsRight ? "text-success" : "text-danger"}
                        >
                            Правильный ответ: {answer}
                        </span>
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    value={value}
                    type="number"
                    onChange={handleChange}
                    aria-label="Answer"
                    aria-describedby="inputGroup-answer"
                    readOnly
                />
            </InputGroup>
        ) : (
            <InputGroup size="sm" style={{ width: "95%", margin: "1rem" }}>
                <InputGroup.Prepend>
                    <Button variant="outline-secondary" onClick={handleCheckAnswer}>
                        Ответ
                    </Button>
                </InputGroup.Prepend>
                <FormControl
                    value={value}
                    type="number"
                    onChange={handleChange}
                    aria-label="Answer"
                    aria-describedby="inputGroup-answer"
                />
            </InputGroup>
        )}

        {!!props?.hint && showAnswer ? (
            <Card.Text><div className="text-secondary ml-3 mb-2"
                dangerouslySetInnerHTML={{ __html: props.hint }}
            >

            </div></Card.Text>

        ) : // <ReactMarkdown source={props.hint} escapeHtml={false} /></div>
            null}
    </Card>
}

function MultipleChoicesQuiz(props) {
    const [showAnswer, setShowAnswer] = useState(null);
    const [answerIsRight, setAnswerIsRight] = useState(null);
    const [value, setValue] = useState("");
    const selectApplication = useContext(ApplicationContext);

    function handleCheckboxChange(event) {
        setValue(event.target.id);
    }

    function handleCheckAnswer() {
        let { email, user, avatarUrl, userEmail } = selectApplication;
        setShowAnswer(true);
        if (value === props.answers[0]) {
            setAnswerIsRight(true);

            if (email.length > 6) {

                let idPost = basicfirebasecrudservices.getFirebaseNodeKey("/usersCraft/" + userEmail + "/posts/");
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
                    title: props.title,
                    theme: props.theme,
                    answer: props.answers[0],
                    comment: props.title + " (" + props.theme + ")", //Тема
                    type: "multiplechoices",
                    content: props.text,
                    quizString: props.text,
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
                    title: props.title,
                    theme: props.theme,
                    email: email,
                    user: user,
                    avatarUrl: !!avatarUrl ? avatarUrl : null,
                    timestamp: +Date.now(),
                };

                // dispatch(createPost(postObject));
                var updates = {};
                updates["/usersCraft/" + userEmail + "/posts/" + idPost] = postObject;
                updates[
                    "/currentDay/" + currentDay + "/posts/" + idPost
                ] = currentDayObject;
                console.log(new Intl.DateTimeFormat("ru", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                }).format(new Date()));
                basicfirebasecrudservices.updateFirebaseNode(updates).then(() => console.log(updates));
            }
        }
    }

    return <Card bg={"light"} style={{ width: "95%", margin: "1rem" }}>
        <Card.Header>{props.header}</Card.Header>
        <Card.Body>
            <Card.Title>{!!props?.setId ? props.setId : ""} {props.title}</Card.Title>
            {!!props?.imageurl ? (
                <Card.Img variant="top" src={props.imageurl} />
            ) : null}

            {!!props?.laboratoryChart ? <GetChartForQuiz laboratoryChart={props.laboratoryChart} /> : null}
            <Card.Text dangerouslySetInnerHTML={{ __html: props.text }} ></Card.Text>
            <Card.Text>
                {/*       <ReactMarkdown source={props.text} escapeHtml={false} /> */}
                <Form.Group controlId={"formBasicCheckbox"} >
                    {props.choices.map((item, index) =>
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

            </Card.Text>
        </Card.Body>
        <InputGroup size="sm" style={{ width: "95%", margin: "1rem" }}>
            <InputGroup.Prepend>
                {showAnswer ? (
                    <InputGroup.Text id="basic-addon1">
                        <span
                            className={answerIsRight ? "text-success" : "text-danger"}
                        >
                            Правильный ответ: {props.answers[0]}
                        </span>
                    </InputGroup.Text>
                ) : (
                    <Button variant="outline-secondary" onClick={handleCheckAnswer}>
                        Ответ
                    </Button>
                )}
            </InputGroup.Prepend>
        </InputGroup>
    </Card>


}


function SingleQuizCardWithStorage(props) {
    console.log(props);
    let randomNumber = Math.random() * 10;

    if (!!props?.text && props.text.includes("{=")) {
        return <QuizWithRandomNumber {...props} randomNumber={randomNumber} />;
    }

    if (!!props?.choices) {
        let { choices, ...other } = props;
        return <MultipleChoicesQuiz choices={basicfirebasecrudservices.shuffle(choices)} {...other} />;
    }



    return <Card bg={"light"} style={{ width: "95%", margin: "1rem" }} key={props.key}>
        <Card.Header>{props.header}</Card.Header>
        <Card.Body>
            {!!props.imageurl ? (
                <Card.Img variant="top" src={props.imageurl} />
            ) : null}
            <Card.Title>{props.title}</Card.Title>

            <Card.Text dangerouslySetInnerHTML={{ __html: props.text }}>
                {/* <ReactMarkdown source={props.text} escapeHtml={false} /> */}
            </Card.Text>
            {props.children}
        </Card.Body>
    </Card>
}


function QuizSet({ user, set, setTitle, avatarUrl }) {
    const [selectedQuiz, setSelectedQuiz] = useState(0);
    const [loading, setLoading] = useState(false);

    function doSelectQuiz(index) {
        setLoading(true);
        setSelectedQuiz(index);
        setLoading(false);
    }

    return <div>

        <Navbar bg="light">
            <Container>
                <Navbar.Brand href="#home">
                    <img
                        alt="avatarUrl"
                        src={avatarUrl}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        style={{
                            borderRadius: "50%",
                            filter: "grayscale(100%)",
                            objectFit: "cover",
                        }}
                    />
                    <span className="mx-3">{setTitle}</span>

                </Navbar.Brand>

            </Container>

            <Form inline>
                <Button variant="outline-secondary" size="sm">{user}</Button>
            </Form>

        </Navbar>
        <br />
        {/* <Navbar className="bg-light justify-content-between mb-3"> */}
        <ButtonGroup size={set.length < 5 ? "lg" : "sm"}>
            {set.map((_, index) => (
                <Button
                    variant="outline-secondary"
                    onClick={() => doSelectQuiz(index)}
                    key={index}
                >
                    {set.length < 10 ? <span className="m-2" >{index + 1}</span> : <small>{index + 1}</small>}
                </Button>
            ))}
        </ButtonGroup>
        {/* </Navbar> */}

        {loading ? <div>...</div> : <QuizCardWithStorage key={selectedQuiz} setId={selectedQuiz + 1} {...set[selectedQuiz]} />}


    </div>
}


function QuizCardWithStorage(props) {
    console.log(props)
    //  if (props?.type === "OneRandomManyAnswers") { return <OneRandomManyAnswers {...props} /> }

    return <div>
        {!!props?.set ? <QuizSet {...props} /> : <SingleQuizCardWithStorage  {...props} />}
    </div>
}

function caseReducer(state = {}, action) {
    // console.log(action);
    switch (action.type) {

        case "SEED_STATE": {
            return basicfirebasecrudservices.produce(state, (draft) => {
                Object.keys(action.payload.objects).map((key) => {
                    draft[key] = action.payload.objects[key];
                });
            });
        }

        default:
            return state;
    }
}

let initialState = {
    loading: true,
    email: null,
    user: null,
    avatarUrl: "",
    userEmail: "",
    posts: [],
}


function App() {
    const [state, dispatch] = useReducer(
        caseReducer,
        initialState
    );

    useEffect(() => {
        async function getUser() {
            let localStorageData = basicfirebasecrudservices.loadState('econolabs');
            if (!!localStorageData?.application?.email) {
                let userEmail = localStorageData?.application?.email.replace(
                    /[^a-zA-Z0-9]/g,
                    "_"
                );
                let openavatar = await basicfirebasecrudservices.getFirebaseNode({
                    url: "openavatars/" + userEmail,
                    type: "object",
                });
                return {
                    email: localStorageData?.application?.email,
                    user: localStorageData?.application?.user,
                    avatarUrl: !!openavatar?.avatarUrl
                        ? openavatar.avatarUrl
                        : !!localStorageData?.application?.avatarUrl
                            ? localStorageData.application.avatarUrl
                            : "../freelancer.jpg",
                    userEmail: userEmail
                }
            } else {
                let identity = basicfirebasecrudservices.generateUser();
                basicfirebasecrudservices.saveState({
                    application: {
                        email: identity.email,
                        user: identity.user,
                        avatarUrl: "../freelancer.jpg",
                        userEmail: identity.userEmail
                    }
                });
                return {
                    email: identity.email,
                    user: identity.user,
                    avatarUrl: "../freelancer.jpg",
                    userEmail: identity.userEmail
                }
            }
        }

        getUser().then((res) => {
            let {
                userEmail,
                email,
                user,
                avatarUrl,
            } = res;

            dispatch({
                type: "SEED_STATE",
                payload: {
                    objects: {
                        loading: false,
                        email: email,
                        user: user,
                        avatarUrl: avatarUrl,
                        userEmail: userEmail
                    },
                },
            });
        })
    }, []);


    if (state.loading) { return null }

    console.log(state);

    return <ApplicationContext.Provider value={state}>
        <QuizCardWithStorage
            avatarUrl={state.avatarUrl}
            user={state.user}
            setTitle="Тесты по балансовым уравнениям"
            set={[
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

                {
                    header: "Типовая задача", title: "Начисление (удержание) налога на доходы физических лиц", theme: "Планирование и бюджетирование",
                    text: "Как изменяется баланс при начислении (удержании) налога на доходы физических лиц?",
                    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
                    answers: ["П+Х, П-Х"]
                },

                {
                    header: "Типовая задача", title: "Получение денежных средств в кассу с расчетного счета", theme: "Планирование и бюджетирование",
                    text: "Как изменяется баланс при получении денежных средств в кассу с расчетного счета?",
                    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
                    answers: ["А+Х, А-Х"]
                },

                {
                    header: "Типовая задача", title: "Выплата заработной платы из кассы", theme: "Планирование и бюджетирование",
                    text: "Как изменяется баланс при выплате заработной платы из кассы?",
                    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
                    answers: ["А-Х, П-Х"]
                },

                {
                    header: "Типовая задача", title: "Формирование уставного капитала", theme: "Планирование и бюджетирование",
                    text: "Как изменяется баланс при формировании уставного капитала?",
                    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
                    answers: ["А+Х, П+X"]
                },

                {
                    header: "Типовая задача", title: "Взнос учредителем денежных средств в кассу", theme: "Планирование и бюджетирование",
                    text: "Как изменяется баланс при взносе учредителем денежных средств в кассу?",
                    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
                    answers: ["А+Х, А-Х"]
                },

                {
                    header: "Типовая задача", title: "Получение краткосрочного кредита на расчетный счет", theme: "Планирование и бюджетирование",
                    text: "Как изменяется баланс при получении краткосрочного кредита на расчетный счет?",
                    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
                    answers: ["А+Х, П+X"]
                },

                {
                    header: "Типовая задача", title: "Начисление процентов по кредиту", theme: "Планирование и бюджетирование",
                    text: "Как изменяется баланс при начислении процентов по кредиту?",
                    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
                    answers: ["П+Х, П-Х"]
                },

                {
                    header: "Типовая задача", title: "Уплата процентов по кредиту и погашение основной суммы долга", theme: "Планирование и бюджетирование",
                    text: "Как изменяется баланс при уплате процентов по кредиту и погашении основной суммы долга?",
                    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
                    answers: ["А-Х, П-Х"]
                },

                {
                    header: "Типовая задача", title: "Начисление дивидендов акционерам", theme: "Планирование и бюджетирование",
                    text: "Как изменяется баланс при начислении дивидендов акционерам?",
                    choices: ["А+Х, А-Х", "А+Х, П+X", "А-Х, П-Х", "П+Х, П-Х"],
                    answers: ["П+Х, П-Х"]
                },
            ]}
        />
    </ApplicationContext.Provider>


}


ReactDOM.createRoot(document.querySelector("#root")).render(<App />);

//  const getMessage = () => "Hello World";
//   document.getElementById("root").innerHTML = getMessage();

