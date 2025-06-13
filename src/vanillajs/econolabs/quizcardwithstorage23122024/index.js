
//import timeout from "../../../utlities/timeout.js";


import EconolabsChoiceQuiz from '../../../utlities/econolabschoicequiz.js';
import EconolabsCheckQuiz from '../../../utlities/econolabscheckquiz.js';
import { debounce } from 'lodash-es';

import createRtkFirebaseStore, {
    // setAvatar,
    api,
    setUser, setSelectedOption, setInitialQuizOptions,
    setActivePage, setSelectedOptions, addCorrectQuiz, loadCorrectquizes
} from '../../../utlities/creatertkfirebasestore.js';
import identifyQuiz from '../../../utlities/identifyQuiz.js';
import doLogin from '../../../utlities/doLogin.js';
import getUser from '../../../utlities/getUser.js';
import processquizwithrandomnumber from "../../../utlities/processquizwithrandomnumber.js";
import markupForDataArray from '../../../utlities/markupForDataArray.js';
import foundQuiz from '../../../utlities/foundQuiz.js';



/**
  * Const and Selectors
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const parser = new formulaParser.Parser();

const store = createRtkFirebaseStore();


//let resOpenQuizes;
//let resUserAvatar;
let resUserPosts;
let resQuizesArray;
//let resOpenQuizesCasesIds;
let resOpenQuizCaseById;

/**
  * Functions
*/


function doSaveQuiz(answer, type, content, quizString) {
    let { userEmail, user, avatarUrl, email, activePage } = store.getState().application;
    let { title, theme, text, hint = "", dataArray = [] } = resQuizesArray.data[activePage];
    let idPost = getFirebaseNodeKey("usersCraft/" + userEmail + "/posts")
    let currentDay = new Intl.DateTimeFormat("en", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    })
        .format(new Date())
        .replace(/[^a-zA-Z0-9]/g, "_");

    let postObject = {
        id: idPost,
        title: title,
        theme: theme,
        comment: title + " (" + theme + ")",
        type, answer, content, quizString,
        deleted: false,
        email: email,
        user: user,
        avatarUrl: avatarUrl,
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
        avatarUrl: avatarUrl,
        timestamp: +Date.now(),
    };
    let updates = {};

    updates["usersCraft/" + userEmail + "/posts/" + idPost] = postObject;
    updates[
        "currentDay/" + currentDay + "/posts/" + idPost
    ] = currentDayObject;
    //     console.log(updates);

    store.dispatch(api.endpoints.updatesForOpenQuizes.initiate({
        base: "",
        updates: updates
    }))
        .then(() => {
            //       console.log(identifyQuiz(title, text));
            store.dispatch(addCorrectQuiz(identifyQuiz(title, text)));
            $("#answerButton").classList.toggle("btn-outline-primary");
            $("#answerButton").classList.toggle("btn-success");
            $("#quizHint").innerHTML = hint;
            $("#answerButton").disabled = true;
        });
}


