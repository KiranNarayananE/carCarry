import {initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth"
import 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyDnUUVJTDG36YSfGsD0SOpuME9XC34OJk8",
  authDomain: "carcarry-382021.firebaseapp.com",
  projectId: "carcarry-382021",
  storageBucket: "carcarry-382021.appspot.com",
  messagingSenderId: "602450288038",
  appId: "1:602450288038:web:5a968cd8bfdd278ff10367",
  measurementId: "G-F1K25ZZ2XM"
};
let Firebase = initializeApp(firebaseConfig)
const auth = getAuth(Firebase)

export  {Firebase,auth};
