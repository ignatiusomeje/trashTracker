// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC63fKcQygMGxuaekB3LUhLHBrtePlgorc",
    authDomain: "plasware-pr.firebaseapp.com",
    projectId: "plasware-pr",
    storageBucket: "plasware-pr.appspot.com",
    messagingSenderId: "754561855795",
    appId: "1:754561855795:web:168f7ae976c39df1a0ce46",
    measurementId: "G-XKGCH0KJ5Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get document ID from URL
const urlParams = new URLSearchParams(window.location.search);
const docId = urlParams.get("id");

// Get references to HTML elements
const locationNameElem = document.getElementById("location-name");
const locationAddressElem = document.getElementById("location-address");
const locationImageElem = document.getElementById("location-image");
const locationDescriptionElem = document.getElementById("location-description");

// Function to fetch and display dumpsite details
async function displayLocationDetails() {
    if (!docId) {
        locationNameElem.textContent = "Location not found.";
        return;
    }

    const docRef = doc(db, "dumpingSites", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        locationNameElem.textContent = data.name || "No Name Available";
        locationAddressElem.textContent = data.address || "No Address Available";
        locationDescriptionElem.textContent = data.description || "No Description Available";
        
        // Display image if available
        if (data.imageUrl) {
            locationImageElem.src = data.imageUrl;
            locationImageElem.style.display = "block";
        }
    } else {
        locationNameElem.textContent = "Location details not found.";
    }
}

// Call the function to display details on page load
displayLocationDetails();