function handleCheckQuiz(e) {
    e.preventDefault();
    //   console.log("Do Calculate");
    let { selectedoption, selectedoptions, activePage } = store.getState().application;
    let { text, answer, hint = "",
        dataArray = [], type, answers = []
    } = resQuizesArray.data[activePage];
    let checkquiz = false, comment = "", reqanswer, quizString, posttype;
    $("#userComment").style.display = "none";

    try {
        let feedback = $("#userComment").value;
        //     console.log(feedback);
        comment = feedback !== "Мой комментарий" ? feedback : ""
    } catch {
        comment = ""
    }
    //    let idsToDelete = null;


    const formData = new FormData($("#quizform"));
    let formulares = {};
    for (const [key, value] of formData) { formulares[key] = value }
    //   console.log(formulares);

    if (type === "accounting" && ($("#debet").value + $("#credit").value === answers[0])) {
        //   console.log($("#debet").value + $("#credit").value);
        //   console.log(answers[0]);
        checkquiz = true;
        reqanswer = "Дт " + $("#debet").value + " Кт " + $("#credit").value;
        quizString = text + "<br>" + hint + "<br>" + comment;
        posttype = "multiplechoices"
    }

    if (type === "multiplechoices" && answers.length === 1 && selectedoption === answers[0]) {
        checkquiz = true;
        reqanswer = selectedoption;
        quizString = text + "<br>" + hint + "<br>" + comment;;
        posttype = "multiplechoices";
        // idsToDelete = resUserPosts.data
        //     .filter(item => item.content === text)
        //     .map(item => item.id);
    }

    if (type === "multiplechoices" && answers.length > 1) {
        if (selectedoptions.length === answers.length) {
            checkquiz = true
            selectedoptions.map(item => {
                if (!answers.includes(item)) { checkquiz = false }
            })
        }
        reqanswer = selectedoptions.map(item => item).join("   ");
        quizString = text + "<br>" + hint + "<br>" + comment;;
        posttype = "multiplechoices";
        // idsToDelete = checkquiz ? resUserPosts.data
        //     .filter(item => item.content === text)
        //     .map(item => item.id) : null;
    }

    if (type === "quizwithrandomnumber") {
        let res = processquizwithrandomnumber({ quizString: text, answer: answer, randomNumber: store.getState().application.selectedoption });
        reqanswer = res.answer;
        quizString = res.quizString + "<br>" + hint + "<br>" + comment;;
        posttype = "multiplechoices"
        //   console.log(reqanswer);
        let value = $("#feedback").value;
        //    console.log(value);
        //    console.log(reqanswer);
        if (
            parseFloat(value) / parseFloat(reqanswer) < 1.02 &&
            parseFloat(value) / parseFloat(reqanswer) > 0.98
        ) {
            checkquiz = true;
            if ($("#inputFormula").value.length > 2) {
                hint = hint + "<br>" + $("#inputFormula").value
            }
        }
    }

    if (type === "casewithrandomnumber") {
        parser.on('callRangeValue', function (startCellCoord, endCellCoord, done) {
            var fragment = [];
            for (var row = startCellCoord.row.index; row <= endCellCoord.row.index; row++) {
                var rowData = dataArray[row];
                var colFragment = [];
                for (var col = startCellCoord.column.index; col <= endCellCoord.column.index; col++) {
                    colFragment.push(rowData[col]);
                }
                fragment.push(colFragment);
            }
            if (fragment) { done(fragment); }
        });
        //  let res = parser.parse('INTERCEPT(D2:D12, B2:B12)');
        let res = parser.parse(formulares[Object.keys(formulares)[0]].slice(1));
        //      console.log(res);
        let quizres = parser.parse(answer);
        //      console.log(quizres.result)
        if (!res?.error && !quizres?.error) {
            if (
                parseFloat(quizres.result) / parseFloat(res.result) < 1.02 &&
                parseFloat(quizres.result) / parseFloat(res.result) > 0.98
            ) {
                checkquiz = true;
                $("#formularesult").innerHTML = res.result;
                reqanswer = "=" + answer;
                quizString = text + "<br>" + markupForDataArray(dataArray) +
                    "<br>" + hint + "<br>" + comment;;
                posttype = "multiplechoices"
            }
        }
    }

    if (checkquiz) {
        doSaveQuiz(reqanswer, posttype, quizString, quizString)

    } else {
        $("#answerButton").classList.toggle("btn-danger");
        $("#answerButton").classList.toggle("btn-outline-primary");
        $("#quizHint").innerHTML = hint;
        $("#answerButton").disabled = true;
    }
}

function doCheck(value) { store.dispatch(setSelectedOption(value)) }

function doToggleCheck(value) {
    let selectedoptions = store.getState().application.selectedoptions.map(item => item);
    const index = selectedoptions.indexOf(value);
    if (index > -1) {
        selectedoptions.splice(index, 1);
        store.dispatch(setSelectedOptions(selectedoptions))
    }
    else {
        store.dispatch(setSelectedOptions([...selectedoptions, value]))
    }
}


async function fetchQuizHint(activePage) {
    let quiz = resQuizesArray.data[activePage];
    //  console.log("fetchQuizHint(activePage)")
    resOpenQuizCaseById = await store.dispatch(api.endpoints.fetchOpenQuizCaseById.initiate(quiz.quizesCasesId));
    //    console.log(resOpenQuizCaseById.data);
    let hint = quiz?.hint ? quiz.hint : "";
    if (!!resOpenQuizCaseById.data?.hint) {
        hint = resOpenQuizCaseById.data.hint + "<br>" + hint
    }
    if (!!resOpenQuizCaseById.data?.exampleSpreadsheet) {
        hint = resOpenQuizCaseById.data.exampleSpreadsheet + "<br>" + hint
    }
    $("#quizHint").innerHTML = hint;
    updateQuiz(activePage)
}

