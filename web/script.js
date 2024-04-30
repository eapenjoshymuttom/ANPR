import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  doc,
  getFirestore,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_SMjH-WH5fSttELER0uHz6swoLNhjT5s",
  authDomain: "anpr-537f9.firebaseapp.com",
  databaseURL: "https://anpr-537f9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "anpr-537f9",
  storageBucket: "anpr-537f9.appspot.com",
  messagingSenderId: "582608749107",
  appId: "1:582608749107:web:7097aea45523324976d946",
  measurementId: "G-3BJRRMV66Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const colRef = collection(db, "StudentsList");

/**
 * @param {{ name, branch, batch, phone, vehicle }} data
 * @returns {Promise<void>}
 */
async function writeUserData(data) {
  await setDoc(doc(db, "StudentsList", data.vehicle), data);
}

const inputFieldEl = document.getElementById("name");
const inputFieldE2 = document.getElementById("branch");
const inputFieldE3 = document.getElementById("batch");
const inputFieldE4 = document.getElementById("phone");
const inputFieldE5 = document.getElementById("vehicle");

const addButtonEl = document.getElementById("submit");

addButtonEl.addEventListener("click", async function (e) {
  e.preventDefault();

  const values = {
    name: inputFieldEl.value,
    branch: inputFieldE2.value,
    batch: inputFieldE3.value,
    phone: inputFieldE4.value,
    vehicle: inputFieldE5.value,
  };

  console.log(values);
  await writeUserData(values);

  console.log("Data written successfully");
  alert("Data Entered successfully");

  resetForm();
});

function resetForm() {
  document.getElementById("myForm").reset();
}
