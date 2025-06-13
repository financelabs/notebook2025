import { initializeApp } from 'firebase/app';
import { getDatabase, get, ref, update, push, child } from 'firebase/database';

import firebaseConfig from './config.js';

import { createApi, setupListeners, fakeBaseQuery } from '@reduxjs/toolkit/query';
import { configureStore } from '@reduxjs/toolkit';


/**
  * Const and Selectors
*/


const useremailForm = document.getElementById("useremailform");
const useremailInput = document.getElementById("useremail");
const saveEmailButton = document.getElementById('saveemail');

const buttonGroupPanel = document.getElementById('buttongroup');


const saveNoteButton = document.getElementById('savenotebutton');
const noteid = document.getElementById('noteid');
const chapterInput = document.getElementById('chapter');
const sectionInput = document.getElementById('section');
const paragraphInput = document.getElementById('paragraph');
const sentenceInput = document.getElementById('sentence');

const urlInput = document.getElementById('url');
const mynoteInput = document.getElementById('mynote');
const commentInput = document.getElementById('comment');

const newNoteButton = document.getElementById("newnotebutton");
const documentButton = document.getElementById("documentbutton");
const templatesButton = document.getElementById("templatesbutton");
const editButton = document.getElementById("editbutton");



const documentView = document.getElementById("documentview");
const newNoteView = document.getElementById("newnoteview");
const templateView = document.getElementById("templateview");
const editView = document.getElementById("editview");





/**
  * Firebase
*/

let app = initializeApp(firebaseConfig);
//const auth = getAuth();
const db = getDatabase();


async function getFirebaseNode({
  url = "crafts/temp_gmail_com/posts/-Ml6DEjYhdnjuW6HiHB7",
  type = "array"
}) {
  try {
    let snapshot = await get(ref(db, url));
    if (snapshot.exists()) {
      let res = snapshot.val();
      if (type === "array") { return Object.keys(res).map(objKey => res[objKey]) }
      return res
    } else {
      if (type === "array") { return [] } else { return null }
    }
  }
  catch (err) {
    console.log(err);
    if (type === "array") { return [] } else { return {} }
  }
}

function debounce(callee, timeoutMs) {
  return function perform(...args) {
    let previousCall = this.lastCall
    this.lastCall = Date.now()
    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
      clearTimeout(this.lastCallTimer)
    }
    this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs)
  }
}



// function timeout(ms) {
//   return new Promise(resolve => setTimeout(resolve(), ms));
// }

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('econolabs');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
   // console.log(serializedState);
    localStorage.setItem('econolabs', serializedState);
  } catch (err) {
    console.log(err)
  }
}

async function updateFirebaseNode(updates = { temp: "temp" }) {
  try {
    // let res = await timeout(3000);
  //  console.log(updates);
    await update(ref(db), updates);
    return updates;
  }
  catch (error) {
    console.error(error)
    return error
  }
}

function getFirebaseNodeKey(url) {
  return push(child(ref(db), url + "/")).key;
}

async function processTemplates(userTasks) {
 // console.log(userTasks)
  let paragraphs = []
  for (const task of userTasks) {

    for (const templateObjKey of Object.keys(task.templates)) {
      // let templateIndex = 0
      let res = await getFirebaseNode({ url: "openmediadata/" + templateObjKey, type: "object" });
      res.paragraphs.forEach((element, index) => {
        let sentenceString = index > 9 ? "" + index : "0" + index;
        //   console.log(sentenceString);
        paragraphs.push({
          id: templateObjKey + "___" + task?.chapter + task?.section + task?.paragraph + sentenceString,
          title: task.templates[templateObjKey]?.title + task?.chapter + task?.section + task?.paragraph + sentenceString,
          content: element,
          chapter: task?.chapter,
          section: task?.section,
          paragraph: task?.paragraph,
          sentence: sentenceString,
          templatetitle: task.templates[templateObjKey]?.title,
          templatecomment: task.templates[templateObjKey]?.comment
        })
      });
    }
  }
  return paragraphs
}


/**
* Store
*/


