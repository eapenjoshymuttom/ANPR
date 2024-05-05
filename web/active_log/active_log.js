import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://anpr-d05b8-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const activePlatesInDB = ref(database, "active_plates");
const activePlatesEl = document.getElementById("details");

onValue(activePlatesInDB, function (snapshot) {
  if (snapshot.exists()) {
    let activePlatesArray = Object.entries(snapshot.val());
    let count = activePlatesArray.length;
    activePlatesEl.innerHTML += `
        <li>Count: ${count}</li>
        <hr>
      `;
    if(count < 100) {
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
  activePlatesEl.innerHTML += `
    <li>Plate Number: ${itemValue.plate_number}</li>
    <li>In: ${new Date(in_timestamp).toLocaleString()}</li>
    <hr>
  `;
}
