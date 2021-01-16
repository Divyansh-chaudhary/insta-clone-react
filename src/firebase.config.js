import firebase from 'firebase';

const firebaseConfig = {
   apiKey: "AIzaSyDfvNfuaONsCEG154ZF8GJUkOnz4EAV370",
   authDomain: "insta-clone-3c5ec.firebaseapp.com",
   projectId: "insta-clone-3c5ec",
   storageBucket: "insta-clone-3c5ec.appspot.com",
   messagingSenderId: "153984245611",
   appId: "1:153984245611:web:9b4894a9181c18e658762e",
   measurementId: "G-7PTF10HHFP"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(),
   auth = firebase.auth(),
   storage = firebase.storage();

export { db, auth, storage };