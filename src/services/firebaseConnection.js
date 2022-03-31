import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
    apiKey: "AIzaSyBwZYy-AM-jHQvNh6GxLlBfq8YKZEwRKVM",
    authDomain: "sistema-de-chamados-c26e6.firebaseapp.com",
    projectId: "sistema-de-chamados-c26e6",
    storageBucket: "sistema-de-chamados-c26e6.appspot.com",
    messagingSenderId: "637556334911",
    appId: "1:637556334911:web:0dfa772a24c0187c13738a",
    measurementId: "G-DD1BBRP63M"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}


export default firebase;
