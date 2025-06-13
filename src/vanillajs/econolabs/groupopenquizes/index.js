import createRtkFirebaseDbAuthStore, { api, setCurrentDate, setOpenAvatars } from "../../../utlities/createRtkFirebaseDbAuthStore";


/**
  * Const and Selectors
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const store = createRtkFirebaseDbAuthStore();
console.log(store);

let resOpenQuizesCasesIds;
let resQuizesCasesByDate;
let resUserPosts;
let resOpenAvatar;


/**
  * Functions
*/

async function getAvatar(userEmail) {
    resOpenAvatar = await store.dispatch(api.endpoints.fetchOpenAvatar.initiate(userEmail))
    return !!resOpenAvatar.data ? resOpenAvatar.data : null;
}


async function doRemoveUserDuplicates(e) {
    e.preventDefault();
    console.log(e.target.id);
    let [userEmail, id] = e.target.id.split("_|_");   
    let post = resUserPosts.data.find(item => item.id === id);
    let uniqueitem = identifyQuiz(post.title, post.quizString);
    let duplicates = resUserPosts.data.filter(item => identifyQuiz(item?.title, item?.quizString) === uniqueitem);
    duplicates.pop()
    console.log(duplicates);
    let updates = {};
    duplicates.forEach(item => {
         updates["usersCraft/" + userEmail + "/posts/" + item.id] = null
    })
   
    console.log(updates);
    store.dispatch(api.endpoints.updatesForUserPosts.initiate({
        base: "",
        updates: updates
    }))
        .then((res) => {
     console.log(res);
     editUserPosts(userEmail)
        });

}



async function doRemoveUserQuiz(e) {
    e.preventDefault();
    console.log(e.target.id);

    let updates = {};
    updates["usersCraft/" + e.target.id] = null;
  //  console.log(updates);
    store.dispatch(api.endpoints.updatesForUserPosts.initiate({
        base: "",
        updates: updates
    }))
        .then((res) => {
     console.log(res)
        });
}

function editUserPosts(userEmail) {
 //   console.log(resUserPosts.data);
    let userUniquePosts = [...new Set(
        resUserPosts.data
            .map(item => {
                return identifyQuiz(item.title, item?.quizString)
            }))];

    $("#userposts").innerHTML = 
    "<div class='row g-2'>" +
    userUniquePosts
        .map(uniqueitem => {
            let duplicates = resUserPosts.data.filter(item => identifyQuiz(item.title, item?.quizString) === uniqueitem);
        //    console.log(duplicates[0]);

            let answer = duplicates[0]?.answer;

            let cardstyle = "card m-1";
            //duplicates[0].type === "multiplechoices" ? "card border-primary m-1" : "card m-1" 
            return `
            <div class='col-12 col-md-6 col-lg-4 col-xl-3'>
        <div class=${cardstyle}>
            <div class="card-body">
              <h5 class="card-title">${duplicates.length}</h5>
              <p class="card-text">${uniqueitem}</p>
              <p class="card-text text-secondary">${answer}</p>              
              ${duplicates.length > 1 ? `<a href="#" class="btn btn-sm btn-outline-danger removeduplicates" id=${userEmail + "_|_" + duplicates[0].id}>Remove dublicates</a>`
                    : `<a href="#" class="btn btn-sm btn-outline-danger removequiz" id=${userEmail + "/posts/" + duplicates[0].id}>Remove</a>`
                }
            </div>
        </div>
        </div>`
        })
        .join("")
        + "</div>"
        ;

    let removeUserQuizButtons = [...$$('.removequiz')];
    // console.log(userPostsShowButtons)
    removeUserQuizButtons.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            doRemoveUserQuiz(event)
        }, false);
    })

    let removeUserDuplicatesButtons = [...$$('.removeduplicates')];
    // console.log(userPostsShowButtons)
    removeUserDuplicatesButtons.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            doRemoveUserDuplicates(event)
        }, false);
    })

}



function selectQuizTags(quiz) {
    console.log(quiz);
    $(".prettyprint").innerText =
        JSON.stringify(quiz, null, 4)

    // doRehype(quiz.text)
    //     .then(res => {

    //         console.log(res)
    //     })
}

function identifyQuiz(title, text) {
    if (typeof (text) === 'string' && text.includes('<br>')) {
        //       console.log(item.quizString.split('<br>')[0])
        return title + " " + text.split('<br>')[0]
    } else {
        return title + " " + !!text ? text : ""
    }
}

