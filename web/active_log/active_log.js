import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import {
  doc,
  getFirestore,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const appSettings = {
  databaseURL:
    "https://anpr-d05b8-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const firebaseConfig = {
  apiKey: "AIzaSyDCyfvX_vw15AKXwgqSGwfbhqluQUd4eMk",
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
const database = getDatabase(app);
const activePlatesInDB = ref(database, "active_plates");
const activePlatesEl = document.getElementById("details");

onValue(activePlatesInDB, function (snapshot) {
  activePlatesEl.innerHTML = ""; //clear the list

  if (snapshot.exists()) {
    let activePlatesArray = Object.entries(snapshot.val());
    let count = activePlatesArray.length;
    activePlatesEl.innerHTML += `
        <li>Count: ${count}</li>
        <hr>
      `;
    if (count < 100) {
      let remaining = 100 - count;
      activePlatesEl.innerHTML += `
        <li>Remaining Slots: ${remaining}</li>
        <hr>
      `;
    }
    for (let i = 0; i < activePlatesArray.length; i++) {
      let currentList = activePlatesArray[i];
      let currentItemID = currentList[0];
      let currentItemValue = currentList[1];
      console.log("currentList:", currentList);
      console.log("currentItemID:", currentItemID);
      console.log("currentItemValue:", currentItemValue);
      appendItemToactivePlates(currentList);
    }
  } else {
    activePlatesEl.innerHTML += `
    <li>No active plates found</li>
  `;
  }
});

function appendItemToactivePlates(item) {
  let itemValue = item[1];
  let in_timestamp = itemValue.timestamp;
  let plateNumber = itemValue.plate_number;
  fetchData(plateNumber, in_timestamp);
}

async function fetchData(plateNumber, in_timestamp) {
  const docRef = doc(db, "StudentsList", plateNumber);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log("Document data:", data);

    // Display student details if available
    if (data) {
      activePlatesEl.innerHTML += `
        <li>Plate Number: ${plateNumber}</li>
        <li>Name: ${data.name}</li>
        <li>Branch: ${data.branch}</li>
        <li>Batch: ${data.batch}</li>
        <li>Phone: ${data.phone}</li>
        <li>In: ${new Date(in_timestamp).toLocaleString()}</li>
        <hr>
      `;
    } else {
      alert("No data found for plate number: " + plateNumber);
    }
  } else {
    console.log("No such document for plate number:", plateNumber);
  }
}

const modeToggle = document.querySelector("#mode-toggle");
const body = document.body;

modeToggle.addEventListener("click", () => {
  body.classList.toggle("light-mode");
});

const servicesToggle = document.querySelector(".hamburger-menu");
const servicesMenu = document.querySelector(".services-menu");

servicesToggle.addEventListener("click", () => {
  servicesMenu.style.display =
    servicesMenu.style.display === "block" ? "none" : "block";

  document.addEventListener("click", handleOutsideClick);

  function handleOutsideClick(event) {
    const isClickInsideServicesMenu = servicesMenu.contains(event.target);
    const isClickOnServicesToggle = event.target === servicesToggle;

    if (
      !isClickInsideServicesMenu &&
      !isClickOnServicesToggle &&
      servicesMenu.style.display === "block"
    ) {
      servicesMenu.style.display = "none";
    }
  }
});

if (matchMedia("(prefers-color-scheme: dark)").matches) {
  body.classList.add("light-mode");
}

matchMedia("(prefers-color-scheme: dark)").addEventListener(
  "change",
  (event) => {
    if (event.matches) {
      body.classList.add("light-mode");
    } else {
      body.classList.remove("light-mode");
    }
  }
);
