import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get, update, onValue, push, child } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

import loadState from "../../../utlities/loadState";
/**
  * Const and Selectors
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let message = "nick.golovenkin@yandex.ru";
let fireconf = {};
let app;
let db;
let auth;

/**
  * Functions
*/

async function doSignInWithEmailAndPassword(email = this.email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        console.log(userCredential);
        return userCredential.user;
    }
    catch (error) {
        console.error(error)
        return null
    }
}

async function getUser() {
    let localstrg = loadState()
    let application = !!localstrg && !!localstrg?.application ? {
        ...localstrg.application,
        userEmail: !!localstrg?.application ? localstrg.application?.email.replace(/[^a-zA-Z0-9]/g, "_") : null
    } : null

    return application
}

function doLogin(e) {
    e.preventDefault();
    let application = {
        email: $("#emailInput")?.value,
        user: $("#userInput")?.value,
        password: $("#userPass")?.value,
    }
    console.log(application);

    if (password.length > 0) {

    }
         
    digestMessage(application.email) //res.email
    .then(res => {
//        console.log(res);
//        console.log(fireconf);

        let authHashArray = [];
        Object.keys(fireconf).forEach(objKey => {
            if (objKey.includes("hash")) {
                authHashArray.push(fireconf[objKey])
            }
        })
//        console.log(authHashArray);

        if (authHashArray.includes(res)) {
            console.log("Need password");
            $("#passwordblock").style.display = "block"
        }
    })

 //   saveState({ application })
 //   window.location.reload();
}


async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""); // convert bytes to hex string
    return hashHex;
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}


/**
  * HTML event listeners
*/

$("#loginbutton").addEventListener("click", (e) => doLogin(e), false);


/**
  * Initial load
*/


async function initialLoad() {

   
    console.log(getApps());

      if (getApps().length < 1) {
       let fireconf = {};
        try {
            fireconf = document.body.dataset;
        } catch (err) {
            throw new Error('Unable to get params' + err)
        }
        const firebaseConfig = {
            apiKey: fireconf.api,
            databaseURL: "https://" + fireconf.base + ".firebaseio.com",
            appId: fireconf.app
        };
        app = initializeApp(firebaseConfig);
        db = getDatabase();
        auth = getAuth();

        console.log(app);
        console.log(db);
        console.log(auth);

        if (!!auth.currentUser) {
            console.log(auth.currentUser)
          } else { console.log("Not allowed") }
    
   }
    
 

    let res = await getUser();

    if (!res) {
        $("#formcontainer").style.display = "block";
    } else {
        console.log(res);
       
 
        //   resUserAvatar = await store.dispatch(api.endpoints.fetchUserAvatar.initiate(res.userEmail));
        //   if (!!resUserAvatar.data?.avatarUrl) {
        //        console.log(resUserAvatar.data?.avatarUrl);
        //       store.dispatch(setAvatar(resUserAvatar.data?.avatarUrl));
        //   } else {
        //       store.dispatch(setAvatar(
        //           'https://images.unsplash.com/photo-1536300099515-6c61b290b654?q=80&w=200&auto=format&fit=crop'
        //       ));
        //   }

        //   resUserPosts = await store.dispatch(api.endpoints.fetchUserPosts.initiate(res.userEmail));
        //    console.log(resUserPosts.data);
        //   store.dispatch(loadCorrectquizes([...new Set(resUserPosts.data.map(item => item.quizString))]))
        //console.log(resUserAvatar);
        //resOpenQuizes = await store.dispatch(api.endpoints.fetchOpenQuizes.initiate());
        //console.log(resOpenQuizes.data)

        //   resOpenQuizesArray = await store.dispatch(api.endpoints.fetchOpenQuizesArray.initiate());
        //   store.dispatch(setUser(res));

    }


}

initialLoad().then((res) => { console.log(res) });

onAuthStateChanged(auth, function (user) {
 //   verifyEmailButton.disabled = true;
    if (user) {
        console.log(user)
      // User is signed in.
    //   const displayName = user.displayName;
    //   const email = user.email;
    //   const emailVerified = user.emailVerified;
    //   const photoURL = user.photoURL;
    //   const isAnonymous = user.isAnonymous;
    //   const uid = user.uid;
    //   const providerData = user.providerData;
    //   signInStatus.textContent = 'Signed in';
    //   signInButton.textContent = 'Sign out';
    //   accountDetails.textContent = JSON.stringify(user, null, '  ');
    //   if (!emailVerified) {
    //     verifyEmailButton.disabled = false;
    //   }
    } else {
      // User is signed out.
    //   signInStatus.textContent = 'Signed out';
    //   signInButton.textContent = 'Sign in';
    //   accountDetails.textContent = 'null';
    }
  //  signInButton.disabled = false;
  });
  







console.log("quizcardwithstorage21102024");