function doFindTags(tags, quizidentstring) {
    let quizIsFound = false
    if (Array.isArray(tags)) {
        console.log(tags);
        resUserPosts
            .data
            .forEach(post => {
                let foundArray = [];
                tags.forEach(tag => {
                    if (post?.quizString.includes(tag) || post?.title.includes(tag)) { foundArray.push(tag) }
                })
                if (foundArray.length === tags.length) { console.log(post.title, foundArray); quizIsFound = true }
            });
    } else {
        
       // console.log(quiztext);
        let tags =  [...new Set(
            quizidentstring.match(/("[^"]+"|[^"\s]+)/g)
            .filter(word => word.length > 3)
            .map(word => word.replace(/,;:./g, ''))
        )];         ;
        console.log(tags);
        resUserPosts
        .data
        .forEach(post => {
            let foundArray = [];
            tags.forEach(tag => {
                if (post?.quizString.includes(tag) || post?.title.includes(tag)) { foundArray.push(tag) }
            })
            if (foundArray.length === tags.length) { console.log(post.title, foundArray); quizIsFound = true }
        });


    }

    return quizIsFound
}


async function doShowUserQuizPosts(userEmail) {
    resUserPosts = await store.dispatch(api.endpoints.fetchUserPosts.initiate(userEmail))
    // let userUniquePosts = [...new Set(
    //     resUserPosts.data
    //         .map(item => {
    //             return identifyQuiz(item.title, item?.quizString)
    //         }))];
    $("#quizbuttonslist").innerHTML = window.quizesSets.map((quiz, index) => {
        return `<button
        class='${doFindTags(quiz?.tags, identifyQuiz(quiz.title, quiz.text)) ?
                "btn btn-sm btn-success page m-1" : "btn btn-sm btn-outline-secondary page m-1"}'
       >
        ${index + 1}
        </button>`
    }).join("");

    let selectedQuizButtons = [...$$('.selectedquiz')];

    selectedQuizButtons.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            console.log(event.target.id);
            selectQuizTags(window.quizesSets.find(item => item.id === event.target.id))
        }, false);
    })

     editUserPosts(userEmail);
}

function renderUsers(updatedopenavatars) {
    // console.log(updatedopenavatars);
    let markup = Object.keys(updatedopenavatars)
        .map(objKey => {
            //      console.log(objKey);
            return `<div class='col'>
            <button class="btn btn-outline-secondary selectuser m-1" id=${objKey}>
            <img class='avatar m-1' src=${updatedopenavatars[objKey]?.avatarUrl} />
            <div>${updatedopenavatars[objKey]?.user} </div>
            </button>
        </div>
        `
        }).join("");
    $("#users").innerHTML = "<div class='row'>" +
        markup + "</div>";

    let userPostsShowButtons = [...$$('.selectuser')];
    // console.log(userPostsShowButtons)
    userPostsShowButtons.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            doShowUserQuizPosts(event.currentTarget.getAttribute("id"))
        }, false);
    })
}


async function doSelectDate(e) {
    e.preventDefault();
    $("#userposts").innerHTML = "";
    $("#quizbuttonslist").innerHTML = "";
    let d = new Date(e.target.value);
    let currentDay = new Intl.DateTimeFormat("en", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    })
        .format(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
        .replace(/[^a-zA-Z0-9]/g, "_");
    //   console.log(currentDay);

    store.dispatch(setCurrentDate(currentDay))
    resQuizesCasesByDate = await store.dispatch(api.endpoints.fetchQuizesCasesByDate.initiate("/currentDay/" + currentDay + "/"));
    //   console.log(resQuizesCasesByDate.data);
    // let res = resQuizesCasesByDate.data;
    let uniqueEmails = [...new Set(resQuizesCasesByDate.data.map(item => item?.email))];

    let updatedopenavatars = {};

    Promise.all(uniqueEmails.map(email => { return getAvatar(email.replace(/[^a-zA-Z0-9]/g, "_")) }))
        .then(values => {
            values.forEach((result, index) =>
                updatedopenavatars[uniqueEmails[index].replace(/[^a-zA-Z0-9]/g, "_")] = result
            )
            //     console.log(updatedopenavatars);
            store.dispatch(setOpenAvatars(updatedopenavatars));
            renderUsers(updatedopenavatars);
        });
}

/**
  * HTML event listeners
*/


$("#selectedDate").addEventListener("change", doSelectDate, false);

/**
  * Initial load
*/

async function initialLoad() {
    resOpenQuizesCasesIds = await store.dispatch(api.endpoints.fetchOpenQuizesCasesIds.initiate());
    console.log(resOpenQuizesCasesIds.data.filter(item => item.theme === 'Основные корпоративные налоги'))
}


initialLoad().then(() => {
    console.log("Group Open Quizes");
});