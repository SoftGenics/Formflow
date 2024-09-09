import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC0nTWwVpFpUlI90hQQF16dAUxbDK2Nme8",
    authDomain: "nativeform-8a963.firebaseapp.com",
    projectId: "nativeform-8a963",
    storageBucket: "nativeform-8a963.appspot.com",
    messagingSenderId: "745138645306",
    appId: "1:745138645306:web:3de823411c645d592e4803"
};

// if (!firebase.apps.length || !firebase.apps.find((app) => app.name === 'firebase')) {
//     firebase.initializeApp(firebaseConfig);
// }
firebase.initializeApp(firebaseConfig);


export default firebase;