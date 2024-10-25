// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

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
export const db = getFirestore(app);  // Export Firestore instance

// Reference to the input fields
const locationInput = document.getElementById("location-search");
const wasteCategorySelect = document.getElementById("waste-category");
const suggestionsList = document.getElementById("suggestions");
let map, marker;

// Initialize the Leaflet map (centered on NYC as default)
function initMap() {
    map = L.map('map').setView([40.7128, -74.0060], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

/* Function to fetch waste types from Firestore and populate suggestions
async function fetchWasteTypes() {
    const wasteTypesSnapshot = await getDocs(collection(db, 'wasteTypes'));
    const wasteTypes = [];
    
    wasteTypesSnapshot.forEach(doc => {
        wasteTypes.push(doc.data().name);
    });
    return wasteTypes;
}

// Show waste type suggestions as the user types
locationInput.addEventListener("input", async function () {
    const query = locationInput.value.toLowerCase();
    if (query.length > 2) {
        const wasteTypes = await fetchWasteTypes();
        const filteredWasteTypes = wasteTypes.filter(type => type.toLowerCase().includes(query));
        suggestionsList.innerHTML = ''; // Clear previous suggestions

        filteredWasteTypes.forEach(type => {
            const li = document.createElement("li");
            li.textContent = type;
            li.addEventListener("click", function () {
                locationInput.value = type; // Set the selected suggestion
                suggestionsList.innerHTML = ''; // Clear suggestions
                placeMarkerOnMap(); // Place marker based on selected type
            });
            suggestionsList.appendChild(li);
        });
    } else {
        suggestionsList.innerHTML = ''; // Clear suggestions if less than 3 chars
    }
});
*/
// When a waste type is selected from the dropdown, place a marker
wasteCategorySelect.addEventListener("change", function () {
    if (this.value !== "") {
        placeMarkerOnMap(); // Place marker based on selected type
    }
});

// Function to place a marker based on the selected waste type
async function placeMarkerOnMap() {
    const wasteType = locationInput.value || wasteCategorySelect.value;

    if (!wasteType) {
        alert("Please select or search a waste type.");
        return;
    }

    // Fetch location from Firestore based on waste type
    const dumpingSitesSnapshot = await getDocs(collection(db, 'dumpingSites'));
    dumpingSitesSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.wasteType === wasteType) {
            if (marker) {
                map.removeLayer(marker); // Remove the previous marker if it exists
            }
            marker = L.marker([data.latitude, data.longitude]).addTo(map)
                .bindPopup(`<b>${data.address}</b><br><b>${data.name}</b><br>${data.description}`).openPopup();

            map.setView([data.latitude, data.longitude], 13); // Center the map on the location
        }
    });
}

// Initialize the map when the page loads
document.addEventListener("DOMContentLoaded", () => {
    initMap();
});
