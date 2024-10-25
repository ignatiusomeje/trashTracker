// Import Firebase modules
import { db } from './map.js';  // Import the Firestore instance
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Your existing Firebase configuration can be removed since it's now in map.js
// or you can keep it for context.
/*
document.getElementById("search-button").addEventListener("click", function () {
    const query = document.getElementById("location-search").value;

    if (query) {
        fetchLocations(query);
    } else {
        alert("Please enter a search query.");
    }
});
*/
// Function to fetch locations based on the query
function fetchLocations(query) {
    const queryRef = collection(db, "dumpingSites");
    
    getDocs(queryRef)
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.name.includes(query) || data.description.includes(query)) {
                    // Add markers on the map for matching locations
                    addMarkerToMap(data.lat, data.lon, data.name);
                }
            });
        })
        .catch((error) => {
            console.error("Error fetching locations from Firestore:", error);
        });
}

// Function to add a marker to the map
function addMarkerToMap(lat, lon, name) {
    const marker = L.marker([lat, lon]).addTo(map);  // Ensure map variable is accessible
    marker.bindPopup(`<b>${name}</b>`).openPopup();
}
