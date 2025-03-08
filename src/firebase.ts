// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDViWD8ZNp-upEagw7Ucnpfs7Fya7PGqdM",
  authDomain: "github-kanban.firebaseapp.com",
  databaseURL: "https://github-kanban-default-rtdb.firebaseio.com",
  projectId: "github-kanban",
  storageBucket: "github-kanban.firebasestorage.app",
  messagingSenderId: "1030814517282",
  appId: "1:1030814517282:web:4e65728165d8bb24e8227b",
  measurementId: "G-S8XNXYP0QT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export { database };
