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
  const notRegistered = document.getElementById("unregisterd");
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
    return null;
  }
}
const button = document.getElementById("searchButton");
const input = document.getElementById("search");
const detailsEl = document.getElementById("results");

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
    console.log("No such document for plate number:" + searchValue);
    alert("No Registered number as: " + searchValue);
    detailsEl.innerHTML += `
        <li style="background-color: red; color: black;">Plate Number: ${searchValue}</li>
        <hr>
      `;
    detailsEl.innerHTML += "No data found";
  }

  resetForm();
});

function resetForm() {
  document.getElementById("myForm").reset();
}

onValue(activePlatesInDB, function (snapshot) {
  notRegistered.innerHTML = ""; //clear the list

  if (snapshot.exists()) {
    let activePlatesArray = Object.entries(snapshot.val());
    for (let i = 0; i < activePlatesArray.length; i++) {
      let currentList = activePlatesArray[i];
      let currentItemID = currentList[0];
      let currentItemValue = currentList[1];
      console.log("currentList:", currentList);
      console.log("currentItemID:", currentItemID);
      console.log("currentItemValue:", currentItemValue);
      appendItemToactivePlates(currentList);
    }
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

  } else {
    // console.log("No such document for plate number:" + plateNumber);
    // alert("No Registered number as: " + plateNumber);
    notRegistered.innerHTML += `
    <li style="background-color: red; color: black;">Un Registered Vehicle Entered: </li>
    <li style="background-color: red; color: black;">Plate Number: ${plateNumber}</li>
    <li style="background-color: red; color: black;">In: ${new Date(
      in_timestamp
    ).toLocaleString()}</li>
    <hr>
  `;
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
