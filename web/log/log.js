import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  doc,
  collection,
  query,
  getFirestore,
  getDocs,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

const q = query(collection(db, "detected_plates"));
const detailsEl = document.getElementById("details");

async function fetchData() {
  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('No documents found in the "detected_plates" collection');
    } else {
      querySnapshot.forEach(async (plateDoc) => {
        console.log(plateDoc.id, " => ", plateDoc.data());
        const plateNumber = plateDoc.data().plate_number; // Access plate_number field
        const timestamp = plateDoc.data().timestamp; // Access timestamp field

        // Access Firestore document for the corresponding vehicle
        const docRef = doc(db, "StudentsList", plateNumber);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Document data:", data);
          
          // Display student details if available
          if (data) {
            detailsEl.innerHTML += `
              <li>Plate Number: ${plateNumber}</li>
              <li>Timestamp: ${new Date(timestamp).toLocaleString()}</li>
              <li>Name: ${data.name}</li>
              <li>Branch: ${data.branch}</li>
              <li>Batch: ${data.batch}</li>
              <li>Phone: ${data.phone}</li>
              <hr>
            `;
          } else {
            alert("No data found for plate number: " + plateNumber);
          }
        } else {
          console.log("No such document for plate number:", plateNumber);
        }
      });
    }
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
}

fetchData();