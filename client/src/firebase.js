import firebase from 'firebase';
  
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBact--7Cfu6QWT1GYvMBItpLWgtABrJr4",
  authDomain: "ecommerce-4e66d.firebaseapp.com",
  databaseURL: "https://ecommerce-4e66d.firebaseio.com",
  projectId: "ecommerce-4e66d",
  storageBucket: "ecommerce-4e66d.appspot.com",
  messagingSenderId: "130426724343",
  appId: "1:130426724343:web:f255ad107aa544d58c18f2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

// export
export { auth, googleAuthProvider }
