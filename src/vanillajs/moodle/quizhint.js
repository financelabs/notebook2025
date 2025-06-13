import {
    initializeApp
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import {
    getDatabase,
    ref,
    onValue,
    // set,
    // update,
    // push,
    // child
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js';

let quizId = "-NUmjzxvLg-HU6ZzaoM5";

// let email, user, avatarUrl, userEmail = null;
// let econolabs = JSON.parse(localStorage.getItem("econolabs"));
// if (!!econolabs?.application?.email) {
//     console.log(econolabs);
//     email = econolabs.application.email;
//     userEmail = econolabs?.application?.email.replace(/[^a-zA-Z0-9]/g, "_");
// }

// let quiz = {};
let base = document.getElementById(quizId).dataset.base;

const firebaseConfig = {
    apiKey: "AIzaSyDUamZR2aXuP2rFG1AFpb1Ni8aZA5uhSj4",
    databaseURL: "https://" + base + ".firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

const quizHintRef = ref(db, "quizescases/quizesCasesIds/" + quizId);
onValue(quizHintRef, (snapshot) => {
    const res = snapshot.val();
    console.log("Quiz Hint");
    console.log(res);
    // quiz = {
    //     ...res
    // };
    // let quizhint = null
    // if (!!userEmail && !!res?.studenthints && !!res.studenthints[userEmail] && !!res.studenthints[userEmail]?.hint) {
    //     quizhint = res.studenthints[userEmail].hint;
    //     document.getElementById("inputhint").value = quizhint
    // }

    document.getElementById(quizId).innerHTML = `
            <div class="card-body m-1">
            <h5 class="card-title">${!!res?.theme ? res.theme : ""}</h5>
            <p class="card-text">${!!res?.title ? res.title : ""}</p>
            <hr />
            <div id="studenthint" class="mb-3">${!!quizhint ? applyClassToTableTag(quizhint) : ""}</div>
            <div id="hint" class="mb-3">${!!res?.hint ? applyClassToTableTag(res.hint) : ""
            }</div>
            <hr />
            <div id="examplequizstring" class="mb-3">${!!res?.exampleQuizString
                ? applyClassToTableTag(res.exampleQuizString)
                : ""
            }</div>
            <div id="examplespreadsheet" class="mb-3">${!!res?.exampleSpreadsheet ? res.exampleSpreadsheet : ""
            }</div>
        </div>     
    `
});



// function writeUserHint(hint) {
//     let econolabs = JSON.parse(localStorage.getItem("econolabs"));
//     if (!econolabs) {
//         document.getElementById("useremailinputgroup").style.removeProperty('display');
//         return null
//     }

//     let postObject = {
//         id: quizId,
//         title: quiz.title,
//         theme: quiz.theme,
//         answer: "",
//         comment: quiz.title + " (" + quiz.theme + ")", //Тема
//         type: "html",
//         content: hint,
//         quizString: "",
//         deleted: false,
//         email: email,
//         user: !!user ? user : "",
//         avatarUrl: !!avatarUrl ? avatarUrl : null,
//         date: new Intl.DateTimeFormat("ru", {
//             weekday: "short",
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//             hour: "numeric",
//             minute: "numeric",
//         }).format(new Date()), //Date().toJSON()
//     };

//     let currentDay = new Intl.DateTimeFormat("en", {
//             weekday: "short",
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//         })
//         .format(new Date())
//         .replace(/[^a-zA-Z0-9]/g, "_");

//     let currentDayObject = {
//         id: push(child(ref(db), "/currentDay/" + currentDay + "/posts/")).key,
//         title: quiz.title,
//         theme: quiz.theme,
//         email: email,
//         user: "quiz",
//         avatarUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=100",
//         timestamp: +Date.now(),
//     };



//     email = econolabs.email;
//     userEmail = email.replace(/[^a-zA-Z0-9]/g, "_");

//     const updates = {};
//     updates['/quizescases/quizesCasesIds/' + quizId + "/studenthints/" + userEmail] = {
//         email: email,
//         hint: hint
//     };
//     updates["/usersCraft/" + userEmail + "/posts/" + quizId] = postObject;
//     updates[
//         "/currentDay/" + currentDay + "/posts/" + currentDayObject.id
//     ] = currentDayObject;

//     update(ref(db), updates)
//         .then(res =>
//             document.getElementById("studenthint").innerHTML = applyClassToTableTag(hint)
//         );
// }

// let hint = document.getElementById("inputhint");
// hint.onkeyup = debounce(function(e) {
//     writeUserHint(e.target.value);
//     document.getElementById("studenthint").innerHTML = e.target.value;
// }, 3000);

// let emailinput = document.getElementById("inputemail");
// emailinput.onkeyup = debounce(function(e) {
//     if (!!e.target.value && e.target.value.length > 6)
//     email = e.target.value;
//     userEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
//     localStorage.setItem("econolabs", JSON.stringify({
//         application: {
//             email: email
//         }       
//     }));


// }, 3000);

// let quitlabel = document.getElementById("quitlabel");
// quitlabel.onclick = function(e) {
//     localStorage.removeItem("econolabs");
// }


function applyClassToTableTag(htmlstring) {
    if (!htmlstring || typeof htmlstring !== "string") return "";

    if (htmlstring.includes("table") && !htmlstring.includes("class")) {
        //         console.log("includes table");
        const regex = /table/i;
        //         console.log(htmlstring.replace(regex, 'table class="table table-sm"'));
        return htmlstring.replace(regex, 'table class="table table-sm"');
    }

    return htmlstring;
}

// function debounce(callback, wait) {
//     let timeoutId = null;
//     return (...args) => {
//         window.clearTimeout(timeoutId);
//         timeoutId = window.setTimeout(() => {
//             callback.apply(null, args);
//         }, wait);
//     };
// }



