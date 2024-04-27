import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://anpr-d05b8-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const studentsListInDB = ref(database, "StudentsList")

const inputFieldEl = document.getElementById("name")
const inputFieldE2 = document.getElementById("branch")
const inputFieldE3 = document.getElementById("year")
const inputFieldE4 = document.getElementById("phone")
const inputFieldE5 = document.getElementById("vehicle")

const addButtonEl = document.getElementById("submit")

addButtonEl.addEventListener("click", function() {
  let inputValue1 = inputFieldEl.value;
  let inputValue2 = inputFieldE2.value;
  let inputValue3 = inputFieldE3.value;
  let inputValue4 = inputFieldE4.value;
  let inputValue5 = inputFieldE5.value;

  let inputValue = {
    name: inputValue1,
    branch: inputValue2,
    year: inputValue3,
    phone: inputValue4,
    vehicle: inputValue5
  }
  
  push(studentsListInDB, inputValue);
  
  console.log(inputValue);
})