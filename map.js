// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC63fKcQygMGxuaekB3LUhLHBrtePlgorc",
  authDomain: "plasware-pr.firebaseapp.com",
  projectId: "plasware-pr",
  storageBucket: "plasware-pr.appspot.com",
  messagingSenderId: "754561855795",
  appId: "1:754561855795:web:168f7ae976c39df1a0ce46",
  measurementId: "G-XKGCH0KJ5Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Export Firestore instance

// Reference to the input fields
const locationInput = document.getElementById("location-search");
const wasteCategorySelect = document.getElementById("waste-category");
const dropPoint = document.getElementById("dropPoint");
const suggestionsList = document.getElementById("suggestions");
let map;

// Initialize the Leaflet map (centered on a default location)
function initMap() {
  map = L.map("map").setView([6.44107845, 7.538320722978639], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);
}

// When a waste type is selected from the dropdown, place markers
wasteCategorySelect.addEventListener("change", function () {
  if (this.value !== "") {
    dropPoint.disabled = false;
    // placeMarkersForWasteType(this.value); // Place markers based on selected type
  } else {
    dropPoint.disabled = true;
  }
});

dropPoint.addEventListener("change", () => {
  if (this.value !== "") {
    placeMarkersForWasteType(this.value); // Place markers based on selected type
  }
});

// Function to place markers based on the selected waste type
async function placeMarkersForWasteType(wasteType) {
  // Clear existing markers
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Fetch dumping sites from Firestore based on waste type
  const dumpingSitesSnapshot = await getDocs(collection(db, "dumpingSites"));
  const markers = [];
  let foundLocation = false;

  dumpingSitesSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.wasteType === wasteType) {
      // Shorten description for excerpt and create a "Read more" link
      const descriptionExcerpt = data.description.slice(0, 100) + "...";
      const popupContent = `
                <b>${data.address}</b><br>
                <b>${data.name}</b><br>
                <img src="${data.imageUrl}" alt="Waste Type Image" style="width:100px; height:auto;"><br>
                <p>${descriptionExcerpt} <a href="location-details.html?id=${doc.id}" target="_blank">Read more</a></p>
            `;

      // Place a marker for each matching dumpsite
      const marker = L.marker([data.latitude, data.longitude])
        .addTo(map)
        .bindPopup(popupContent);

      markers.push(marker.getLatLng()); // Add marker location to array
      foundLocation = true;
    }
  });

  // Adjust map view to fit all markers if any are found
  if (foundLocation) {
    const bounds = L.latLngBounds(markers); // Create bounds based on marker locations
    map.fitBounds(bounds); // Fit map view to bounds
  } else {
    alert("No dumpsites found for the selected waste type.");
  }
}

// Initialize the map when the page loads
document.addEventListener("DOMContentLoaded", () => {
  initMap();
});
