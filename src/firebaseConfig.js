// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Pour l'authentification

const firebaseConfig = {
  apiKey: "AIzaSyCWu4KaqVT_V21TW0D2rEAfue2bhr-LlXI",
  authDomain: "msga-d6b49.firebaseapp.com",
  projectId: "msga-d6b49",
  storageBucket: "msga-d6b49.appspot.com",
  messagingSenderId: "237312485911",
  appId: "1:237312485911:web:e08c7838e5f89638dfca52"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export { firebaseApp, auth }; // Exporte les deux