const api = createApi({
  reducerPath: 'api',
  tagTypes: ["Task", "Note", "UserEmail"],
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({

    fetchTemp: builder.query({
      async queryFn(userEmail) {
        try {
          let userCraft = await getFirebaseNode({ url: "usersCraft/" + userEmail, type: "object" });
          console.log(userCraft);          
          return { data: [] }
        }
        catch (err) { console.log(err); return { data: [], error: err } }
      },
      providesTags: (result, error, id) => [{ type: "Task", id }]
    }),

    fetchUserEmail: builder.query({
      async queryFn() {
        try {
          let localstrg = await loadState();
     //     console.log(localstrg);
          return { data: !!localstrg ? localstrg?.email.replace(/[^a-zA-Z0-9]/g, "_") : null }
        }
        catch (err) { console.log(err); return { data: null, error: err } }
      },
      providesTags: "UserEmail"
    }),

    updateUserEmail: builder.mutation({
      async queryFn(userEmail) {
        saveState({ email: userEmail })
        return userEmail
      },
      invalidatesTags: ["UserEmail"]
    }),



    fetchUserNotes: builder.query({
      async queryFn(userEmail) {
        try {
          let list = await getFirebaseNode({ url: "usersCraft/" + userEmail + "/notes", type: "array" });
          return { data: list }
        }
        catch (err) { console.log(err); return { error: err } }
      },
      providesTags: (result, error, id) => [{ type: "Note", id }]
    }),

    fetchUserBooks: builder.query({
      async queryFn(userEmail) {
        try {
          let list = await getFirebaseNode({ url: "usersCraft/" + userEmail + "/books/default", type: "array" });
           return { data: list }
        }
        catch (err) { console.log(err); return { error: err } }
      },
      providesTags: (result, error, id) => [{ type: "Note", id }]
    }),

    fetchOpenMediaTasks: builder.query({
      async queryFn(userEmail) {
        try {
          let userTasks = await getFirebaseNode({ url: "usersCraft/" + userEmail + "/tasks", type: "array" });
          console.log(userTasks);
          let data = await processTemplates(userTasks);
          return { data }
        }
        catch (err) { console.log(err); return { data: [], error: err } }
      },
      providesTags: (result, error, id) => [{ type: "Task", id }]
    }),


 

    updateUserNotes: builder.mutation({
      async queryFn({ base = "openavatars", updates = {
        temp_google_com: {
          id: "temp_google_com",
          avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxODU2NzR8MHwxfGNvbGxlY3Rpb258MjB8YUg5OGRoZWI1ME18fHx8fDJ8fDE3MDAxMzYxMjN8&ixlib=rb-4.0.3&q=80&w=200",
          user: "Ha Ha"
        }
      }
      }) {
        let fireUpdates = {};
        Object.keys(updates).forEach(objKey => {
          fireUpdates[base + "/" + objKey] = updates[objKey]
        });
    //    console.log(fireUpdates);
        try { await updateFirebaseNode(fireUpdates) }
        catch (err) { console.log(err); return { error: err } }
        return { updates: fireUpdates }
      },
      invalidatesTags: ["Note"]
    }),

    updateUserTasks: builder.mutation({
      async queryFn({ base = "openavatars", updates = {
        temp_google_com: {
          id: "temp_google_com",
          avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxODU2NzR8MHwxfGNvbGxlY3Rpb258MjB8YUg5OGRoZWI1ME18fHx8fDJ8fDE3MDAxMzYxMjN8&ixlib=rb-4.0.3&q=80&w=200",
          user: "Ha Ha"
        }
      }
      }) {
        let fireUpdates = {};
        Object.keys(updates).forEach(objKey => {
          fireUpdates[base + "/" + objKey] = updates[objKey]
        });
      //  console.log(fireUpdates);
        try { await updateFirebaseNode(fireUpdates) }
        catch (err) { console.log(err); return { error: err } }
        return { updates: fireUpdates }
      },
      invalidatesTags: ["Task"]
    }),
  }),
})





const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})
setupListeners(store.dispatch);


let resNotes;
let resBooks;
let resTasks;
let resUserEmail;
let resTemp; //temp

/**
 * Functions
 */



function doSaveNote() {
  let { data: userEmail } = resUserEmail;
  saveNoteButton.disabled = true;
  let id = noteid.innerText.length > 0 ? noteid.innerText: getFirebaseNodeKey(["usersCraft/" + userEmail + "/notes"]);
  let orderby = ("0" + Number(chapterInput.value)).slice(-2) +
    ("0" + Number(sectionInput.value)).slice(-2) +
    ("0" + Number(paragraphInput.value)).slice(-2) +
    ("0" + Number(sentenceInput.value)).slice(-2);
  store.dispatch(api.endpoints.updateUserNotes.initiate({
    base: "usersCraft/" + userEmail,
    updates:
    {
      ["notes/" + id]: {
        id: id,
        chapter: chapterInput.value,
        section: sectionInput.value,
        paragraph: paragraphInput.value,
        sentence: sentenceInput.value,
        content: mynoteInput.value,
        comment: !!commentInput.value?.value && commentInput.value?.value.length > 0 ? commentInput.value.value : orderby,
        orderby: orderby,
        url: urlInput.value
      },
      ["books/default/" + orderby]: !!commentInput.value?.value && commentInput.value?.value.length > 0 ? commentInput.value.value : orderby
    }
    //    {[e.target.id]: null}
  }))
    .then((res) => {
      noteid.innerText = id;
      saveNoteButton.disabled = false;
    //  console.log("Done ")
    });
}



