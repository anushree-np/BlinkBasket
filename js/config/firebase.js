import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";


const firebaseConfig = {

    apiKey: "AIzaSyBoWbqO7bEvkFrFVy71oA2rJh6qsTNdT6Q",

    authDomain: "online-shopping-system-8f56d.firebaseapp.com",

    projectId: "online-shopping-system-8f56d",

    storageBucket: "online-shopping-system-8f56d.firebasestorage.app",

    messagingSenderId: "504529904026",

    appId: "1:504529904026:web:db165115487ad647721a23",

    measurementId: "G-2V311RYWC6"

};


// INITIALIZE FIREBASE APP

const app = initializeApp(firebaseConfig);


// INITIALIZE SERVICES

const auth = getAuth(app);

const db = getFirestore(app);


// EXPORT SERVICES

export {
    auth,
    db
};

