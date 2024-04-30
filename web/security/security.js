import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  doc,
  getFirestore,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
 * @param {{ vehicle }} data
 * @returns {Promise<{ name, branch, batch, phone, vehicle }>}
 */
async function getUserData(data) {
  const docRef = doc(db, "StudentsList", data.vehicle);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null
  }
}
const button = document.getElementById("searchButton")
const input = document.getElementById("search")
const detailsEl = document.getElementById("details")

button.addEventListener("click", async function (e) {
  e.preventDefault();
  let searchValue = input.value;

  console.log(searchValue);
  
  const data = await getUserData({ vehicle: searchValue });
  
  console.log(data);

  if (data) {
    detailsEl.innerHTML = `
      <li>Name: ${data.name}</li>
      <li>Branch: ${data.branch}</li>
      <li>Batch: ${data.batch}</li>
      <li>Phone: ${data.phone}</li>
      <li>Vehicle: ${data.vehicle}</li>
    `;
  } else {
    alert("No data found");
    detailsEl.innerHTML = "No data found";
  }

  resetForm();
});

function resetForm() {
  document.getElementById("myForm").reset();
}