function handleInput(e) {
  let { data: userEmail } = resUserEmail;
  let orderby = e.target.id;
  let id = e.target.id
  store.dispatch(api.endpoints.updateUserNotes.initiate({
    base: "usersCraft/" + userEmail,
    updates:
    {
      ["notes/" + id]: {
        id: id,
        chapter: id.substring(0, 2),
        section: id.substring(2, 2),
        paragraph: id.substring(4, 2),
        sentence: id.substring(6, 2),
        comment: e.target.id,
        orderby: orderby,
        content: e.target.value,
      },
      ["books/default/" + orderby]: e.target.value
    }

  }))
    .then((res) => {
   //   console.log("Done ")
    });

}

const debouncedHandle = debounce(handleInput, 1500);


function doSaveUserEmail(e) {
  e.preventDefault();
  store.dispatch(api.endpoints.updateUserEmail.initiate(useremailInput.value))
    .then(res => {
   //   console.log(res);
      window.location.reload();
    });
}

function editNote(e) {
  let { data: notesArray } = resNotes;
  let note = notesArray.find(note => note.id === e.target.id);

//  console.log(note);
  chapterInput.value = note.chapter;
  sectionInput.value = note.section;
  paragraphInput.value = note.paragraph;
  sentenceInput.value = note.sentence;
  urlInput.value = note.url;
  mynoteInput.value = note.content;
  noteid.innerText = note.id

  editView.style.display = "none";
  editButton.classList = "btn btn-outline-secondary"; 
  editView.innerHTML = "";

  newNoteButton.classList = "btn btn-outline-secondary";
  newNoteView.style.display = "block";
}

function deleteNote(e) {

  let { data: notesArray } = resNotes;
  let { data: userEmail } = resUserEmail;
  let note = notesArray.find(note => note.id === e.target.id);

  store.dispatch(api.endpoints.updateUserNotes.initiate({
    base: "usersCraft/" + userEmail,
    updates:
    {
      ["notes/" + e.target.id]: null,
      ["books/default/" + note.orderby]: null
    }

  }))
    .then(() =>  window.location.reload());
}




/**
  * Views
*/

function loadDocumentView() {
  newNoteView.style.display = "none";
  newNoteButton.classList = "btn btn-outline-secondary";
  templatesButton.classList = "btn btn-outline-secondary";
  templateView.style.display = "none";
  editButton.classList = "btn btn-outline-secondary";
  editView.style.display = "none";

  documentButton.classList = "btn btn-outline-primary";

  let { data } = resNotes;
  const notes = [...data].sort((a, b) => a.orderby.localeCompare(b.orderby));
  let allposts = notes.map(note => {
  //  console.log(note);
    return `
            <div class="card shadow m-1">
                <div class="card-body">
                    <div class="row">                                 
                        <div class="col-xs-12 col-md-4 col-lg-1">
                          <small class="text-muted">${note?.orderby}</small>                         
                        </div>
                        <div class="col-xs-12 col-md-8 col-lg-11">
                            <div style="margin: auto;">${note?.content}</div>
                        </div>                        
                    </div>    
                </div>
            </div>`
  }).join('');
  documentView.innerHTML = allposts;
  documentView.style.display = "block";
}


function loadTemplateView() {
  documentView.innerHTML = "";
  documentView.style.display = "none";
  documentButton.classList = "btn btn-outline-secondary";
  newNoteView.style.display = "none";
  newNoteButton.classList = "btn btn-outline-secondary";
  editButton.classList = "btn btn-outline-secondary";
  editView.style.display = "none";

  templatesButton.classList = "btn btn-outline-primary";

  let { data } = resTasks
  //  console.log(data);
  let allposts = data.map(quiz => {
    let id = !!quiz?.id ? quiz?.id.split('___')[1] : 'xxx';

    return `
            <div class="card shadow m-1">
            <div class="card-header">
            ${quiz?.title}
  </div>
                <div class="card-body">
                    <div class="row">                                 
                        <div class="col-xs-12 col-lg-6">
                            <div class="input-group">
                              <span class="input-group-text">Мой текст</span>
                              <textarea  class="form-control updatesentence" aria-label="With textarea" id=${id} ></textarea>
                            </div>
                        </div>
                        <div class="col-xs-12 col-lg-6">
                         <small class="text-muted" style="width: 100%">${quiz?.content}</small>
                        </div>                        
                    </div>    
                    <small class="text-muted" style="width: 100%">${id}</small>
                </div>
            </div>`
  }).join('');

  templateView.innerHTML = allposts;

  for (var i = 0; i < document.getElementsByClassName("updatesentence").length; i++) {
    document.getElementsByClassName("updatesentence")[i].addEventListener("input", debouncedHandle);
  }

  templateView.style.display = "block";
}

