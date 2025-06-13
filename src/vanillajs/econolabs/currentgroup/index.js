import createRtkFirebaseDbAuthStore, { api, setCurrentDate, setOpenAvatars } from "../../../utlities/createRtkFirebaseDbAuthStore";
import foundQuiz from "../../../utlities/foundQuiz";
import identifyQuiz from "../../../utlities/identifyQuiz";

/**
  * Const and Selectors
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const store = createRtkFirebaseDbAuthStore();
console.log(store);

let resQuizesCasesByDate;
let resOpenAvatar;
let resUserPosts;

/**
  * Functions
*/

async function getAvatar(userEmail) {
    resOpenAvatar = await store.dispatch(api.endpoints.fetchOpenAvatar.initiate(userEmail))
    return !!resOpenAvatar.data ? resOpenAvatar.data : null;
}

async function doShowUserPosts(userEmail) {
    console.log(userEmail);
    resUserPosts = await store.dispatch(api.endpoints.fetchUserPosts.initiate(userEmail))
    console.log(resUserPosts);

    let userUniquePosts = [...new Set(
        resUserPosts.data
            .map(item => {
                return identifyQuiz(item.title, item?.quizString)
            }))];


    $("#quizbuttonslist").innerHTML = window.quizesSets.map((item, index) => {
        return `<button
        class='${foundQuiz(
            identifyQuiz(item.title, item.text),
            userUniquePosts
        )
                ? "btn btn-sm btn-success page m-1" : "btn btn-sm btn-outline-secondary page m-1"}'
        
       >
        ${index + 1}
        </button>`
    }).join("");
}

function renderUsers(updatedopenavatars) {
    console.log(updatedopenavatars);
    let markup = Object.keys(updatedopenavatars)
        .map(objKey => {
            return `<div class='col'>
            <button class="btn btn-outline-secondary selectuser m-1">
            <img class='avatar m-1' src=${updatedopenavatars[objKey]?.avatarUrl} id=${updatedopenavatars[objKey]?.id}/>
           <div> ${updatedopenavatars[objKey]?.user} </div>
            </button>
        </div>
        `
        }).join("");
    $("#users").innerHTML = "<div class='row'>" +
        markup + "</div>";

    let userPostsShowButtons = [...$$('.selectuser')];
    console.log(userPostsShowButtons)
    userPostsShowButtons.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            doShowUserPosts(event.target.id)
        }, false);
    })
}



async function doSelectDate(e) {
    e.preventDefault();
    let d = new Date(e.target.value);
    let currentDay = new Intl.DateTimeFormat("en", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    })
        .format(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
        .replace(/[^a-zA-Z0-9]/g, "_");
    console.log(currentDay);

    store.dispatch(setCurrentDate(currentDay))
    resQuizesCasesByDate = await store.dispatch(api.endpoints.fetchQuizesCasesByDate.initiate("/currentDay/" + currentDay + "/"));
    console.log(resQuizesCasesByDate.data);
    // let res = resQuizesCasesByDate.data;
    let uniqueEmails = [...new Set(resQuizesCasesByDate.data.map(item => item?.email))];

    let updatedopenavatars = {};

    Promise.all(uniqueEmails.map(email => { return getAvatar(email.replace(/[^a-zA-Z0-9]/g, "_")) }))
        .then(values => {
            values.forEach((result, index) =>
                updatedopenavatars[uniqueEmails[index].replace(/[^a-zA-Z0-9]/g, "_")] = result
            )
            console.log(updatedopenavatars);
            store.dispatch(setOpenAvatars(updatedopenavatars));
            renderUsers(updatedopenavatars);

            //         markupForQuizesCasesByDate(
            //             "cards",
            //             "cases",
            //             "budgeting",
            //             quizesbyDate,
            //             updatedopenavatars,
            //             "John Doe",
            //             "https://images.unsplash.com/photo-1536300099515-6c61b290b654?q=80&w=200&auto=format&fit=crop",
            //             doDeletePost
            //         );

        });
}

/**
  * HTML event listeners
*/


$("#selectedDate").addEventListener("change", doSelectDate, false);

console.log("current group 2");