function updateQuiz(activePage) {
    let quiz = resQuizesArray.data[activePage];
    //    console.log(quiz);
    $("#quizformdataarray").style.display = "none";

    $("#usercalculations").style.display = "none";
    $("#inputFormula").value = "";
    $("#resformula").innerHTML = "<small class='text-muted'>Песочница, попробуйте =2+2 или =AVERAGE(B2:B13)</small>";
    $("#answerButton").disabled = false;
    $("#quizTitle").innerHTML = quiz.title;
    $("#quizHeader").innerText = quiz.header + " " + (activePage + 1);

    $("#userComment").style.display = "block";
    $("#answerButton").className = "btn btn-outline-primary m-3";
    $("#answerButton").style.display = "block";



    if (quiz?.type === "casewithrandomnumber" && Array.isArray(quiz?.dataArray)) {
        $("#usercalculations").style.display = "block";
        //     let res = processquizwithrandomnumber({ quizString: quiz.text, answer: quiz.answer, randomNumber: store.getState().application.selectedoption });
        //     console.log(res.answer)
        $("#quizformdataarray").innerHTML = markupForDataArray(quiz?.dataArray) + "<br>" + quiz?.text + "<hr>";
        $("#quizformdataarray").style.display = "block";
        $("#quizHint").innerHTML = quiz?.hint;
    }

    if (quiz.type === "multiplechoices") {
        $("#quizString").innerHTML = quiz.text;
        if (quiz.answers.length > 1) {
            chectQuiz.addEvents(quiz.choices)
        } else { choiceQuiz.addEvents(quiz.choices) }
        //    $("#quizcontainer").style.display = "block";
    }

    if (quiz.type === "accounting") {
        $("#quizString").innerHTML = quiz.text;


        let markup = `
           <div class="row m-1 g-1">
                <div class="col-12 col-md-6">
                    <select class="form-select form-select-sm" aria-label="debet" id="debet" name="debet"">
                    ${'<option value="...">Дебет</option>' +
            quiz.choices
                .map(item => {
                    return `<option value="${item}">${item}</option>`
                })
                .join("")
            }                       
                    </select>
                </div>
                <div class="col-12 col-md-6">
                    <select class="form-select form-select-sm" aria-label="credit" id="credit" name="credit">
                       ${'<option value="...">Кредит</option>' +
            quiz.choices
                .map(item => {
                    return `<option value="${item}">${item}</option>`
                })
                .join("")
            }
                    </select>
                </div>
           </div>
           `;

        $("#accountingblock").innerHTML = markup;
        $("#accountingblock").style.display = "block";
    }

    if (quiz.type === "quizwithrandomnumber") {
        $("#usercalculations").style.display = "block";
        let res = processquizwithrandomnumber({ quizString: quiz.text, answer: quiz.answer, randomNumber: store.getState().application.selectedoption });
        //     console.log(res.answer)
        $("#quizString").innerHTML = res.quizString;
        $("#quizChecks").innerHTML = `
            <div class="input-group input-group-sm mb-3">
                <span class="input-group-text" id="inputGroup-sizing-sm">Число</span>
                <input type="text" class="form-control" aria-label="quizinput" aria-describedby="quiz-input-sm" id="feedback">
            </div>`;
    }

    renderPagination()
}

// function foundQuiz(text) {
//     let correctquizes = store.getState().application.correctquizes;
//     let res = false;
//     correctquizes.forEach(item => {
//         if (typeof (item) === 'string' && item.includes(text)) { res = true }
//     })
//     return res
// }


function renderPagination() {
    let correctquizes = store.getState().application.correctquizes;
    $("#quizbuttonslist").innerHTML = resQuizesArray.data.map((item, index) => {
        return `<button
        class='${foundQuiz(
            identifyQuiz(item.title, item.text),
            correctquizes
        )
                ? "btn btn-sm btn-success page m-1" : "btn btn-sm btn-outline-secondary page m-1"}'
        page=${index}
       >
        ${index + 1}
        </button>`
    }).join("") +
        `<a href="/myworkbook" title="Рабочая тетрадь" class="btn btn-sm btn btn-outline-primary m-1" target="_blank">РТ</a>`
        ;

    let pagesLi = [...$$(".page")];
    pagesLi.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            const pageNumber = parseInt(event.target.getAttribute("page"));
            store.dispatch(setInitialQuizOptions());
            store.dispatch(setActivePage(pageNumber));
            $("#userComment").value = "Мой комментарий";
            $("#quizChecks").innerHTML = "";
            $("#accountingblock").style.display = "none";
            $("#quizHint").innerHTML = "";
            $("#quizTitle").innerHTML = "";
            $("#quizString").innerHTML = "";
            if (!!resQuizesArray.data[pageNumber]?.quizesCasesId) {
                fetchQuizHint(pageNumber)
            } else { updateQuiz(pageNumber) }
        }, false);
    })
}