function loadNewNoteView() {
  documentView.innerHTML = "";
  templatesButton.classList = "btn btn-outline-secondary";
  templateView.style.display = "none";
  documentButton.classList = "btn btn-outline-secondary";
  documentView.style.display = "none";
  editButton.classList = "btn btn-outline-secondary";
  editView.style.display = "none";


  chapterInput.value = "";
  sectionInput.value = "";
  paragraphInput.value = "";
  sentenceInput.value = "";
  urlInput.value = "";
  mynoteInput.value = "";
  noteid.innerText = ""


  newNoteButton.classList = "btn btn-outline-secondary";
  newNoteView.style.display = "block";
}


function loadEditView() {
  documentView.innerHTML = "";
  templatesButton.classList = "btn btn-outline-secondary";
  templateView.style.display = "none";
  documentButton.classList = "btn btn-outline-secondary";
  documentView.style.display = "none";
  newNoteButton.classList = "btn btn-outline-secondary";
  newNoteView.style.display = "none";

  editButton.classList = "btn btn-outline-primary";

  let { data } = resNotes
//  console.log(data);
  let allposts = data.map(note => {
    return `
            <div class="card shadow m-1">
                <div class="card-body">
                     <div class="row">                                 
                        <div class="col-xs-12 col-md-4 col-lg-1">
                          <small class="text-muted">${note?.orderby}</small>                         
                        </div>
                        <div class="col-xs-12 col-md-8 col-lg-11">
                            <div style="margin: auto;">${note?.content}</div>
                        </div>                        
                    </div>    
                    <button type="button" class="btn btn-outline-secondary btn-sm editnote" id="${note?.id}">Ред</button> 
                    <button type="button" class="btn btn-outline-danger btn-sm deletenote" id="${note?.id}">Удалить</button>  
                </div>
            </div>`
  }).join('');
  editView.innerHTML = allposts;

  for (var i = 0; i < document.getElementsByClassName("editnote").length; i++) {
    document.getElementsByClassName("editnote")[i].addEventListener("click", editNote);
  }

  for (var i = 0; i < document.getElementsByClassName("deletenote").length; i++) {
    document.getElementsByClassName("deletenote")[i].addEventListener("click", deleteNote);
  }




  editView.style.display = "block";
}


saveNoteButton.addEventListener('click', doSaveNote, false);
documentButton.addEventListener('click', loadDocumentView, false);
newNoteButton.addEventListener('click', loadNewNoteView, false);
templatesButton.addEventListener('click', loadTemplateView, false);
editButton.addEventListener('click', loadEditView, false);


saveEmailButton.addEventListener('click', doSaveUserEmail, false);


/**
  * Initial load
*/


async function initialLoad() {




  resUserEmail = await store.dispatch(api.endpoints.fetchUserEmail.initiate());
  if (!resUserEmail.data) {
  //  console.log("Need Ident");
    newNoteView.style.display = "none";
    buttonGroupPanel.style.display = "none";
    useremailForm.style.display = "block";
  } else {

    let { data: userEmail } = resUserEmail;


    // let res = await store.dispatch(api.endpoints.updateUserNotes.initiate({
    //   base: "usersCraft/" + userEmail,
    //   updates:
    //   {
    //     ["tasks/" + "-O4uDjqQN7pV6Gfnw33q"]: {

    //       id: "-O4uDjqQN7pV6Gfnw33q",
    //       theme: "Выпускная работа",
    //       title: "Заключение",
    //       type: "task",
    //       chapter: "04",
    //       section: "01",
    //       paragraph: "01",
    //       orderby: 0,
    //       templates: {
    //         ["-O4uDjqQN7pV6Gfnw33p"]: {
    //           comment: "Небольшая строительная организация",
    //           id: "-O4uDjqQN7pV6Gfnw33p",
    //           title: "Работа П. Рылова "
    //         }

    //       }
    //     }
    //   }   
    // }))
    //   .then((res) => {
    //     console.log(res);
    //     console.log("Tasks updated ")
    //   });


    useremailForm.style.display = "none";
    buttonGroupPanel.style.display = "none";
    newNoteView.style.display = "none";
    resNotes = await store.dispatch(api.endpoints.fetchUserNotes.initiate(resUserEmail.data));
    resBooks = await store.dispatch(api.endpoints.fetchUserBooks.initiate(resUserEmail.data));
    resTasks = await store.dispatch(api.endpoints.fetchOpenMediaTasks.initiate(resUserEmail.data));
    buttonGroupPanel.style.display = "block";
    newNoteView.style.display = "block";

    resTemp = await store.dispatch(api.endpoints.fetchTemp.initiate(resUserEmail.data));
   
  }
  return true
}

initialLoad().then(() => {});

store.subscribe(() => {
 // console.log(store.getState());
})

