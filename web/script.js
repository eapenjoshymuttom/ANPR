import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  doc,
  getFirestore,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "gjkauhbfhlblihbfibjhsrbgjhs",
  authDomain: "anpr-d05b8.firebaseapp.com",
  databaseURL:
    "https://anpr-d05b8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "anpr-d05b8",
  storageBucket: "anpr-d05b8.appspot.com",
  messagingSenderId: "1080137159182",
  appId: "1:1080137159182:web:ad7ccd30bf0b60e19f625f",
  measurementId: "G-VN8YQ3LS6V",
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
});