let debounce_callRangeValueСalculation = debounce(function (dataArray, answer) {
    parser.on('callRangeValue', function (startCellCoord, endCellCoord, done) {
        var fragment = [];
        for (var row = startCellCoord.row.index; row <= endCellCoord.row.index; row++) {
            var rowData = dataArray[row];
            var colFragment = [];
            for (var col = startCellCoord.column.index; col <= endCellCoord.column.index; col++) {
                colFragment.push(rowData[col]);
            }
            fragment.push(colFragment);
        }
        if (fragment) { done(fragment); }
    });
    let res = parser.parse(answer.slice(1));
    //   console.log(res);
    if (!res.error) {
        $("#resformula").innerText = res.result;
        "<small class='text-muted'>Песочница, попробуйте =2+2 или =AVERAGE(B2:B13)</small>"
    }

}, 275);

let debounce_callCellValueСalculation = debounce(function (answer) {
    parser.on('callCellValue', function (cellCoord, done) {
        // using label
        // if (cellCoord.label === 'B$6') {
        //   done('hello');
        // }
        // or using indexes
        // if (cellCoord.row.index === 5 && cellCoord.row.isAbsolute && cellCoord.column.index === 1 && !cellCoord.column.isAbsolute) {
        //   done('hello');
        // }

        // if (cellCoord.label === 'C6') {
        //   done(0.75);
        // }
        if (!!cellCoord) {
            done();
        }
    });

    //   parser.parse('B$6'); // returns `"hello"`
    //   parser.parse('B$6&" world"'); // returns `"hello world"`
    //   parser.parse('FISHER(C6)');
    let res = parser.parse(answer.slice(1));
    //  console.log(res);
    if (!res.error) {
        $("#resformula").innerText = res.result;
        "<small class='text-muted'>Песочница, попробуйте =2+2 или =AVERAGE(B2:B13)</small>"
    }

}, 275);


let debounce_OneCellValculation = debounce(function (answer) {
    $("#resformula").innerText = processquizwithrandomnumber({
        quizString: "this {={var1-10}+1} some {=2+{var1-10}} that can be {=3+{var1-10}} with a {=4+{var1-10}} function",
        answer: answer.substring(1),
        randomNumber: 0.5
    }).answer
}, 275);


function doCalcRes(e) {
    e.preventDefault();

    let answer = $("#inputFormula").value;
    let activePage = store.getState().application.activePage;
    let { dataArray = [], type } = resQuizesArray.data[activePage];

    if (type.includes("case")) {
        if (answer.includes(":")) {
            debounce_callRangeValueСalculation(dataArray, answer)
        } else { debounce_callCellValueСalculation(answer) }
    } else {
        debounce_OneCellValculation(answer)
    }
}


/**
  * HTML event listeners
*/

$("#loginbutton").addEventListener("click", (e) => doLogin(e), false);
$("#quizform").addEventListener(`submit`, handleCheckQuiz);
const choiceQuiz = new EconolabsChoiceQuiz("quizChecks", doCheck);
const chectQuiz = new EconolabsCheckQuiz("quizChecks", doToggleCheck);
$("#inputFormula").addEventListener("input", (e) => doCalcRes(e), false);




/**
  * Initial load
*/

async function initialLoad() {
    let res = await getUser();
    //  console.log(res.email);       
    if (!res) {
        $("#formcontainer").style.display = "block";
    } else {
        resUserPosts = await store.dispatch(api.endpoints.fetchUserPosts.initiate(res.userEmail)); 
        resQuizesArray = await store.dispatch(api.endpoints.fetchQuizesArray.initiate());
        store.dispatch(loadCorrectquizes([...new Set(
            resUserPosts.data
                .map(item => {
                    return identifyQuiz(item.title, item?.quizString)
                }))]))
        store.dispatch(setUser(res));

        //  resOpenQuizesCasesIds = await store.dispatch(api.endpoints.fetchOpenQuizesCasesIds.initiate());
        //  console.log(resOpenQuizesCasesIds.data.filter(item => item.theme === 'Основные корпоративные налоги'))

    }
}


initialLoad().then(() => {
    //    console.log("Done");
    $("#quizcontainer").style.display = "block";
    renderPagination()
});

