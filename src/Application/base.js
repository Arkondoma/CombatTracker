import * as firebase from "firebase/app";
import "firebase/auth";

require("firebase/firestore");

const app = firebase.initializeApp({
    apiKey: "AIzaSyBAtTeHwgsj-rzYOInzzWcFSujIMmJbjT8",
    authDomain: "combattracker-280a4.firebaseapp.com",
    databaseURL: "https://combattracker-280a4.firebaseio.com",
    projectId: "combattracker-280a4",
    storageBucket: "",
    messagingSenderId: "261436253753",
    appId: "1:261436253753:web:631702617cc62424100fe8"
});

export default app;
