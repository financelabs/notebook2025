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

async function doShowUserQuizPosts(userEmail) {
    console.log(userEmail);
    resUserPosts = await store.dispatch(api.endpoints.fetchUserPosts.initiate(userEmail))
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

