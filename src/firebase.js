import firebase from "firebase/app";
import "firebase/database";

let config = {
  apiKey: "AIzaSyACa2cQvnTvHZykkhZ55xe7-ixGa9tLlzQ",
  authDomain: "coin-looking.firebaseapp.com",
  projectId: "coin-looking",
  storageBucket: "coin-looking.appspot.com",
  messagingSenderId: "462093378963",
  appId: "1:462093378963:web:74b49f12fe26d472d7f466",
  measurementId: "G-34DB65WJJ3"
};

firebase.initializeApp(config);

export default firebase.database();
